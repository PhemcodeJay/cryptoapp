const express = require('express'); 
const router = express.Router(); 
const walletController = require('../controllers/walletController'); 
router.post('/', walletController.addWallet); router.get('/', walletController.getWallets); 
module.exports = router; 


router.post('/sync', walletController.syncWallet);
router.get('/summary', walletController.getSummary);
router.get('/candlestick', walletController.getCandlestickData);

module.exports = router;
const walletService = require('../services/walletService');

exports.syncWallet = async (req, res) => {
  try {
    await walletService.syncFromWalletProvider();
    res.json({ message: 'Wallet synced successfully' });
  } catch (err) {
    console.error('Wallet sync error:', err);
    res.status(500).json({ error: 'Wallet sync failed' });
  }
};

exports.getSummary = async (req, res) => {
  try {
    const summary = await walletService.getWalletSummary();
    res.json(summary);
  } catch (err) {
    console.error('Get summary error:', err);
    res.status(500).json({ error: 'Failed to get wallet summary' });
  }
};

exports.getCandlestickData = async (req, res) => {
  try {
    const data = await walletService.getCandlestickChartData();
    res.json(data);
  } catch (err) {
    console.error('Candlestick data error:', err);
    res.status(500).json({ error: 'Failed to get chart data' });
  }
};