const connection = require('./index');

connection.connect();

connection.query(`
  use coin;

  DROP TABLE coinHistory;

  DROP TABLE coinList;

`, function (err, res, fields) {
  if (err) {
    console.log(err);
    connection.end();
  } else {
    console.log('Delete Tables Successfully !');
    connection.end();
  }
});
