
// botEngine.js - Binance Futures Integration

const axios = require('axios');
const crypto = require('crypto');
const BINANCE_API_KEY = process.env.BINANCE_API_KEY;
const BINANCE_SECRET = process.env.BINANCE_SECRET;

function getSignature(queryString) {
    return crypto.createHmac('sha256', BINANCE_SECRET).update(queryString).digest('hex');
}

async function placeFuturesOrder(symbol, side, quantity) {
    const timestamp = Date.now();
    const query = `symbol=${symbol}&side=${side}&type=MARKET&quantity=${quantity}&timestamp=${timestamp}`;
    const signature = getSignature(query);
    const url = `https://fapi.binance.com/fapi/v1/order?${query}&signature=${signature}`;

    try {
        const response = await axios.post(url, null, {
            headers: { 'X-MBX-APIKEY': BINANCE_API_KEY }
        });
        return response.data;
    } catch (err) {
        console.error('Error placing futures order:', err.message);
        return null;
    }
}

module.exports = { placeFuturesOrder };
