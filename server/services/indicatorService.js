// indicatorValueService.js

const {
  calculateMA,
  calculateEMA,
  calculateRSI,
  calculateMACD,
  calculateStochasticRSI,
  calculateVolumeProfile,
} = require('./indicatorService');

function extractClosePrices(data) {
  return data.map(candle => parseFloat(candle.close));
}

function extractVolumes(data) {
  return data.map(candle => parseFloat(candle.volume));
}

function computeIndicators(candles) {
  const closePrices = extractClosePrices(candles);
  const volumes = extractVolumes(candles);

  const ma20 = calculateMA(closePrices, 20);
  const ma200 = calculateMA(closePrices, 200);
  const ema20 = calculateEMA(closePrices, 20);
  const ema200 = calculateEMA(closePrices, 200);
  const rsi = calculateRSI(closePrices, 14);
  const macd = calculateMACD(closePrices);
  const stochasticRsi = calculateStochasticRSI(closePrices, 14);
  const volumeSMA = calculateMA(volumes, 20); // or 14 if preferred
  const volumeProfile = calculateVolumeProfile(volumes, closePrices, 10);

  return {
    MA_20: ma20,
    MA_200: ma200,
    EMA_20: ema20,
    EMA_200: ema200,
    RSI: rsi,
    MACD_Line: macd.macdLine,
    MACD_Signal: macd.signalLine,
    Stochastic_RSI: stochasticRsi,
    Volume_SMA: volumeSMA,
    Volume_Profile: volumeProfile,
  };
}

function formatLatestIndicators(indicators) {
  const latestIndex = indicators.MA_20.length - 1;

  return {
    MA_20: indicators.MA_20[latestIndex],
    MA_200: indicators.MA_200[latestIndex],
    EMA_20: indicators.EMA_20[latestIndex],
    EMA_200: indicators.EMA_200[latestIndex],
    RSI: indicators.RSI[latestIndex],
    MACD_Line: indicators.MACD_Line[latestIndex],
    MACD_Signal: indicators.MACD_Signal[latestIndex],
    Stochastic_RSI: indicators.Stochastic_RSI[latestIndex],
    Volume_SMA: indicators.Volume_SMA[latestIndex],
    Volume_Profile: indicators.Volume_Profile, // Volume Profile is not time-indexed
  };
}

function generateIndicatorSummary(asset, interval, candles) {
  const indicators = computeIndicators(candles);
  const latestValues = formatLatestIndicators(indicators);

  return {
    asset,
    interval,
    indicators: latestValues,
  };
}

module.exports = {
  generateIndicatorSummary,
};
