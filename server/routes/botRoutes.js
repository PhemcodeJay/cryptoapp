

/server/routes/botRoutes.js

js

Copy code

const express = require('express'); const router = express.Router(); const botController = require('../controllers/botController'); router.get('/analyze', botController.getAnalysis); module.exports = router; 