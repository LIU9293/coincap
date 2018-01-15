const events = require('events');
const eventEmitter = new events.EventEmitter();
const getAllCoins = require('./getAllCoins');
const { insertCoinList } = require('../db/insertData');

let index = 0;
let coinList = [];

const insertOneCoin = () => {
  insertCoinList(coinList[index], (error, connection) => {
    if (error) {
      console.log('===== error: =====\n', error);
      connection.end();
      return;
    }
    console.log(`the coin ${coinList[index].coinCode} inserted`);
    if (index === coinList.length - 1) {
      console.log('get all coins success, finished !');
      connection.end();
      return;
    }
    index = index + 1;
    eventEmitter.emit('INSERT_NEXT');
  });
};

eventEmitter.on('INSERT_NEXT', insertOneCoin);

getAllCoins().then(res => {
  coinList = res;
  insertOneCoin();
});
