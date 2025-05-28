const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');

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

module.exports = router;
