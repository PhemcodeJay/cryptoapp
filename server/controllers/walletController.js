// controllers/walletController.js

const walletService = require('../services/walletService');

exports.addWallet = async (req, res) => {
  try {
    const wallet = await walletService.addWallet(req.body);
    res.status(201).json(wallet);
  } catch (err) {
    console.error('Error adding wallet:', err);
    res.status(400).json({ error: err.message || 'Failed to add wallet' });
  }
};

exports.getWallets = async (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: 'userId query parameter is required' });
  }

  try {
    const wallets = await walletService.getWallets(userId);
    res.json(wallets);
  } catch (err) {
    console.error('Error getting wallets:', err);
    res.status(400).json({ error: err.message || 'Failed to get wallets' });
  }
};
