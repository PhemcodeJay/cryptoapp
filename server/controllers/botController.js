
/server/controllers/botController.js

js

Copy code

const botService = require('../services/botService'); exports.getAnalysis = async (req, res) => { try { const data = await botService.analyzeIndicators(req.query.symbol); res.json(data); } catch (err) { res.status(500).json({ error: err.message }); } }; 