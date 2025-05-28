// controllers/botController.js

const botTrader = require('../services/botTrader');

exports.getAnalysis = async (req, res) => {
  const { symbol } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: 'Symbol query parameter is required' });
  }

  try {
    // Call the analyze method from botTrader
    const data = await botTrader.analyze(symbol);

    // Return the results as JSON
    res.json(data);
  } catch (err) {
    console.error('Error in getAnalysis:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
};
