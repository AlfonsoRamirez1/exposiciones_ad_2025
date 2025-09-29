from faker import Faker
import random
from datetime import datetime, timedelta
from app import db, Cliente, Vendedor, Producto, Inventario, Venta

fake = Faker("es_MX")

def seed_data():
    # === CLIENTES ===
    clientes = []
    estados = ["Coahuila de Zaragoza", "Chihuahua", "Durango", "Guanajuato", "Nuevo León", "Querétaro"]
    for _ in range(50):  # 50 clientes
        cliente = Cliente(nombre=fake.name(), estado=random.choice(estados))
        clientes.append(cliente)
        db.session.add(cliente)

    # === VENDEDORES ===
    vendedores = []
    for _ in range(25):  # 10 vendedores
        vendedor = Vendedor(nombre=fake.name())
        vendedores.append(vendedor)
        db.session.add(vendedor)

    # === PRODUCTOS ===
    productos_data = [
        ("Espresso", "Bebida Caliente", 45.00),
        ("Cappuccino", "Bebida Caliente", 55.00),
        ("Latte", "Bebida Caliente", 60.00),
        ("Americano", "Bebida Caliente", 40.00),
        ("Mocha", "Bebida Caliente", 65.00),
        ("Cold Brew", "Bebida Fría", 70.00),
        ("Frappuccino", "Bebida Fría", 75.00),
        ("Café de Olla", "Bebida Caliente", 50.00),
        ("Affogato", "Postre", 80.00),
        ("Macchiato", "Bebida Caliente", 58.00),
    ]

    productos = []
    for nombre, categoria, precio in productos_data:
        producto = Producto(nombre=nombre, categoria=categoria, precio_unitario=precio)
        productos.append(producto)
        db.session.add(producto)

    db.session.commit()

    # === INVENTARIO ===
    for producto in productos:
        stock = random.randint(100, 500)
        inv = Inventario(id_producto=producto.id_producto, stock=stock)
        db.session.add(inv)

    db.session.commit()

    # === VENTAS ===
    metodos_pago = ["Efectivo", "Tarjeta", "Transferencia"]
    start_date = datetime(2025, 1, 1)
    end_date = datetime(2025, 9, 1)

    for _ in range(5000):  # generar 5000 ventas
        cliente = random.choice(clientes)
        vendedor = random.choice(vendedores)
        producto = random.choice(productos)

        fecha = fake.date_between(start_date=start_date, end_date=end_date)
        cantidad = random.randint(1, 5)
        total = cantidad * float(producto.precio_unitario)

        venta = Venta(
            fecha=fecha,
            id_cliente=cliente.id_cliente,
            id_vendedor=vendedor.id_vendedor,
            id_producto=producto.id_producto,
            cantidad=cantidad,
            total=total,
            metodo_pago=random.choice(metodos_pago),
        )
        db.session.add(venta)

    db.session.commit()
    print("Datos generados con éxito")
