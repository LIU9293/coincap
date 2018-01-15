const connection = require('./index');
connection.connect();

function insertCoinList(coin, callback) {
  const query = `
    use coin;

    INSERT INTO coinList
    (coinName, coinCode, coinRank) VALUES
    ('${coin.coinName}', '${coin.coinCode}', ${coin.rank});
  `;

  connection.query(query, function(err, res, fields) {
    if (err) {
      callback(error, connection);
    } else {
      callback(null, connection);
    }
  });
}

function insertCoinHistory(coin, callback) {
  const query = `
    use coin;

    INSERT INTO coinHistory
    (coinName, coinCode, recordDate, recordDataUnix, open, close, high, low, volume, marketCap) VALUES
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

  connection.query(query, function(err, res, fields) {
    if (err) {
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
