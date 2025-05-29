import { ethers } from 'ethers';
import axios from 'axios';

// Extend the Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

// USDT contract addresses for Ethereum and BSC
const USDT_CONTRACTS: Record<'eth' | 'bsc', string> = {
  eth: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  bsc: '0x55d398326f99059fF775485246999027B3197955',
};

// Minimal ERC20 ABI
const ERC20_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
];

const API_BASE = '/api/wallet'; // Backend route prefix

/**
 * Fetch USDT balance using ethers.js via on-chain RPC call
 */
export async function fetchUsdtBalance(
  account: string,
  chain: 'eth' | 'bsc'
): Promise<{ balance: number } | null> {
  try {
    if (!ethers.isAddress(account)) throw new Error('Invalid wallet address');
    if (!USDT_CONTRACTS[chain]) throw new Error('Unsupported chain');

    const rpcUrl =
      chain === 'eth'
        ? 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID' // Replace with your Infura ID
        : 'https://bsc-dataseed.binance.org/';

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const contract = new ethers.Contract(USDT_CONTRACTS[chain], ERC20_ABI, provider);

    const [rawBalance, decimals] = await Promise.all([
      contract.balanceOf(account),
      contract.decimals(),
    ]);

    const formattedBalance = Number(ethers.formatUnits(rawBalance, decimals));
    return { balance: formattedBalance };
  } catch (error) {
    console.error('fetchUsdtBalance error:', error);
    return null;
  }
}

interface WalletService {
  getWalletBalance(address: string, chain?: 'eth' | 'bsc' | 'matic' | 'sol'): Promise<number>;
  connectMetaMask(): Promise<string>;
  connectTrustWallet(): Promise<string>;
  syncWallet(walletAddress: string, chain: string): Promise<any>;
  getPortfolio(walletAddress: string, chain: string): Promise<any>;
}

const walletService: WalletService = {
  async getWalletBalance(address: string, chain = 'eth'): Promise<number> {
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

  async connectMetaMask(): Promise<string> {
    try {
      if (!window.ethereum) throw new Error('MetaMask not found');

      // ethers v6+ uses BrowserProvider
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      if (!accounts.length) throw new Error('No MetaMask accounts found');
      return accounts[0];
    } catch (error: any) {
      throw new Error('MetaMask connection failed: ' + error.message);
    }
  },

  async connectTrustWallet(): Promise<string> {
    try {
      if (!window.ethereum) throw new Error('Trust Wallet not found');

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      if (!accounts.length) throw new Error('No Trust Wallet accounts found');
      return accounts[0];
    } catch (error: any) {
      throw new Error('Trust Wallet connection failed: ' + error.message);
    }
  },

  async syncWallet(walletAddress: string, chain: string): Promise<any> {
    const res = await fetch(`${API_BASE}/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletAddress, chain }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Wallet sync failed');
    }

    return res.json();
  },

  async getPortfolio(walletAddress: string, chain: string): Promise<any> {
    const res = await fetch(`${API_BASE}/portfolio?walletAddress=${walletAddress}&chain=${chain}`);

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Portfolio fetch failed');
    }

    return res.json();
  },
};

export default walletService;
