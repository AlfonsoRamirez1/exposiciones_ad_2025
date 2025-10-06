const mysql = require('mysql2');

// Configuracion de conexion.
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'api_test'
});

// Verificacion de la conexion.
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar con MySQL:', err);
    return;
  }
  console.log('Conexión a MySQL exitosa.');
});

module.exports = connection;
