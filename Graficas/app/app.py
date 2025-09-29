from flask import Flask, jsonify, request, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://postgres:contraseña@localhost:5432/coffe_sales"
# Configuración para PostgreSQL
# app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://miusuario:mipassword@localhost:5432/mibasedatos"
# Configuración para MySQL
# app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://miusuario:mipassword@localhost:3306/mibasedatos"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Definición del modelo
class Cliente(db.Model):
    __tablename__ = "clientes"
    id_cliente = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    estado = db.Column(db.String(50), nullable=False)

    ventas = db.relationship("Venta", backref="cliente", lazy=True)


class Vendedor(db.Model):
    __tablename__ = "vendedores"
    id_vendedor = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)

    ventas = db.relationship("Venta", backref="vendedor", lazy=True)


class Producto(db.Model):
    __tablename__ = "productos"
    id_producto = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50), nullable=False)
    categoria = db.Column(db.String(50), nullable=False)
    precio_unitario = db.Column(db.Numeric(10, 2), nullable=False)

    inventario = db.relationship("Inventario", backref="producto", uselist=False)
    ventas = db.relationship("Venta", backref="producto", lazy=True)


class Inventario(db.Model):
    __tablename__ = "inventario"
    id_inventario = db.Column(db.Integer, primary_key=True)
    id_producto = db.Column(db.Integer, db.ForeignKey("productos.id_producto"), nullable=False)
    stock = db.Column(db.Integer, nullable=False)


class Venta(db.Model):
    __tablename__ = "ventas"
    id_venta = db.Column(db.Integer, primary_key=True)
    fecha = db.Column(db.Date, nullable=False)
    id_cliente = db.Column(db.Integer, db.ForeignKey("clientes.id_cliente"))
    id_vendedor = db.Column(db.Integer, db.ForeignKey("vendedores.id_vendedor"))
    id_producto = db.Column(db.Integer, db.ForeignKey("productos.id_producto"))
    cantidad = db.Column(db.Integer, nullable=False)
    total = db.Column(db.Numeric(10, 2), nullable=False)
    metodo_pago = db.Column(db.String(30), nullable=False)


@app.route('/')
def dashboard():
    return render_template('dashboard.html')

@app.route('/api/ventas_por_productos')
def ventas_productos():
    # Ventas por productos
    ventas_agrupadas = db.session.query(
        Producto.nombre,
        db.func.sum(Venta.total).label('total')
    )\
    .filter(Venta.id_producto == Producto.id_producto)\
    .group_by(Venta.id_producto, Producto.nombre)\
    .order_by(db.desc('total'))\
    .limit(6)\
    .all()

    # Convertir a lista de diccionarios
    resultado = [{'producto': v[0], 'total': float(v[1])} for v in ventas_agrupadas]
    return jsonify(resultado)

@app.route('/api/metodos_pago')
def metodo_pago():

    metodos_agrupados = db.session.query(
        Venta.metodo_pago,
        db.func.sum(Venta.total).label('total')
    )\
    .group_by(Venta.metodo_pago)\
    .all()

    # Calcular el total general de ventas
    total_ventas = sum([float(m[1]) for m in metodos_agrupados])

    # Convertir a lista de diccionarios con porcentaje
    resultado = []
    for m in metodos_agrupados:
        porcentaje = (float(m[1]) / total_ventas * 100) if total_ventas > 0 else 0
        resultado.append({
            'metodo_pago': m[0],
            'porcentaje': round(porcentaje, 2)
        })

    return jsonify(resultado)

@app.route('/api/top_clientes')
def top_clientes():
    top_clientes = db.session.query(
        Cliente.nombre,
        db.func.sum(Venta.total).label('total')
    )\
    .filter(Venta.id_cliente == Cliente.id_cliente)\
    .group_by(Cliente.id_cliente, Cliente.nombre)\
    .order_by(db.desc('total'))\
    .limit(8)\
    .all()

    resultado = [{'cliente': c[0], 'total': float(c[1])} for c in top_clientes]

    return jsonify(resultado)

@app.route('/api/top_vendedores')
def top_vendedores():
    # Top 5 vendedores con sus productos más vendidos
    top_vendedores = db.session.query(
        Vendedor.id_vendedor,
        Vendedor.nombre,
        db.func.sum(Venta.total).label('total')
    )\
    .filter(Venta.id_vendedor == Vendedor.id_vendedor)\
    .group_by(Vendedor.id_vendedor, Vendedor.nombre)\
    .order_by(db.desc('total'))\
    .limit(5)\
    .all()

    resultado = []
    for v in top_vendedores:
        # Para cada vendedor, obtener sus productos más vendidos
        productos = db.session.query(
            Producto.nombre,
            db.func.sum(Venta.total).label('total')
        )\
        .filter(Venta.id_vendedor == v[0])\
        .filter(Venta.id_producto == Producto.id_producto)\
        .group_by(Producto.id_producto, Producto.nombre)\
        .order_by(db.desc('total'))\
        .all()

        productos_vendedor = [{'producto': p[0], 'total': float(p[1])} for p in productos]
        resultado.append({
            'vendedor': v[1],
            'total': float(v[2]),
            'productos': productos_vendedor
        })

    return jsonify(resultado)

@app.route('/api/ventas_por_estado')
def ventas_por_estado():
    ventas_estado = db.session.query(
        Cliente.estado,
        db.func.sum(Venta.total).label('total')
    )\
    .filter(Venta.id_cliente == Cliente.id_cliente)\
    .group_by(Cliente.estado)\
    .order_by(db.desc('total'))\
    .all()

    resultado = [{'estado': e[0], 'total': float(e[1])} for e in ventas_estado]

    return jsonify(resultado)


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        print("Los modelos han sido creados.")
    app.run(debug=True)
