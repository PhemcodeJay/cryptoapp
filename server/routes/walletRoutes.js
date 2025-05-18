

/server/routes/walletRoutes.js

js

Copy code

const express = require('express'); const router = express.Router(); const walletController = require('../controllers/walletController'); router.post('/', walletController.addWallet); router.get('/', walletController.getWallets); module.exports = router; 