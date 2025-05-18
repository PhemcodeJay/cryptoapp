
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

function calculateRSI(prices, period = 14) {
    let gains = 0, losses = 0;
    for (let i = 1; i <= period; i++) {
        const diff = prices[i] - prices[i - 1];
        if (diff >= 0) gains += diff;
        else losses -= diff;
    }
    const avgGain = gains / period;
    const avgLoss = losses / period;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
}

function calculateMACD(prices, shortPeriod = 12, longPeriod = 26, signalPeriod = 9) {
    const emaShort = calculateEMA(prices, shortPeriod);
    const emaLong = calculateEMA(prices, longPeriod);
    const macdLine = emaShort.map((val, i) => val - emaLong[i]);
    const signalLine = calculateEMA(macdLine, signalPeriod);
    return { macdLine, signalLine };
}

function calculateEMA(prices, period) {
    const k = 2 / (period + 1);
    const ema = [prices.slice(0, period).reduce((a, b) => a + b, 0) / period];
    for (let i = period; i < prices.length; i++) {
        ema.push(prices[i] * k + ema[ema.length - 1] * (1 - k));
    }
    return ema;
}

module.exports = {
    calculateMA,
    calculateRSI,
    calculateMACD
};


// More indicators in indicatorService.js

function calculateStochasticRSI(prices, period = 14) {
    const rsi = [];
    for (let i = period; i < prices.length; i++) {
        const slice = prices.slice(i - period, i);
        let gains = 0, losses = 0;
        for (let j = 1; j < slice.length; j++) {
            const diff = slice[j] - slice[j - 1];
            if (diff > 0) gains += diff;
            else losses -= diff;
        }
        const avgGain = gains / period;
        const avgLoss = losses / period;
        const rs = avgGain / avgLoss;
        rsi.push(100 - (100 / (1 + rs)));
    }
    const stochRSI = [];
    for (let i = period; i < rsi.length; i++) {
        const rsiSlice = rsi.slice(i - period, i);
        const min = Math.min(...rsiSlice);
        const max = Math.max(...rsiSlice);
        stochRSI.push(((rsi[i - 1] - min) / (max - min)) * 100);
    }
    return stochRSI;
}

function calculateVolumeProfile(volumes, prices, rangeCount = 10) {
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min;
    const step = range / rangeCount;
    const profile = Array(rangeCount).fill(0);

    for (let i = 0; i < prices.length; i++) {
        const index = Math.min(Math.floor((prices[i] - min) / step), rangeCount - 1);
        profile[index] += volumes[i];
    }

    return profile;
}

module.exports.calculateStochasticRSI = calculateStochasticRSI;
module.exports.calculateVolumeProfile = calculateVolumeProfile;
