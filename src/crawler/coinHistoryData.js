const Crawler = require('crawler');
const moment = require('moment');
const numeral = require('numeral');

const mapCoinHistoryData = (coinName, coinCode, callback) => {
  return function(error, res, done) {
    if (error) {
      console.log(error);
    } else {
      const $ = res.$;
      const bodyString = $('tbody > tr.text-right').text();

      const dataArray = bodyString
        .split('\n')
        .map(item => item.trim())
        .filter(item => item !== '' && item !== '\n');
      let finalData = [];
      let coinObject = {};
      for (let i = 0; i < dataArray.length; i++) {
        switch (i % 7) {
          case 0:
            coinObject.date = dataArray[i];
            coinObject.dateUnix = moment(dataArray[i], 'MMM DD, YYYY').format(
              'X'
            );
            break;
          case 1:
            coinObject.open = numeral(dataArray[i])._value;
            break;
          case 2:
            coinObject.high = numeral(dataArray[i])._value;
            break;
          case 3:
            coinObject.low = numeral(dataArray[i])._value;
            break;
          case 4:
            coinObject.close = numeral(dataArray[i])._value;
            break;
          case 5:
            if (dataArray[i] === '-') {
              coinObject.volume = 0;
            } else {
              coinObject.volume = numeral(dataArray[i])._value;
            }
            break;
          case 6:
            if (dataArray[i] === '-') {
              coinObject.marketCap = 0;
            } else {
              coinObject.marketCap = numeral(dataArray[i])._value;
            }
            finalData = finalData.concat(coinObject);
            coinObject = {};
            break;
          default:
            break;
        }
      }
      callback(
        finalData.map(item => {
          return Object.assign({}, item, {
            coinCode,
            coinName,
          });
        })
      );
    }
    done();
  };
};

const getHistoryDataForCoin = (coinName, coinCode, callback) => {
  const C = new Crawler({
    callback: mapCoinHistoryData(coinName, coinCode, callback),
  });

  C.queue(
    `https://coinmarketcap.com/currencies/${coinName}/historical-data/?start=20130428&end=${moment().format(
      'YYYYMMDD'
    )}`
  );
};

module.exports = getHistoryDataForCoin;
