// select * from coinHistory where recordDate='May 29, 2017' order by CONVERT(marketCap, SIGNED)
// select distinct(recordDate) from coinHistory;
const events = require('events');
const connection = require('./index');
const getAllDates = `
  select distinct(recordDate) from coinHistory;
`;

connection.connect();

let recordDateList = [];
let recordDateListIndex = 0;

let dayCoinList = [];
let dayCoinListIndex = 0;

const eventEmitter = new events.EventEmitter();

const getDayCoinsList = () => {
  const query = `
    select * from coinHistory
    where recordDate='${recordDateList[recordDateListIndex]}' and marketCap > 0
    order by marketCap desc;
  `;
  console.log(`will get ${recordDateList[recordDateListIndex]} data`);
  connection.query(query, (err, res) => {
    if (err) {
      console.log(err);
      connection.end();
    } else {
      dayCoinListIndex = 0;
      dayCoinList = res;
      recordDateListIndex = recordDateListIndex + 1;
      eventEmitter.emit('CALCULATE_NEXT');
    }
  });
};

const calculateNext = () => {
  connection.query(
    `
    UPDATE coinHistory set coinRank=${dayCoinListIndex + 1}
    where _id=${dayCoinList[dayCoinListIndex]._id};
  `,
    err => {
      if (err) {
        console.log(err);
        connection.end();
      } else {
        if (dayCoinListIndex === dayCoinList.length - 1) {
          if (recordDateListIndex === recordDateList.length - 1) {
            console.log('------finish-----');
            connection.end();
          } else {
            eventEmitter.emit('GET_NEXT_DAY');
          }
        } else {
          dayCoinListIndex = dayCoinListIndex + 1;
          eventEmitter.emit('CALCULATE_NEXT');
        }
      }
    }
  );
};

eventEmitter.on('CALCULATE_NEXT', calculateNext);
eventEmitter.on('GET_NEXT_DAY', getDayCoinsList);

connection.query(getAllDates, (err, res) => {
  if (err) {
    console.log(err);
    connection.end();
  } else {
    recordDateList = res[0].map(item => item.recordDate);
    getDayCoinsList();
  }
});
