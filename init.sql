CREATE DATABASE IF NOT EXISTS coin;

use coin;

CREATE TABLE IF NOT EXISTS coinHistory (
  _id INT NOT NULL AUTO_INCREMENT,
  coinName VARCHAR(255),
  coinCode VARCHAR(255),
  recordDate VARCHAR(255),
  open FLOAT,
  close FLOAT,
  hight FLOAT,
  low FLOAT,
  volume FLOAT,
  marketCap FLOAT,
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
