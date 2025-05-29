import axios from 'axios';

const API_BASE = '/api/hyperliquid'; // adjust if needed

const hyperliquidService = {
  /**
   * Execute a futures trade by calling the backend trading bot
   * @param {string} strategy
   * @param {number} threshold Profit threshold percent
   * @param {string} timeframe One of '1h', '4h', '1d', '1w'
   * @param {object} options Additional options (walletAddress, balanceToUse, signature, chain)
   * @returns {Promise<any>} Result message or error
   */
  async tradeFutures(strategy, threshold, timeframe, options = {}) {
    try {
      const payload = { strategy, threshold, timeframe, ...options };
      const res = await axios.post(`${API_BASE}/trade`, payload);
      return res.data;
    } catch (error) {
      console.error('Error executing trade:', error);
      throw error;
    }
  },
};

export default hyperliquidService;
