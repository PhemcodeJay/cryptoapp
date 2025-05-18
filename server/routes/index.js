const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
// Other routes: bot, wallet, etc. will be added here later

module.exports = router;