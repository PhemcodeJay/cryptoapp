const axios = require('axios');

exports.analyze = async (symbol) => {
  const res = await axios.get('https://api.binance.com/api/v3/klines', {
    params: {
      symbol,
      interval: '1h',
      limit: 100
    }
  });
  return res.data.map(candle => ({
    openTime: candle[0],
    open: parseFloat(candle[1]),
    high: parseFloat(candle[2]),
    low: parseFloat(candle[3]),
    close: parseFloat(candle[4]),
    volume: parseFloat(candle[5])
  }));
};
