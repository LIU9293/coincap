const getHistoryDataForCoin = require('./crawler/coinHistoryData');

// require('./db/createTable');
getHistoryDataForCoin(
  'gxshares',
  'GXS',
  data => console.log(data)
)
