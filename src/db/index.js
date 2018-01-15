const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  multipleStatements: true,
  inscure: process.env.DB_INSCURE,
});

module.exports = connection;
