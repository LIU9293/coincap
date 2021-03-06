const events = require('events');
const eventEmitter = new events.EventEmitter();
const getAllCoins = require('./getAllCoins');
const getCoinHistory = require('./coinHistoryData');
const { insertCoinHistory } = require('../db/insertData');
const { MAX_COIN_INDEX } = require('../config');

let coinListIndex = 0;
let coinList = [];

let coinHistoryIndex = 0;
let coinHistory = [];

const insertOneRecord = () => {
  if (!coinHistory[coinHistoryIndex]) {
    console.log('*****************************');
    console.log('* error: ', `current coin is: ${coinList[coinListIndex - 1]}`);
    console.log('*        ', `coin list length: ${coinList.length}. coin list index: ${coinListIndex}`)
    console.log('*        ', `coin history length is: ${coinHistory.length}`);
    console.log('*        ', `coin history index is: ${coinHistoryIndex}`);
    console.log('*****************************');
  }

  insertCoinHistory(coinHistory[coinHistoryIndex], (error, connection) => {
    if (error) {
      console.log('===== error: =====\n', error);
      connection.end();
      return;
    }
    if (coinHistoryIndex === coinHistory.length - 1) {
      if (coinListIndex === parseInt(MAX_COIN_INDEX, 10)) {
        console.log('------ finished ------');
        connection.end();
        return;
      }
      console.log(
        `the coin ${
          coinHistory[coinHistoryIndex].coinCode
        } history insert completed, ${coinListIndex}/${MAX_COIN_INDEX}`
      );
      eventEmitter.emit('NEXT_COIN');
      return;
    }
    coinHistoryIndex = coinHistoryIndex + 1;
    eventEmitter.emit('INSERT_NEXT');
  });
};

const getNextHistory = () => {
  const nextCoin = coinList[coinListIndex];
  getCoinHistory(nextCoin.coinName, nextCoin.coinCode, history => {
    console.log(`the coin ${nextCoin.coinCode} history got, length ${history.length}`);
    if (history.length === 0) {
      console.log(`the coin ${nextCoin.coinCode} history strange, will retry...`);
      return setTimeout(getNextHistory, 5000);
    }
    coinHistory = history;
    coinHistoryIndex = 0;
    coinListIndex = coinListIndex + 1;
    eventEmitter.emit('INSERT_NEXT');
  });
};

eventEmitter.on('INSERT_NEXT', insertOneRecord);
eventEmitter.on('NEXT_COIN', getNextHistory);

getAllCoins()
  .then(res => {
    coinList = res;
    getNextHistory();
  })
  .catch(err => {
    console.log(err);
  });
