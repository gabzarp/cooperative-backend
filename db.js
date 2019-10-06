const mysql = require('promise-mysql');
const util = require('util');

const config = {
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: '',
    database: 'cooperative_user',
    connectionLimit: 10,
    multipleStatements: true
  };
  
const pool = mysql.createPool(config);


module.exports = pool;