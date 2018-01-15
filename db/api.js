const moment = require('moment');
const connection = require('./index');

const getCoinHistory = coinCode => {
  return new Promise((resolve, reject) => {
    connection.connect();

    connection.query(
      `
      use coin;

      SELECT recordDate, marketCap, close, volume, coinRank from coinHistory
      WHERE coinCode='${coinCode}'
    `,
      (err, res, fields) => {
        if (err) {
          connection.end();
          reject(err);
        } else {
          connection.end();
          resolve(res[1]);
        }
      }
    );
  });
};

const getAllCoinsForDay = day => {
  const recordDate = moment(day).format('MMM DD, YYYY');

  return new Promise((resolve, reject) => {
    connection.connect();

    connection.query(
      `
      use coin;

      SELECT recordDate, coinCode, coinName, marketCap, close, volume, coinRank from coinHistory
      WHERE recordDate='${recordDate}'
      ORDER BY coinRank;
    `,
      (err, res, fields) => {
        if (err) {
          connection.end();
          reject(err);
        } else {
          connection.end();
          resolve(res[1]);
        }
      }
    );
  });
};

module.exports = {
  getCoinHistory,
  getAllCoinsForDay,
};
