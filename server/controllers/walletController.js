const { WalletBalance } = require('../models');
const walletService = require('../services/walletService');
const { fetchUsdtBalance } = require('../services/walletService'); // Already exports fetchEthUsdtBalance, fetchBscUsdtBalance, fetchUsdtBalance

// Classify assets into categories
const classifyAsset = (symbol) => {
  if (['USDT', 'USDC', 'DAI'].includes(symbol)) return 'Stablecoins';
  if (['BTC', 'ETH'].includes(symbol)) return 'Majors';
  if (['MATIC', 'AVAX'].includes(symbol)) return 'Altcoins';
  return 'Others';
};

// Add a new wallet
exports.addWallet = async (req, res) => {
  try {
    const wallet = await walletService.addWallet(req.body);
    res.status(201).json(wallet);
  } catch (err) {
    console.error('Error adding wallet:', err);
    res.status(400).json({ error: err.message || 'Failed to add wallet' });
  }
};

// Get all wallets for a user
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

// Sync wallet balances using real USDT data
exports.syncWallet = async (req, res) => {
  const { walletAddress, chain = 'eth' } = req.body;

  if (!walletAddress || typeof walletAddress !== 'string') {
    return res.status(400).json({ error: 'walletAddress is required' });
  }

  try {
    const usdtData = await fetchUsdtBalance(walletAddress, chain);
    if (!usdtData) {
      return res.status(500).json({ error: 'Failed to fetch USDT balance from blockchain' });
    }

    await WalletBalance.destroy({ where: { wallet: walletAddress } });

    const symbol = 'USDT';
    const price = 1; // USDT is always ~$1
    const amount = usdtData.balance;
    const value = amount * price;

    await WalletBalance.create({
      wallet: walletAddress,
      symbol,
      balance: amount,
      price,
      value,
      assetClass: classifyAsset(symbol),
      change24h: 0, // You could integrate Coingecko or Binance API for real 24h change
    });

    res.json({ message: 'Wallet synced successfully', wallet: walletAddress });
  } catch (err) {
    console.error('Wallet sync error:', err);
    res.status(500).json({ error: 'Wallet sync failed' });
  }
};

// Get summary of wallet balances
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
      assetClasses: Object.entries(grouped).map(([cls, total]) => ({ class: cls, total })),
      gainers,
      losers,
    });
  } catch (err) {
    console.error('Get summary error:', err);
    res.status(500).json({ error: 'Failed to get wallet summary' });
  }
};

// Mocked candlestick chart data
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
