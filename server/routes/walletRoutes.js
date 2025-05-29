const express = require('express');
const router = express.Router();

const walletController = require('../controllers/walletController');
const { fetchUsdtBalance } = require('../services/walletService');

// ================================
// Wallet CRUD and Sync Endpoints
// ================================

// Add a new wallet
// POST /api/wallet/
router.post('/', walletController.addWallet);

// Get all wallets
// GET /api/wallet/
router.get('/', walletController.getWallets);

// Sync wallet data
// POST /api/wallet/sync
router.post('/sync', walletController.syncWallet);

// Get wallet summary (e.g., top gainers, losers)
// GET /api/wallet/summary
router.get('/summary', walletController.getSummary);

// Get candlestick chart data for a wallet's assets
// GET /api/wallet/candlestick
router.get('/candlestick', walletController.getCandlestickData);

// =======================================
// Get wallet USDT balance (on-chain)
// =======================================

// Example: GET /api/wallet/wallet-summary?address=0x123&chain=eth
router.get('/wallet-summary', async (req, res) => {
  const { address, chain = 'eth' } = req.query;

  if (!address) {
    return res.status(400).json({ error: 'Wallet address is required' });
  }

  try {
    const data = await fetchUsdtBalance(address, chain);

    if (!data) {
      return res.status(404).json({ error: 'Could not fetch wallet balance' });
    }

    return res.json({
      address,
      chain,
      balance: data.balance,
    });
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
