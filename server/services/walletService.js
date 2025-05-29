const axios = require('axios');

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const BSCSCAN_API_KEY = process.env.BSCSCAN_API_KEY;

// USDT contract addresses on ETH and BSC (mainnets)
const USDT_CONTRACT_ETH = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
const USDT_CONTRACT_BSC = '0x55d398326f99059fF775485246999027B3197955';

/**
 * Fetch USDT token balance for Ethereum wallet
 * @param {string} address 
 * @returns {Promise<{balance: number} | null>}
 */
async function fetchEthUsdtBalance(address) {
  if (!address || typeof address !== 'string') {
    console.error('Invalid Ethereum address');
    return null;
  }
  if (!ETHERSCAN_API_KEY) {
    console.error('ETHERSCAN_API_KEY is not set');
    return null;
  }

  try {
    const res = await axios.get('https://api.etherscan.io/api', {
      params: {
        module: 'account',
        action: 'tokenbalance',
        contractaddress: USDT_CONTRACT_ETH,
        address,
        tag: 'latest',
        apikey: ETHERSCAN_API_KEY,
      },
    });

    if (res.data.status !== '1') {
      throw new Error(res.data.message || 'Failed to fetch USDT balance');
    }
    // USDT decimals = 6
    return { balance: Number(res.data.result) / 1e6 };
  } catch (error) {
    console.error('Error fetching Ethereum USDT balance:', error.message);
    return null;
  }
}

/**
 * Fetch USDT token balance for BSC wallet
 * @param {string} address 
 * @returns {Promise<{balance: number} | null>}
 */
async function fetchBscUsdtBalance(address) {
  if (!address || typeof address !== 'string') {
    console.error('Invalid BSC address');
    return null;
  }
  if (!BSCSCAN_API_KEY) {
    console.error('BSCSCAN_API_KEY is not set');
    return null;
  }

  try {
    const res = await axios.get('https://api.bscscan.com/api', {
      params: {
        module: 'account',
        action: 'tokenbalance',
        contractaddress: USDT_CONTRACT_BSC,
        address,
        tag: 'latest',
        apikey: BSCSCAN_API_KEY,
      },
    });

    if (res.data.status !== '1') {
      throw new Error(res.data.message || 'Failed to fetch USDT balance');
    }
    // USDT decimals = 18 on BSC (sometimes 18 but actually 18 for this token)
    // Actually, USDT on BSC also uses 18 decimals, so dividing by 1e18:
    return { balance: Number(res.data.result) / 1e18 };
  } catch (error) {
    console.error('Error fetching BSC USDT balance:', error.message);
    return null;
  }
}

/**
 * Fetch USDT balance for given address and chain type
 * @param {string} address Wallet address
 * @param {'eth'|'bsc'} chain Chain name
 * @returns {Promise<{balance: number} | null>}
 */
async function fetchUsdtBalance(address, chain = 'eth') {
  if (chain === 'eth') return await fetchEthUsdtBalance(address);
  if (chain === 'bsc') return await fetchBscUsdtBalance(address);

  console.error('Unsupported chain:', chain);
  return null;
}

module.exports = {
  fetchEthUsdtBalance,
  fetchBscUsdtBalance,
  fetchUsdtBalance,
};

export default walletService;