const assetAnalysis = require('../services/assetAnalysis');

/**
 * GET /api/bot/analyze?symbol=BTCUSDT
 * Returns technical analysis data across timeframes for a given trading pair.
 */
exports.getAnalysis = async (req, res) => {
  const symbol = req.query.symbol?.toUpperCase();

  if (!symbol) {
    return res.status(400).json({ error: 'Symbol parameter is required, e.g., BTCUSDT' });
  }

  try {
    const analysis = await assetAnalysis.analyze(symbol); // use assetAnalysis here
    res.json({ symbol, analysis });
  } catch (error) {
    console.error('Error during analysis:', error);
    res.status(500).json({ error: 'Failed to fetch asset analysis' });
  }
};
