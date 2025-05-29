const express = require('express');
const router = express.Router();

const botController = require('../controllers/botController');

// ================================
// Trading Bot Routes
// ================================

// Get asset analysis results for trading decisions
// GET /api/bot/analyze?symbol=BTCUSDT&interval=1h
router.get('/analyze', botController.getAnalysis);

// Place a futures trade order
// POST /api/bot/trade
router.post('/trade', botController.tradeFutures);

module.exports = router;
