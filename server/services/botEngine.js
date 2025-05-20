const axios = require('axios');
const crypto = require('crypto');

const BINANCE_API_KEY = process.env.BINANCE_API_KEY;
const BINANCE_SECRET = process.env.BINANCE_SECRET;

/**
 * Helper: Create signature for Binance REST API query string
 */
function getSignature(queryString) {
  return crypto.createHmac('sha256', BINANCE_SECRET).update(queryString).digest('hex');
}

/**
 * Fetch current price for a symbol from Binance
 */
async function getCurrentPrice(symbol) {
  try {
    const response = await axios.get('https://fapi.binance.com/fapi/v1/ticker/price', {
      params: { symbol }
    });
    return parseFloat(response.data.price);
  } catch (err) {
    console.error('Error fetching current price:', err.message);
    return null;
  }
}

/**
 * Simulate order fill based on price and quantity
 * You can expand this with slippage, partial fills, etc.
 */
function simulateOrder(symbol, side, quantity, price) {
  return {
    symbol,
    side,
    quantity,
    price,
    orderId: `demo_${Date.now()}`,
    status: 'FILLED',
    executedQty: quantity,
    origQty: quantity,
    transactTime: Date.now(),
    demo: true,
    message: 'Simulated order filled at current market price',
  };
}

/**
 * Main function to place or simulate futures order.
 * Modes:
 * - 'real' = place real Binance order
 * - 'demo' = simulate order at current price, no real API call
 * - 'backtest' = simulate order with provided historical data (to be implemented)
 */
async function placeFuturesOrder(symbol, side, quantity, options = {}) {
  const mode = options.mode || (BINANCE_API_KEY && BINANCE_SECRET ? 'real' : 'demo');

  if (mode === 'backtest') {
    // For backtest, expect options.historicalPrice to be passed
    if (!options.historicalPrice) {
      throw new Error('Historical price required for backtest mode');
    }
    // Simulate order fill at historical price
    return simulateOrder(symbol, side, quantity, options.historicalPrice);
  }

  if (mode === 'demo') {
    console.warn('⚠️ Running in DEMO mode - no real orders placed.');

    // Fetch current market price
    const currentPrice = await getCurrentPrice(symbol);
    if (!currentPrice) {
      return {
        error: 'Failed to fetch current price for demo simulation'
      };
    }
    return simulateOrder(symbol, side, quantity, currentPrice);
  }

  // Real mode - place order on Binance
  if (!BINANCE_API_KEY || !BINANCE_SECRET) {
    throw new Error('API keys required for real mode');
  }

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
