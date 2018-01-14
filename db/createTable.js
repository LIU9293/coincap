const connection = require('./index');

connection.connect();

connection.query(`
  CREATE DATABASE IF NOT EXISTS coin;

  use coin;

  CREATE TABLE IF NOT EXISTS coinHistory (
    _id INT NOT NULL AUTO_INCREMENT,
    coinName VARCHAR(255),
    coinCode VARCHAR(255),
    recordDate VARCHAR(255),
    open FLOAT,
    close FLOAT,
    high FLOAT,
    low FLOAT,
    volume BIGINT,
    marketCap BIGINT,
    coinRank INT,
    updateAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

  CREATE TABLE IF NOT EXISTS coinList (
    _id INT NOT NULL AUTO_INCREMENT,
    coinName VARCHAR(255),
    coinCode VARCHAR(255),
    coinRank INT,
    PRIMARY KEY (_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

`, function (err, res, fields) {
  if (err) {
    console.log(err);
    connection.end();
  } else {
    console.log('Create Database and Tables Successfully !');
    connection.end();
  }
});
