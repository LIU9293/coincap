const fetch = require('node-fetch');
const moment = require('moment');
const connection = require('../db');
connection.connect();

const getLastDate = () => {
  return new Promise((resolve, reject) => {
    connection.query(
      `
        SELECT recordDateUnix
        FROM coinHistory
        ORDER BY recordDateUnix DESC
        LIMIT 1;
      `,
      (err, res) => {
        if (err) {
          console.log(`get last day error: `, err);
          reject(err)
        } else {
          resolve(res[0].recordDateUnix * 1000)
        }
      }
    )
  })
};

const getData = async date => {
  const nextDate = moment(date).add(1, 'd').format('YYYY-MM-DD');
  const API = `https://web-api.coinmarketcap.com/v1/cryptocurrency/listings/historical?date=${nextDate}&start=1&limit=3000`;

  const res = await fetch(API);
  const json = await res.json();

  const { data } = json;
  if (!data) {
    throw new Error(json.status.error_message)
  }
  return data
}

const insert = (data, date, dateUnix) => {
  return new Promise((resolve, reject) => {
    const formattedData = data.map(item => {
      return [
        item.slug,
        item.symbol,
        date,
        dateUnix,
        item.quote.USD.price,
        item.quote.USD.volume_24h,
        item.quote.USD.market_cap
      ]
    })
    connection.query(`
      INSERT INTO coinHistory (coinName, coinCode, recordDate, recordDateUnix, close, volume, marketCap) VALUES ?
    `, [formattedData], (err, res) => {
      if (err) {
        console.log(`insert data error: `, err);
      } else {
        resolve(res)
      }
    })
  })
}

const run = async () => {
  try {
    const date = await getLastDate();
    const nextDate = moment(date).add(1, 'd').format('YYYY-MM-DD');
    console.log(`last date is ${moment(date).format('YYYY-MM-DD')}, next is ${nextDate}`);
    const data = await getData(date);
    console.log(`${nextDate} data got, length ${data.length}`);
    const res = await insert(data, nextDate, moment(nextDate).format('X'));

    console.log(`insert data done for ${nextDate}, will wait for next one!`);
    setTimeout(run, 12 * 60 * 60 * 1000)
  } catch (error) {
    console.log(error);
    process.exit(1); 
  } 
}

run()