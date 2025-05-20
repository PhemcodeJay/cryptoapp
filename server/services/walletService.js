// walletService.js

const axios = require('axios');

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const BSCSCAN_API_KEY = process.env.BSCSCAN_API_KEY; // Optional if you want BSC support

async function fetchEthWallet(address) {
  if (!address || typeof address !== 'string') {
    console.error('Invalid Ethereum address');
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

// Optional: fetch BSC wallet balance using BscScan
async function fetchBscWallet(address) {
  if (!address || typeof address !== 'string') {
    console.error('Invalid BSC address');
    return null;
  }
  if (!BSCSCAN_API_KEY) {
    console.error('BSCSCAN_API_KEY not set in environment');
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

module.exports = {
  fetchEthWallet,
  fetchBscWallet,
};
