const axios = require('axios');

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const BSCSCAN_API_KEY = process.env.BSCSCAN_API_KEY; // Optional for BSC support

async function fetchEthWallet(address) {
  if (!address || typeof address !== 'string') {
    console.error('Invalid Ethereum address');
    return null;
  }
  if (!ETHERSCAN_API_KEY) {
    console.error('ETHERSCAN_API_KEY is not set');
    return null;
  }
  try {
    const url = `https://api.etherscan.io/api`;
    const params = {
      module: 'account',
      action: 'balance',
      address,
      tag: 'latest',
      apikey: ETHERSCAN_API_KEY,
    };
    const res = await axios.get(url, { params });
    if (res.data.status !== '1') {
      throw new Error(res.data.message || 'Failed to fetch ETH balance');
    }
    return { balance: Number(res.data.result) / 1e18 }; // Convert Wei to ETH
  } catch (error) {
    console.error('Error fetching Ethereum wallet:', error.message);
    return null;
  }
}

async function fetchBscWallet(address) {
  if (!address || typeof address !== 'string') {
    console.error('Invalid BSC address');
    return null;
  }
  if (!BSCSCAN_API_KEY) {
    console.error('BSCSCAN_API_KEY is not set');
    return null;
  }
  try {
    const url = `https://api.bscscan.com/api`;
    const params = {
      module: 'account',
      action: 'balance',
      address,
      tag: 'latest',
      apikey: BSCSCAN_API_KEY,
    };
    const res = await axios.get(url, { params });
    if (res.data.status !== '1') {
      throw new Error(res.data.message || 'Failed to fetch BSC balance');
    }
    return { balance: Number(res.data.result) / 1e18 }; // Convert Wei to BNB
  } catch (error) {
    console.error('Error fetching BSC wallet:', error.message);
    return null;
  }
}

/**
 * Fetch wallet balance for given address and chain type
 * @param {string} address - Wallet address
 * @param {'eth'|'bsc'} chain - Chain type
 * @returns {Promise<{balance: number} | null>}
 */
async function fetchWallet(address, chain = 'eth') {
  if (chain === 'eth') {
    return await fetchEthWallet(address);
  } else if (chain === 'bsc') {
    return await fetchBscWallet(address);
  } else {
    console.error('Unsupported chain:', chain);
    return null;
  }
}

module.exports = {
  fetchEthWallet,
  fetchBscWallet,
  fetchWallet,
};
