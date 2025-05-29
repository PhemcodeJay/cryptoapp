const axios = require('axios');
const crypto = require('crypto');
const walletService = require('./walletService');

const HYPERLIQUID_API_URL = process.env.HYPERLIQUID_API_URL || 'https://api.hyperliquid.xyz/futures/order';

/**
 * Create HMAC SHA256 signature
 * @param {object} payload 
 * @param {string} secret 
 * @returns {string}
 */
function createSignature(payload, secret) {
  const message = JSON.stringify(payload);
  return crypto.createHmac('sha256', secret).update(message).digest('hex');
}

/**
 * Fetch USDT wallet balance for trading
 * @param {string} walletAddress 
 * @param {'eth'|'bsc'} chain - Chain network, default to 'eth'
 * @returns {Promise<number>} - USDT balance
 */
async function getWalletUsdtBalance(walletAddress, chain = 'eth') {
  try {
    const result = await walletService.fetchUsdtBalance(walletAddress, chain);
    if (!result) return 0;
    return result.balance || 0;
  } catch (err) {
    console.error('Error fetching USDT wallet balance:', err.message);
    return 0;
  }
}

/**
 * Simulate order for demo mode
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
 * Get current price for symbol from Hyperliquid market API
 */
async function getCurrentPrice(symbol) {
  try {
    const baseUrl = process.env.HYPERLIQUID_API_BASE_URL || 'https://api.hyperliquid.xyz/markets';
    const response = await axios.get(`${baseUrl}/${symbol}/ticker`);
    return parseFloat(response.data.price);
  } catch (err) {
    console.error('Error fetching current price:', err.message);
    return null;
  }
}

/**
 * Place futures order on Hyperliquid
 * @param {object} params
 * @param {string} params.walletAddress
 * @param {string} params.walletSecret
 * @param {string} params.symbol
 * @param {'buy'|'sell'} params.side
 * @param {number} params.quantity
 * @param {'demo'|'real'} params.mode
 * @param {'eth'|'bsc'} params.chain - specify chain for USDT balance fetch
 * @returns {Promise<object>}
 */
async function placeFuturesOrder({ walletAddress, walletSecret, symbol, side, quantity, mode = 'demo', chain = 'eth' }) {
  if (mode === 'demo') {
    console.warn('⚠️ Running in DEMO mode - no real orders placed.');
    const currentPrice = await getCurrentPrice(symbol);
    if (!currentPrice) {
      return { error: 'Failed to fetch current price for demo simulation' };
    }
    return simulateOrder(symbol, side, quantity, currentPrice);
  }

  if (!walletAddress || !walletSecret) {
    throw new Error('walletAddress and walletSecret are required for real trading');
  }

  // Check USDT balance before placing order
  const balance = await getWalletUsdtBalance(walletAddress, chain);
  if (balance < quantity) {
    return { error: `Insufficient USDT balance (${balance}) to place order of quantity ${quantity}` };
  }

  const payload = {
    walletAddress,
    symbol,
    side,
    quantity,
    type: 'MARKET',
    timestamp: Date.now(),
  };

  const signature = createSignature(payload, walletSecret);

  try {
    const response = await axios.post(HYPERLIQUID_API_URL, payload, {
      headers: {
        'X-Wallet-Address': walletAddress,
        'X-Signature': signature,
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (err) {
    console.error('Error placing futures order:', err.response?.data || err.message);
    return { error: err.message || 'Failed to place order' };
  }
}

module.exports = { placeFuturesOrder };
