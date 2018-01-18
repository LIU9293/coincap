const express = require('express');
const compression = require('compression');
const cors = require('cors');
const { getCoinHistory, getAllCoinsForDay, getAllCoins } = require('../db/api');

const port = process.env.PORT || 8001;
const app = express();

// Enable CORS with various options
// https://github.com/expressjs/cors
app.use(cors());

// gzip
app.use(compression());

app.get('/api/coin_history/:coinName', (req, res) => {
  const { coinName } = req.params;
  const { start, end } = req.query;
  getCoinHistory(coinName, start, end)
    .then(data => res.json(data))
    .catch(err => res.send(err));
});

app.get('/api/day_rank/:date', (req, res) => {
  const { date } = req.params;
  getAllCoinsForDay(date)
    .then(data => res.json(data))
    .catch(err => res.send(err));
});

app.get('/api/coins', (req, res) => {
  getAllCoins()
    .then(data => res.json(data))
    .catch(err => res.send(err));
});

app.listen(port);

console.log(`server started on port ${port}`); // eslint-disable-line
