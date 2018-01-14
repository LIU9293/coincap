const fetch = require('node-fetch');

const getAllCoins = () => {
  return new Promise((resolve, reject) => {
    fetch('https://files.coinmarketcap.com/generated/search/quick_search.json')
      .then(res => res.json())
      .then(json => resolve(json.map(item => {
        return {
          coinName: item.slug,
          coinCode: item.symbol,
          rank: item.rank
        }
      })))
      .catch(error => reject(error));
  });
}

module.exports = getAllCoins
