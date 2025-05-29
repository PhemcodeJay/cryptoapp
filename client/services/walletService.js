import axios from 'axios';

const API_BASE = '/api/wallet'; // adjust if your backend prefix is different

const walletService = {
  /**
   * Get USDT wallet balance from the backend
   * @param {string} address Wallet address
   * @param {'eth'|'bsc'} chain Blockchain chain
   * @returns {Promise<number>} USDT balance
   */
  async getWalletBalance(address, chain = 'eth') {
    try {
      const res = await axios.get(`${API_BASE}/balance`, {
        params: { address, chain },
      });
      if (res.data && typeof res.data.balance === 'number') {
        return res.data.balance;
      }
      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      throw error;
    }
  },
};

export default walletService;
