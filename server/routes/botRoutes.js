const express = require('express');
const router = express.Router();

const botController = require('../controllers/botController');

// ================================
// Trading Bot Routes
// ================================

// Get asset analysis results for trading decisions
// GET /api/bot/analyze?symbol=BTCUSDT&interval=1h
router.get('/analyze', botController.getAnalysis);

// Future Expansion:
// - Execute trade
// - Fetch or update bot config
// - View past bot actions/logs

module.exports = router;
