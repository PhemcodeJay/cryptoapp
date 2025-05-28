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
const { WalletBalance, TradeHistory } = require('../models');
const axios = require('axios');

// Replace with actual wallet fetch logic
exports.syncFromWalletProvider = async () => {
  const walletAddress = '0x123...'; // placeholder
  const balances = await fetchWalletData(walletAddress);

  // Save to DB (WalletBalance is your model)
  await WalletBalance.destroy({ where: { wallet: walletAddress } });
  for (const asset of balances) {
    await WalletBalance.create({
      wallet: walletAddress,
      symbol: asset.symbol,
      balance: asset.amount,
      price: asset.price,
      value: asset.amount * asset.price,
      assetClass: classifyAsset(asset.symbol),
    });
  }
};

exports.getWalletSummary = async () => {
  const balances = await WalletBalance.findAll();
  const grouped = {};

  balances.forEach((asset) => {
    const cls = asset.assetClass || 'Others';
    grouped[cls] = (grouped[cls] || 0) + asset.value;
  });

  const gainers = balances
    .filter(a => a.change24h > 0)
    .sort((a, b) => b.change24h - a.change24h)
    .slice(0, 3);

  const losers = balances
    .filter(a => a.change24h < 0)
    .sort((a, b) => a.change24h - b.change24h)
    .slice(0, 3);

  return {
    assetClasses: Object.keys(grouped).map(k => ({ class: k, total: grouped[k] })),
    gainers,
    losers,
  };
};

exports.getCandlestickChartData = async () => {
  // Sample mockup: 7 days of ETH data
  return [
    { x: '2025-05-16', o: 1800, h: 1850, l: 1780, c: 1830 },
    { x: '2025-05-17', o: 1830, h: 1870, l: 1820, c: 1855 },
    { x: '2025-05-18', o: 1855, h: 1900, l: 1840, c: 1880 },
    // ...
  ];
};

// Mock: Replace with your classification logic
const classifyAsset = (symbol) => {
  if (['USDT', 'USDC', 'DAI'].includes(symbol)) return 'Stablecoins';
  if (['BTC', 'ETH'].includes(symbol)) return 'Majors';
  if (['MATIC', 'AVAX'].includes(symbol)) return 'Altcoins';
  return 'Others';
};

// Mock: Replace with real Web3/wallet API logic
const fetchWalletData = async (wallet) => {
  // Example asset structure
  return [
    { symbol: 'ETH', amount: 2.5, price: 1800, change24h: 4.5 },
    { symbol: 'USDT', amount: 1000, price: 1, change24h: 0 },
    { symbol: 'MATIC', amount: 500, price: 0.8, change24h: -3.2 },
  ];
};
