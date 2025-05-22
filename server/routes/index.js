const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

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

// Optional: future route for getting user by wallet address
// router.get('/user/:walletAddress', authController.getUserByWallet);

module.exports = router;
