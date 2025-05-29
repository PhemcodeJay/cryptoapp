const express = require('express');
const router = express.Router();

const walletController = require('../controllers/walletController');
const { fetchWallet } = require('../services/walletService'); // Adjust path as needed

// POST /api/wallet/ - add a new wallet
router.post('/', walletController.addWallet);

// GET /api/wallet/ - get all wallets
router.get('/', walletController.getWallets);

// POST /api/wallet/sync - sync wallet data
router.post('/sync', walletController.syncWallet);

// GET /api/wallet/summary - get wallet summary
router.get('/summary', walletController.getSummary);

// GET /api/wallet/candlestick - get candlestick chart data
router.get('/candlestick', walletController.getCandlestickData);

// Additional route for wallet balance summary using fetchWallet service
router.get('/wallet-summary', async (req, res) => {
  const { address, chain } = req.query;

  if (!address) {
    return res.status(400).json({ error: 'Wallet address is required' });
  }

  try {
    const data = await fetchWallet(address, chain || 'eth');
    if (!data) {
      return res.status(404).json({ error: 'Could not fetch wallet balance' });
    }
    return res.json({ address, chain: chain || 'eth', balance: data.balance });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
