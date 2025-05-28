const { WalletBalance } = require('../models');
const walletService = require('../services/walletService'); // if you want to move logic out later

// Add a wallet for a user
exports.addWallet = async (req, res) => {
  try {
    const wallet = await walletService.addWallet(req.body);
    res.status(201).json(wallet);
  } catch (err) {
    console.error('Error adding wallet:', err);
    res.status(400).json({ error: err.message || 'Failed to add wallet' });
  }
};

// Get wallets for a user by userId query parameter
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

// Sync wallet balances from external wallet provider (mock implementation)
exports.syncWallet = async (req, res) => {
  try {
    await exports.syncFromWalletProvider();
    res.json({ message: 'Wallet synced successfully' });
  } catch (err) {
    console.error('Wallet sync error:', err);
    res.status(500).json({ error: 'Wallet sync failed' });
  }
};

// Internal sync function: fetches wallet data and updates DB
exports.syncFromWalletProvider = async () => {
  const walletAddress = '0x123...'; // Placeholder, replace with actual address or param

  const balances = await fetchWalletData(walletAddress);

  // Clear old balances for this wallet before inserting fresh ones
  await WalletBalance.destroy({ where: { wallet: walletAddress } });

  for (const asset of balances) {
    await WalletBalance.create({
      wallet: walletAddress,
      symbol: asset.symbol,
      balance: asset.amount,
      price: asset.price,
      value: asset.amount * asset.price,
      assetClass: classifyAsset(asset.symbol),
      change24h: asset.change24h,
    });
  }
};

// Get summary of wallet balances grouped by asset class with gainers and losers
exports.getSummary = async (req, res) => {
  try {
    const balances = await WalletBalance.findAll();

    const grouped = {};
    balances.forEach(asset => {
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

    res.json({
      assetClasses: Object.keys(grouped).map(k => ({ class: k, total: grouped[k] })),
      gainers,
      losers,
    });
  } catch (err) {
    console.error('Get summary error:', err);
    res.status(500).json({ error: 'Failed to get wallet summary' });
  }
};

// Get candlestick chart data (mocked for now)
exports.getCandlestickData = async (req, res) => {
  try {
    const data = [
      { x: '2025-05-16', o: 1800, h: 1850, l: 1780, c: 1830 },
      { x: '2025-05-17', o: 1830, h: 1870, l: 1820, c: 1855 },
      { x: '2025-05-18', o: 1855, h: 1900, l: 1840, c: 1880 },
      // Add more if needed
    ];
    res.json(data);
  } catch (err) {
    console.error('Candlestick data error:', err);
    res.status(500).json({ error: 'Failed to get chart data' });
  }
};

// Asset classification helper
const classifyAsset = (symbol) => {
  if (['USDT', 'USDC', 'DAI'].includes(symbol)) return 'Stablecoins';
  if (['BTC', 'ETH'].includes(symbol)) return 'Majors';
  if (['MATIC', 'AVAX'].includes(symbol)) return 'Altcoins';
  return 'Others';
};

// Mock fetchWalletData to simulate external wallet provider API
const fetchWalletData = async (walletAddress) => {
  // You could replace this with real blockchain API calls
  return [
    { symbol: 'ETH', amount: 2.5, price: 1800, change24h: 4.5 },
    { symbol: 'USDT', amount: 1000, price: 1, change24h: 0 },
    { symbol: 'MATIC', amount: 500, price: 0.8, change24h: -3.2 },
  ];
};
