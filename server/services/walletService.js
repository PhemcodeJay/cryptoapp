
// walletService.js

const axios = require('axios');
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

async function fetchEthWallet(address) {
    try {
        const url = `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${ETHERSCAN_API_KEY}`;
        const res = await axios.get(url);
        return { balance: res.data.result / 1e18 }; // Convert Wei to ETH
    } catch (error) {
        console.error('Error fetching wallet:', error.message);
        return null;
    }
}

module.exports = { fetchEthWallet };
