const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { fetchUsdtBalance } = require('../services/walletService');
const { executeTrade } = require('../services/hyperliquidService');

// Page rendering routes
router.get('/', (req, res) => res.render('index'));
router.get('/login', (req, res) => res.render('LoginPage'));
router.get('/register', (req, res) => res.render('RegisterPage'));
router.get('/dashboard', (req, res) => res.render('DashboardPage'));
router.get('/portfolio', (req, res) => res.render('PortfolioPage'));
router.get('/assets-analysis', (req, res) => res.render('AssetsAnalysisPage'));
router.get('/trading-bot', (req, res) => res.render('TradingBotPage'));

// Wallet connect / auth routes
router.post('/request-nonce', authController.requestNonce);
router.post('/connect-wallet', authController.verifySignature);
router.post('/logout', authController.logout);

// ===============================
// New Wallet + Trading API routes
// ===============================

// GET /wallet/balance?address=0x...&chain=eth
router.get('/wallet/balance', async (req, res) => {
  const { address, chain = 'eth' } = req.query;

  if (!address) {
    return res.status(400).json({ error: 'Missing wallet address' });
  }

  try {
    const balance = await fetchUsdtBalance(address, chain);
    if (!balance) {
      return res.status(404).json({ error: 'Balance not found' });
    }
    res.json(balance);
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});

// POST /hyperliquid/trade
router.post('/hyperliquid/trade', async (req, res) => {
  const {
    strategy,
    timeframe,
    threshold,
    balanceToUse,
    walletAddress,
    chain,
    signature,
  } = req.body;

  if (!strategy || !timeframe || !threshold || !balanceToUse || !walletAddress || !signature) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await executeTrade({
      strategy,
      timeframe,
      threshold,
      balanceToUse,
      walletAddress,
      chain,
      signature,
    });
    res.json(result);
  } catch (error) {
    console.error('Trade execution failed:', error.message);
    res.status(500).json({ error: error.message || 'Bot execution failed' });
  }
});

module.exports = router;
