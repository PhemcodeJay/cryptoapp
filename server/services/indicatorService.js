// indicatorService.js

function calculateMA(prices, period) {
  const result = [];
  for (let i = 0; i <= prices.length - period; i++) {
    const slice = prices.slice(i, i + period);
    const sum = slice.reduce((acc, val) => acc + val, 0);
    result.push(sum / period);
  }
  return result;
}

function calculateEMA(prices, period) {
  const k = 2 / (period + 1);
  const ema = [];
  // Start with SMA for first EMA value
  const sma = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
  ema[period - 1] = sma;

  for (let i = period; i < prices.length; i++) {
    ema[i] = prices[i] * k + ema[i - 1] * (1 - k);
  }
  // Fill leading indexes with null to keep array length consistent
  for (let i = 0; i < period - 1; i++) ema[i] = null;

  return ema;
}

function calculateRSI(prices, period = 14) {
  const deltas = [];
  for (let i = 1; i < prices.length; i++) {
    deltas.push(prices[i] - prices[i - 1]);
  }

  let gains = 0, losses = 0;
  for (let i = 0; i < period; i++) {
    const diff = deltas[i];
    if (diff >= 0) gains += diff;
    else losses += Math.abs(diff);
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  const rsi = [];
  rsi[period] = 100 - (100 / (1 + avgGain / avgLoss));

  for (let i = period + 1; i < prices.length; i++) {
    const delta = deltas[i - 1];
    if (delta >= 0) {
      avgGain = (avgGain * (period - 1) + delta) / period;
      avgLoss = (avgLoss * (period - 1)) / period;
    } else {
      avgGain = (avgGain * (period - 1)) / period;
      avgLoss = (avgLoss * (period - 1) + Math.abs(delta)) / period;
    }
    rsi[i] = 100 - (100 / (1 + avgGain / avgLoss));
  }

  for (let i = 0; i < period; i++) rsi[i] = null;

  return rsi;
}

function calculateMACD(prices, shortPeriod = 12, longPeriod = 26, signalPeriod = 9) {
  const emaShort = calculateEMA(prices, shortPeriod);
  const emaLong = calculateEMA(prices, longPeriod);

  const macdLine = prices.map((_, i) => {
    if (emaShort[i] === null || emaLong[i] === null) return null;
    return emaShort[i] - emaLong[i];
  });

  const signalLine = calculateEMA(macdLine.filter(v => v !== null), signalPeriod);
  
  // We need to align signalLine back with macdLine length and nulls
  let signalIndex = 0;
  const alignedSignalLine = macdLine.map(v => {
    if (v === null) return null;
    return signalLine[signalIndex++];
  });

  return { macdLine, signalLine: alignedSignalLine };
}

function calculateStochasticRSI(prices, period = 14) {
  const rsi = calculateRSI(prices, period);
  const stochasticRSI = [];

  for (let i = 0; i < rsi.length; i++) {
    if (i < 2 * period - 1 || rsi[i] === null) {
      stochasticRSI.push(null);
      continue;
    }

    const rsiSlice = rsi.slice(i - period + 1, i + 1);
    const minRSI = Math.min(...rsiSlice);
    const maxRSI = Math.max(...rsiSlice);

    if (maxRSI === minRSI) {
      stochasticRSI.push(0);
    } else {
      stochasticRSI.push(((rsi[i] - minRSI) / (maxRSI - minRSI)) * 100);
    }
  }

  return stochasticRSI;
}

function calculateVolumeProfile(volumes, prices, rangeCount = 10) {
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const range = maxPrice - minPrice;
  const step = range / rangeCount;

  const profile = Array(rangeCount).fill(0);

  for (let i = 0; i < prices.length; i++) {
    const index = Math.min(Math.floor((prices[i] - minPrice) / step), rangeCount - 1);
    profile[index] += volumes[i];
  }

  return profile;
}

module.exports = {
  calculateMA,
  calculateEMA,
  calculateRSI,
  calculateMACD,
  calculateStochasticRSI,
  calculateVolumeProfile,
};
