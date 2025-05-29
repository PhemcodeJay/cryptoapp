const axios = require('axios');

// === Indicator Helpers ===

function calculateSMA(data, window) {
  return data.map((_, i) => {
    if (i < window - 1) return null;
    const slice = data.slice(i - window + 1, i + 1);
    const sum = slice.reduce((a, b) => a + b, 0);
    return sum / window;
  });
}

function calculateStdDev(data, window) {
  return data.map((_, i) => {
    if (i < window - 1) return null;
    const slice = data.slice(i - window + 1, i + 1);
    const mean = slice.reduce((a, b) => a + b, 0) / window;
    const variance = slice.reduce((a, b) => a + (b - mean) ** 2, 0) / window;
    return Math.sqrt(variance);
  });
}

function calculateEMA(data, window) {
  const k = 2 / (window + 1);
  const ema = Array(data.length).fill(null);
  let prevEma = data.slice(0, window).reduce((a, b) => a + b, 0) / window;
  ema[window - 1] = prevEma;

  for (let i = window; i < data.length; i++) {
    const currentEma = data[i] * k + prevEma * (1 - k);
    ema[i] = currentEma;
    prevEma = currentEma;
  }

  return ema;
}

function calculateMACD(data, fast = 12, slow = 26, signal = 9) {
  const emaFast = calculateEMA(data, fast);
  const emaSlow = calculateEMA(data, slow);

  const macdLine = data.map((_, i) =>
    emaFast[i] !== null && emaSlow[i] !== null ? emaFast[i] - emaSlow[i] : null
  );

  const validMacdLine = macdLine.filter(v => v !== null);
  const signalLinePartial = calculateEMA(validMacdLine, signal);

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

  const histogram = macdLine.map((v, i) =>
    v !== null && signalLine[i] !== null ? v - signalLine[i] : null
  );

  return { macdLine, signalLine, histogram };
}

function calculateRSI(data, window = 14) {
  const rsi = Array(data.length).fill(null);
  const deltas = data.slice(1).map((v, i) => v - data[i]);

  let gains = 0, losses = 0;
  for (let i = 0; i < window; i++) {
    if (deltas[i] >= 0) gains += deltas[i];
    else losses += Math.abs(deltas[i]);
  }

  let avgGain = gains / window;
  let avgLoss = losses / window;
  rsi[window] = 100 - (100 / (1 + avgGain / avgLoss));

  for (let i = window + 1; i < data.length; i++) {
    const delta = deltas[i - 1];
    if (delta >= 0) {
      avgGain = ((avgGain * (window - 1)) + delta) / window;
      avgLoss = (avgLoss * (window - 1)) / window;
    } else {
      avgGain = (avgGain * (window - 1)) / window;
      avgLoss = ((avgLoss * (window - 1)) + Math.abs(delta)) / window;
    }

    rsi[i] = avgLoss === 0 ? 100 : 100 - (100 / (1 + avgGain / avgLoss));
  }

  return rsi;
}

function calculateStochasticRSI(rsi, window = 14) {
  return rsi.map((v, i) => {
    if (i < window - 1 || v === null) return null;
    const slice = rsi.slice(i - window + 1, i + 1).filter(x => x !== null);
    const min = Math.min(...slice);
    const max = Math.max(...slice);
    return max - min === 0 ? 0 : (v - min) / (max - min);
  });
}

// === Main Analyzer ===

exports.analyze = async (symbol, intervals = ['4h', '1d', '1w']) => {
  const limit = 200;
  const results = {};

  for (const interval of intervals) {
    try {
      const res = await axios.get('https://api.binance.com/api/v3/klines', {
        params: { symbol, interval, limit }
      });

      const candles = res.data.map(c => ({
        openTime: c[0],
        open: parseFloat(c[1]),
        high: parseFloat(c[2]),
        low: parseFloat(c[3]),
        close: parseFloat(c[4]),
        volume: parseFloat(c[5])
      }));

      const closes = candles.map(c => c.close);
      const volumes = candles.map(c => c.volume);

      // Indicators
      const ma20 = calculateSMA(closes, 20);
      const ma200 = calculateSMA(closes, 200);
      const stddev20 = calculateStdDev(closes, 20);
      const bollinger = candles.map((_, i) => ({
        upper: ma20[i] !== null && stddev20[i] !== null ? ma20[i] + 2 * stddev20[i] : null,
        middle: ma20[i],
        lower: ma20[i] !== null && stddev20[i] !== null ? ma20[i] - 2 * stddev20[i] : null
      }));

      const macd = calculateMACD(closes);
      const rsi = calculateRSI(closes);
      const stochRsi = calculateStochasticRSI(rsi);
      const volumeSma = calculateSMA(volumes, 14);

      // Merge indicators into candles
      candles.forEach((c, i) => {
        c.ma20 = ma20[i];
        c.ma200 = ma200[i];
        c.bollingerUpper = bollinger[i].upper;
        c.bollingerMiddle = bollinger[i].middle;
        c.bollingerLower = bollinger[i].lower;
        c.macd = macd.macdLine[i];
        c.macdSignal = macd.signalLine[i];
        c.macdHist = macd.histogram[i];
        c.rsi = rsi[i];
        c.stochRsi = stochRsi[i];
        c.volumeSma = volumeSma[i];
      });

      results[interval] = candles;
    } catch (err) {
      console.error(`Error analyzing ${symbol} at ${interval}: ${err.message}`);
      results[interval] = null;
    }
  }

  return results;
};
