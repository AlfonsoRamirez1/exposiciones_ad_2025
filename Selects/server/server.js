const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    max : 20,
    idleTimeoutMillis : 30000,
    connectionTimeoutMillis : 2000,
});

// Test de conexión
pool.on('connect', () => {
    console.log('Conectado a la base de datos');
});

pool.on('error', (err) => {
    console.log('Error al conectarse a la base de datos', err)
})


// Endpoint para obtener países
app.get('/api/countries', async (req, res) => {
    try {
        const result = await pool.query('Select * from countries ORDER BY nombre');
        res.json(result.rows)
    } catch (error) {
        console.error('Error al obtener los países:', error);
        res.status(500).json({ error: 'Error al obtener los paísesses' });
    }
});

// Endpoint para obtener ciudades por país
app.get('/api/cities/:countryId', async (req, res) => {
    try {
        const { countryId } = req.params;
        const result = await pool.query(
            'SELECT * FROM cities WHERE country_id = $1 ORDER BY nombre',
            [countryId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener las ciudades:', error);
        res.status(500).json({ error: 'Error al obtener las ciudades' });
    }
});

// Endpoint para obtener localidades por ciudad
app.get('/api/localities/:cityId', async (req, res) => {
    try {
        const { cityId } = req.params;
        const result = await pool.query (
            'SELECT * FROM localities WHERE city_id = $1 ORDER BY nombre',
            [cityId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener las localidades:', error);
        res.status(500).json({ error: 'Error al obtener las localidades' });
    }
});


// Endpoint de salud para verificar el servidor
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Servidor funcionando correctamente' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('uy, algo salio mal!');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    pool.end(() => {
        console.log('Database connection closed');
        process.exit(0);
    });
});