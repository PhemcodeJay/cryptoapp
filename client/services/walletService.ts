import axios from 'axios';

// Extend the Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

const API_BASE = '/api/wallet'; // Adjust if your backend prefix is different

interface WalletService {
  getWalletBalance(address: string, chain?: 'eth' | 'bsc' | 'matic' | 'sol'): Promise<number>;
  connectMetaMask(): Promise<string>;
  connectTrustWallet(): Promise<string>;
  syncWallet(walletAddress: string, chain: string): Promise<any>;
  getPortfolio(walletAddress: string, chain: string): Promise<any>;
}

const walletService: WalletService = {
  /**
   * Get USDT wallet balance from the backend
   * @param {string} address Wallet address
   * @param {'eth'|'bsc'|'matic'|'sol'} chain Blockchain chain
   * @returns {Promise<number>} USDT balance
   */
  async getWalletBalance(address: string, chain = 'eth') {
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

  /**
   * Connect to MetaMask and get wallet address
   * @returns {Promise<string>} Wallet address
   */
  async connectMetaMask(): Promise<string> {
    if (!window.ethereum) throw new Error('MetaMask not installed');
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return accounts[0];
  },

  /**
   * Connect to Trust Wallet and get wallet address
   * @returns {Promise<string>} Wallet address
   */
  async connectTrustWallet(): Promise<string> {
    const provider = (window as any).trustwallet;
    if (!provider) throw new Error('Trust Wallet not found');
    const accounts = await provider.request({ method: 'eth_requestAccounts' });
    return accounts[0];
  },

  /**
   * Sync wallet data with backend
   */
  async syncWallet(walletAddress: string, chain: string) {
    const res = await fetch('/api/wallet/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletAddress, chain }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Sync failed');
    }
    return res.json();
  },

  /**
   * Get portfolio summary from backend
   */
  async getPortfolio(walletAddress: string, chain: string) {
    const res = await fetch(
      `/api/wallet/portfolio?walletAddress=${walletAddress}&chain=${chain}`
    );
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Portfolio fetch failed');
    }
    return res.json();
  },
};

export default walletService;
