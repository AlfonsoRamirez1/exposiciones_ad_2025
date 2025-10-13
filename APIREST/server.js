// Importar Express
const express = require('express');
const app = express();

// Importar Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// Importar CORS
const cors = require('cors');

// Importar DB
const db = require('./db');

// Habilitar CORS
app.use(cors());

// Configuración basica de Swagger
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API REST, ejemplo",
            version: "1.0.0",
            description: "Ejemplo de API REST documentado con Swagger",
        },
    },
    apis: ["./server.js"],
};


// Middleware para interpretar JSON
app.use(express.json());

// Puerto del servidor
const PORT = 3000;

// ----- RUTAS -------

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
// Obtener todos los usuarios
app.get('/usuarios', (req, res) => {
  db.query('SELECT * FROM usuarios', (err, results) => {
    if (err) {
      console.error('Error al obtener usuarios:', err);
      res.status(500).json({ error: 'Error al obtener usuarios' });
    } else {
      res.json(results);
    }
  });
});

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Obtiene un usuario por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 */
// Obtener un usuario por ID
app.get('/usuarios/:id', (req, res) => {
  const { id } = req.params;
    db.query('SELECT * FROM usuarios WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error al obtener usuario:', err);
            res.status(500).json({ error: 'Error al obtener usuario' });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'Usuario no encontrado' });
        } else {
            res.json(results[0]);
        }
    });
});

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Crea un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - correo
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Juan Pérez
 *               correo:
 *                 type: string
 *                 example: juan@example.com
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 3
 *                 nombre:
 *                   type: string
 *                   example: Juan Pérez
 *                 correo:
 *                   type: string
 *                   example: juan@example.com
 */
// Agregar un nuevo usuario
app.post('/usuarios', (req, res) => {
  const { nombre, correo } = req.body;
  db.query(
    'INSERT INTO usuarios (nombre, correo) VALUES (?, ?)',
    [nombre, correo],
    (err, result) => {
      if (err) {
        console.error('Error al agregar usuario:', err);
        res.status(500).json({ error: 'Error al agregar usuario' });
      } else {
        res.json({ message: 'Usuario agregado correctamente', id: result.insertId });
      }
    }
  );
});

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Actualiza la información de un usuario existente
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Carlos Gómez
 *               correo:
 *                 type: string
 *                 example: carlos@example.com
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       404:
 *         description: Usuario no encontrado
 */
// Actualizar un usuario existente
app.put('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, correo } = req.body;
  db.query(
    'UPDATE usuarios SET nombre = ?, correo = ? WHERE id = ?',
    [nombre, correo, id],
    (err) => {
      if (err) {
        console.error('Error al actualizar usuario:', err);
        res.status(500).json({ error: 'Error al actualizar usuario' });
      } else {
        res.json({ message: 'Usuario actualizado correctamente' });
      }
    }
  );
});

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Elimina un usuario por su ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *       404:
 *         description: Usuario no encontrado
 */
// Eliminar un usuario
app.delete('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM usuarios WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('Error al eliminar usuario:', err);
      res.status(500).json({ error: 'Error al eliminar usuario' });
    } else {
      res.json({ message: 'Usuario eliminado correctamente' });
    }
  });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Configurar Swagger UI
const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));