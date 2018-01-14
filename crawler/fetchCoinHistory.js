const events = require('events');
const eventEmitter = new events.EventEmitter();
const getAllCoins = require('./getAllCoins');
const getCoinHistory = require('./coinHistoryData');
const { insertCoinHistory } = require('../db/insertData');
const MAX_COIN_INDEX = 50;

let coinListIndex = 0;
let coinList = [];

let coinHistoryIndex = 0;
let coinHistory = [];

const insertOneRecord = () => {
  insertCoinHistory(coinHistory[coinHistoryIndex], (error, connection) => {
    if (error) {
      console.log('===== error: =====\n', error);
      connection.end();
      return;
    }
    console.log(`the coin ${coinHistory[coinHistoryIndex].coinCode} - ${coinHistory[coinHistoryIndex].date} inserted`);
    if (coinHistoryIndex === coinHistory.length - 1) {

      if (coinListIndex === MAX_COIN_INDEX) {
        console.log('------ finished ------');
        connection.end();
        return;
      }
      console.log(`the coin ${coinHistory[coinHistoryIndex].coinCode} history insert completed`);
      eventEmitter.emit('NEXT_COIN');
      return;
    }
    coinHistoryIndex = coinHistoryIndex + 1;
    eventEmitter.emit('INSERT_NEXT')
  })
}

const getNextHistory = () => {
  const nextCoin = coinList[coinListIndex];
  console.log(`----- will fetch ${nextCoin.coinName} data, it is ${coinListIndex}/${coinList.length} ------`);
  getCoinHistory(nextCoin.coinName, nextCoin.coinCode, history => {
    coinHistory = history;
    coinHistoryIndex = 0;
    coinListIndex = coinListIndex + 1;
    eventEmitter.emit('INSERT_NEXT');
  })
}

eventEmitter.on('INSERT_NEXT', insertOneRecord);
eventEmitter.on('NEXT_COIN', getNextHistory)

getAllCoins()
  .then(res => {
    coinList = res;
    getNextHistory();
  })
  .catch(err => {
    console.log(err);
    exit(0);
  })
