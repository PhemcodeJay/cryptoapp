const axios = require('axios');

// --- Indicator helpers (unchanged) ---

function calculateSMA(data, window) {
  const sma = [];
  for (let i = 0; i < data.length; i++) {
    if (i < window - 1) {
      sma.push(null);
      continue;
    }
    const windowSlice = data.slice(i - window + 1, i + 1);
    const sum = windowSlice.reduce((acc, val) => acc + val, 0);
    sma.push(sum / window);
  }
  return sma;
}

function calculateStdDev(data, window) {
  const stddev = [];
  for (let i = 0; i < data.length; i++) {
    if (i < window - 1) {
      stddev.push(null);
      continue;
    }
    const windowSlice = data.slice(i - window + 1, i + 1);
    const mean = windowSlice.reduce((a, b) => a + b, 0) / window;
    const variance = windowSlice.reduce((a, b) => a + (b - mean) ** 2, 0) / window;
    stddev.push(Math.sqrt(variance));
  }
  return stddev;
}

function calculateEMA(data, window) {
  const ema = [];
  const k = 2 / (window + 1);
  let prevEma = data.slice(0, window).reduce((a, b) => a + b, 0) / window;
  ema[window - 1] = prevEma;

  for (let i = window; i < data.length; i++) {
    const currentEma = data[i] * k + prevEma * (1 - k);
    ema[i] = currentEma;
    prevEma = currentEma;
  }
  for (let i = 0; i < window - 1; i++) ema[i] = null;
  return ema;
}

function calculateMACD(data, fast = 12, slow = 26, signal = 9) {
  const emaFast = calculateEMA(data, fast);
  const emaSlow = calculateEMA(data, slow);

  const macdLine = data.map((_, i) => {
    if (emaFast[i] === null || emaSlow[i] === null) return null;
    return emaFast[i] - emaSlow[i];
  });

  const filteredMacdLine = macdLine.filter(v => v !== null);
  const signalLinePartial = calculateEMA(filteredMacdLine, signal);

  const signalLine = [];
  let sigIdx = 0;
  for (let i = 0; i < macdLine.length; i++) {
    if (macdLine[i] === null) {
      signalLine.push(null);
    } else {
      signalLine.push(signalLinePartial[sigIdx]);
      sigIdx++;
    }
  }

  const histogram = macdLine.map((v, i) => (v !== null && signalLine[i] !== null) ? v - signalLine[i] : null);

  return { macdLine, signalLine, histogram };
}

function calculateRSI(data, window = 14) {
  const deltas = [];
  for (let i = 1; i < data.length; i++) {
    deltas.push(data[i] - data[i - 1]);
  }

  let gains = 0, losses = 0;
  for (let i = 0; i < window; i++) {
    if (deltas[i] >= 0) gains += deltas[i];
    else losses += Math.abs(deltas[i]);
  }

  let avgGain = gains / window;
  let avgLoss = losses / window;

  const rsi = [];
  rsi[window] = 100 - (100 / (1 + avgGain / avgLoss));

  for (let i = window + 1; i < data.length; i++) {
    const delta = deltas[i - 1];
    if (delta >= 0) {
      avgGain = (avgGain * (window - 1) + delta) / window;
      avgLoss = (avgLoss * (window - 1)) / window;
    } else {
      avgGain = (avgGain * (window - 1)) / window;
      avgLoss = (avgLoss * (window - 1) + Math.abs(delta)) / window;
    }
    rsi[i] = 100 - (100 / (1 + avgGain / avgLoss));
  }

  for (let i = 0; i < window; i++) rsi[i] = null;

  return rsi;
}

function calculateStochasticRSI(rsi, window = 14) {
  const stochasticRsi = [];

  for (let i = 0; i < rsi.length; i++) {
    if (i < window - 1 || rsi[i] === null) {
      stochasticRsi.push(null);
      continue;
    }
    const rsiSlice = rsi.slice(i - window + 1, i + 1).filter(v => v !== null);
    const minRsi = Math.min(...rsiSlice);
    const maxRsi = Math.max(...rsiSlice);
    if (maxRsi - minRsi === 0) {
      stochasticRsi.push(0);
    } else {
      stochasticRsi.push((rsi[i] - minRsi) / (maxRsi - minRsi));
    }
  }

  return stochasticRsi;
}

// --- Main analyze function with requested timeframes and indicators ---

exports.analyze = async (symbol) => {
  // Set required intervals: 4hr, 1 day, 1 week
  const intervals = ['4h', '1d', '1w'];
  const limit = 200; // Number of candles to fetch

  const results = {};

  for (const interval of intervals) {
    try {
      const res = await axios.get('https://api.binance.com/api/v3/klines', {
        params: { symbol, interval, limit }
      });

      const candles = res.data.map(candle => ({
        openTime: candle[0],
        open: parseFloat(candle[1]),
        high: parseFloat(candle[2]),
        low: parseFloat(candle[3]),
        close: parseFloat(candle[4]),
        volume: parseFloat(candle[5]),
      }));

      const closes = candles.map(c => c.close);
      const volumes = candles.map(c => c.volume);

      // Calculate indicators
      const ma20 = calculateSMA(closes, 20);
      const ma200 = calculateSMA(closes, 200);
      const stddev20 = calculateStdDev(closes, 20);

      const bollingerBands = candles.map((_, i) => {
        if (ma20[i] === null || stddev20[i] === null) return { upper: null, middle: null, lower: null };
        return {
          upper: ma20[i] + 2 * stddev20[i],
          middle: ma20[i],
          lower: ma20[i] - 2 * stddev20[i],
        };
      });

      const macd = calculateMACD(closes);
      const rsi = calculateRSI(closes);
      const stochRsi = calculateStochasticRSI(rsi);
      const volumeSma = calculateSMA(volumes, 14);

      // Attach indicators to candles
      for (let i = 0; i < candles.length; i++) {
        candles[i].ma20 = ma20[i];
        candles[i].ma200 = ma200[i];
        candles[i].bollingerUpper = bollingerBands[i].upper;
        candles[i].bollingerMiddle = bollingerBands[i].middle;
        candles[i].bollingerLower = bollingerBands[i].lower;
        candles[i].macd = macd.macdLine[i];
        candles[i].macdSignal = macd.signalLine[i];
        candles[i].macdHist = macd.histogram[i];
        candles[i].rsi = rsi[i];
        candles[i].stochRsi = stochRsi[i];
        candles[i].volumeSma = volumeSma[i];
      }

      results[interval] = candles;
    } catch (error) {
      console.error(`Error fetching candles for ${symbol} ${interval}:`, error.message);
      results[interval] = null;
    }
  }

  return results;
};
