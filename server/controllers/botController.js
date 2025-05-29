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

/**
 * Controller to place a futures order via botTrader service
 */
exports.tradeFutures = async (req, res) => {
  try {
    const orderParams = req.body;

    const result = await botTrader.placeFuturesOrder(orderParams);

    if (result.error) {
      return res.status(400).json({ success: false, message: result.error });
    }

    res.json({ success: true, message: 'Order placed successfully', data: result });
  } catch (err) {
    console.error('Error in tradeFutures:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
