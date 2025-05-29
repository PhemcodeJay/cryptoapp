// services/hyperliquid.js

const axios = require('axios');

const HYPERLIQUID_API = 'https://api.hyperliquid.xyz'; // Replace with actual endpoint
const MIN_TRADE_AMOUNT = 5; // USDT

/**
 * Executes a futures trade on Hyperliquid.
 * @param {Object} config - Trading configuration
 * @param {string} config.strategy - Trading strategy (MACD, RSI, etc.)
 * @param {string} config.timeframe - Timeframe (hourly, daily, etc.)
 * @param {number} config.threshold - Profit target (%)
 * @param {number} config.balanceToUse - Balance to allocate (USDT)
 * @param {string} config.walletAddress - Wallet address of user
 * @param {string} config.signature - Signed message for authentication
 */
async function executeTrade(config) {
  const {
    strategy,
    timeframe,
    threshold,
    balanceToUse,
    walletAddress,
    signature,
  } = config;

  if (balanceToUse < MIN_TRADE_AMOUNT) {
    throw new Error(`Minimum trade amount is ${MIN_TRADE_AMOUNT} USDT.`);
  }

  try {
    // Placeholder logic for position size and symbol selection
    const symbol = 'ETHUSDT';
    const positionSize = balanceToUse; // Simplified logic

    // Example payload to Hyperliquid API (replace with real endpoint & payload)
    const tradePayload = {
      address: walletAddress,
      signature,
      symbol,
      side: 'buy',
      size: positionSize,
      leverage: 5,
      strategy,
      timeframe,
      threshold,
    };

    const response = await axios.post(`${HYPERLIQUID_API}/trade/futures`, tradePayload);

    if (response.data.success) {
      return { message: 'Trade executed successfully', tx: response.data.txHash };
    } else {
      throw new Error(response.data.message || 'Trade execution failed');
    }
  } catch (error) {
    console.error('Hyperliquid trade error:', error.message);
    throw new Error('Failed to execute trade on Hyperliquid.');
  }
}

module.exports = {
  executeTrade,
};

export default hyperliquidService;