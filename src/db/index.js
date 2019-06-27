const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB || 'coin',
  multipleStatements: true,
  inscure: process.env.DB_INSCURE || false,
});

module.exports = connection;
