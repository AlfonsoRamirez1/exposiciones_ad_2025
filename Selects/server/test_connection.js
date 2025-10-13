// test-connection.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function testConnection() {
  try {
    await pool.query('SELECT NOW()');
    console.log('✅ Conexión exitosa');
    await pool.end();
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    await pool.end();
    process.exit(1);
  }
}

testConnection();