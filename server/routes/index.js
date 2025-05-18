const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/bot', require('./botRoutes'));
router.use('/wallet', require('./walletRoutes'));
// Other routes: bot, wallet, etc. will be added here later

module.exports = router;