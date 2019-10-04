const mysql = require('mysql');
const util = require('util');

const config = {
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: '',
    database: 'cooperative_user',
    connectionLimit: 10
  };
  
const pool = mysql.createPool(config);


pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.')
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections.')
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused.')
    }
  }
  if (connection) connection.release()
  return
})

pool.query = util.promisify(pool.query);

module.exports = pool;