const connection = require('./index');
connection.connect();

function insertCoinList(coin, callback) {
  const query = `
    INSERT INTO coinList
    (coinName, coinCode, coinRank) VALUES
    ('${coin.coinName}', '${coin.coinCode}', ${coin.rank});
  `;

  connection.query(query, err => {
    if (err) {
      callback(err, connection);
    } else {
      callback(null, connection);
    }
  });
}

function insertCoinHistory(coin, callback) {
  const query = `
    INSERT INTO coinHistory
    (coinName, coinCode, recordDate, recordDateUnix, open, close, high, low, volume, marketCap) VALUES
    ('${coin.coinName}',
     '${coin.coinCode}',
     '${coin.date}',
     ${coin.dateUnix},
     ${coin.open},
     ${coin.close},
     ${coin.high},
     ${coin.low},
     '${coin.volume}',
     '${coin.marketCap}'
    );
  `;

  connection.query(query, err => {
    if (err) {
      console.log('insert coin history error:');
      console.log(JSON.stringify(coin, null, 2));
      callback(err, connection);
    } else {
      callback(null, connection);
    }
  });
}

module.exports = {
  insertCoinList,
  insertCoinHistory,
};
