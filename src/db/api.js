const moment = require('moment');
const connection = require('./index');
connection.connect();

const getCoinHistory = (coinName, start, end) => {
  const startUnix = moment(start || '20130428').format('X');
  const endUnix = end ? moment(end).format('X') : moment().format('X');
  return new Promise((resolve, reject) => {
    connection.query(
      `
      SELECT recordDate, marketCap, close, volume, coinRank, coinCode, coinName from coinHistory
      WHERE coinName='${coinName}' and recordDateUnix >= ${startUnix} and recordDateUnix <= ${endUnix}
      ORDER BY recordDateUnix;
    `,
      (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res[1]);
        }
      }
    );
  });
};

const getAllCoinsForDay = day => {
  const recordDate = moment(day).format('MMM DD, YYYY');
  return new Promise((resolve, reject) => {
    connection.query(
      `
      SELECT recordDate, coinCode, coinName, marketCap, close, volume, coinRank from coinHistory
      WHERE recordDate='${recordDate}'
      ORDER BY coinRank;
    `,
      (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res[1]);
        }
      }
    );
  });
};

const getAllCoins = () => {
  return new Promise((resolve, reject) => {
    connection.query(
      `
      SELECT coinName, coinCode, coinRank from coinList
      ORDER BY coinRank;
      ;
    `,
      (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res[1]);
        }
      }
    );
  });
};

module.exports = {
  getCoinHistory,
  getAllCoinsForDay,
  getAllCoins,
};
