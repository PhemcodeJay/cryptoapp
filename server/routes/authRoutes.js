const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Request a nonce message for wallet login
router.post('/request-nonce', authController.requestNonce);

// Verify signed message and login (connect wallet)
router.post('/connect-wallet', authController.verifySignature);

// Logout (disconnect wallet)
router.post('/logout', authController.logout);

// Optional: You can add getUserByWallet later if implemented
// router.get('/user/:walletAddress', authController.getUserByWallet);

module.exports = router;
