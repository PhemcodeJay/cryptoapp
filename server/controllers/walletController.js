const { WalletBalance } = require('../models');
const walletService = require('../services/walletService'); // For addWallet, getWallets, etc.

// Helper: classify asset symbols into categories
const classifyAsset = (symbol) => {
  if (['USDT', 'USDC', 'DAI'].includes(symbol)) return 'Stablecoins';
  if (['BTC', 'ETH'].includes(symbol)) return 'Majors';
  if (['MATIC', 'AVAX'].includes(symbol)) return 'Altcoins';
  return 'Others';
};

// Mock function simulating external wallet data fetch (replace with real API)
const fetchWalletData = async (walletAddress) => {
  // Example dummy data; replace with real blockchain API calls as needed
  return [
    { symbol: 'ETH', amount: 2.5, price: 1800, change24h: 4.5 },
    { symbol: 'USDT', amount: 1000, price: 1, change24h: 0 },
    { symbol: 'MATIC', amount: 500, price: 0.8, change24h: -3.2 },
  ];
};

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

// Sync wallet balances from external provider and update DB
exports.syncWallet = async (req, res) => {
  try {
    // You can pass wallet address from req.body if needed; for now, placeholder:
    const walletAddress = req.body.walletAddress || '0x123...'; // Replace as needed

    // Fetch latest wallet balances from external provider
    const balances = await fetchWalletData(walletAddress);

    // Clear old balances for this wallet before inserting new ones
    await WalletBalance.destroy({ where: { wallet: walletAddress } });

    // Insert new balance records
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

    res.json({ message: 'Wallet synced successfully', wallet: walletAddress });
  } catch (err) {
    console.error('Wallet sync error:', err);
    res.status(500).json({ error: 'Wallet sync failed' });
  }
};

// Get summary of wallet balances grouped by asset class, including top gainers and losers
exports.getSummary = async (req, res) => {
  try {
    const balances = await WalletBalance.findAll();

    // Group balances by asset class and sum their values
    const grouped = {};
    balances.forEach(asset => {
      const cls = asset.assetClass || 'Others';
      grouped[cls] = (grouped[cls] || 0) + asset.value;
    });

    // Get top 3 gainers by 24h change
    const gainers = balances
      .filter(a => a.change24h > 0)
      .sort((a, b) => b.change24h - a.change24h)
      .slice(0, 3);

    // Get top 3 losers by 24h change
    const losers = balances
      .filter(a => a.change24h < 0)
      .sort((a, b) => a.change24h - b.change24h)
      .slice(0, 3);

    res.json({
      assetClasses: Object.entries(grouped).map(([cls, total]) => ({ class: cls, total })),
      gainers,
      losers,
    });
  } catch (err) {
    console.error('Get summary error:', err);
    res.status(500).json({ error: 'Failed to get wallet summary' });
  }
};

// Get candlestick chart data (mocked)
exports.getCandlestickData = async (req, res) => {
  try {
    const data = [
      { x: '2025-05-16', o: 1800, h: 1850, l: 1780, c: 1830 },
      { x: '2025-05-17', o: 1830, h: 1870, l: 1820, c: 1855 },
      { x: '2025-05-18', o: 1855, h: 1900, l: 1840, c: 1880 },
    ];
    res.json(data);
  } catch (err) {
    console.error('Candlestick data error:', err);
    res.status(500).json({ error: 'Failed to get chart data' });
  }
};
