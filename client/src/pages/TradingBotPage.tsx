import React, { useState, useEffect } from 'react';
import walletService from '../services/walletService';
import hyperliquidService from '../services/hyperliquidService';

const TradingBotPage: React.FC = () => {
  const [strategy, setStrategy] = useState('MACD');
  const [threshold, setThreshold] = useState(10);
  const [botEnabled, setBotEnabled] = useState(false);
  const [timeframe, setTimeframe] = useState('daily');
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [status, setStatus] = useState<string>('');
  const [isTrading, setIsTrading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const balance = await walletService.getWalletBalance();
        setWalletBalance(balance);
      } catch (err) {
        setStatus('⚠️ Failed to load wallet balance');
        console.error(err);
      }
    };
    fetchBalance();
  }, []);

  const handleTrade = async () => {
    setStatus('');
    if (!botEnabled) {
      setStatus('❌ Bot must be enabled to trade');
      return;
    }

    if (walletBalance !== null && walletBalance < 5) {
      setStatus('⚠️ Minimum $5 USDT required to trade.');
      return;
    }

    setIsTrading(true);
    setStatus('⏳ Executing trade...');

    try {
      await hyperliquidService.tradeFutures(strategy, threshold, timeframe);
      setStatus('✅ Trade executed successfully!');
    } catch (err) {
      setStatus('❌ Trade failed: ' + (err as any).message);
    } finally {
      setIsTrading(false);
    }
  };

  return (
    <div className={darkMode ? 'bg-gray-900 text-white min-h-screen p-6' : 'bg-gradient-to-br from-white to-gray-100 text-gray-900 min-h-screen p-6'}>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition font-semibold"
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500">
          Trading Bot Configuration
        </h1>

        <div className="space-y-6">
          <div className="text-right text-sm font-medium">
            Wallet Balance: {walletBalance !== null ? `$${walletBalance.toFixed(2)}` : 'Loading...'}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Strategy</label>
            <select
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
            >
              <option value="MACD">MACD</option>
              <option value="RSI">RSI</option>
              <option value="Stochastic">Stochastic</option>
              <option value="BollingerBands">Bollinger Bands</option>
            </select>
          </div>

          {/* Timeframe buttons instead of select */}
          <div>
            <label className="block text-sm font-semibold mb-2">Timeframe</label>
            <div className="flex space-x-3">
              {['hourly', 'daily', 'weekly'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-4 py-2 rounded-xl font-semibold border
                    ${timeframe === tf 
                      ? 'bg-purple-600 text-white border-purple-700' 
                      : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                    } transition`}
                >
                  {tf.charAt(0).toUpperCase() + tf.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Profit Threshold (%)</label>
            <input
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              min={1}
              max={100}
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div className="flex items-center space-x-3">
            <label className="text-sm font-semibold">Enable Bot</label>
            <input
              type="checkbox"
              checked={botEnabled}
              onChange={() => setBotEnabled(!botEnabled)}
              className="h-6 w-6 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
          </div>

          <div className="bg-blue-100 dark:bg-blue-900 p-5 rounded-lg border border-blue-300 dark:border-blue-700">
            <h2 className="font-semibold text-blue-700 dark:text-blue-200 mb-2">Preview</h2>
            <p><strong>Strategy:</strong> {strategy}</p>
            <p><strong>Timeframe:</strong> {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}</p>
            <p><strong>Profit Target:</strong> {threshold}%</p>
            <p><strong>Status:</strong> {botEnabled ? '✅ Enabled' : '❌ Disabled'}</p>
          </div>

          <button
            onClick={handleTrade}
            disabled={isTrading}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 text-white font-bold text-lg rounded-xl transition disabled:opacity-50"
          >
            {isTrading ? '⏳ Trading...' : '🚀 Execute Trade'}
          </button>

          {status && (
            <div className="text-center mt-4 text-sm font-medium">
              {status}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TradingBotPage;
