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
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 p-10">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
          Trading Bot Configuration
        </h1>

        <div className="space-y-8">
          {/* Wallet Balance */}
          <div className="text-right text-sm font-medium text-gray-600">
            Wallet Balance: {walletBalance !== null ? `$${walletBalance.toFixed(2)}` : 'Loading...'}
          </div>

          {/* Strategy Select */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Strategy</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
            >
              <option value="MACD">MACD</option>
              <option value="RSI">RSI</option>
              <option value="Stochastic">Stochastic</option>
              <option value="BollingerBands">Bollinger Bands</option>
            </select>
          </div>

          {/* Timeframe Select */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Timeframe</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>

          {/* Threshold Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Profit Threshold (%)
            </label>
            <input
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              min={1}
              max={100}
            />
          </div>

          {/* Enable Bot Switch */}
          <div className="flex items-center space-x-4">
            <label className="text-sm font-semibold text-gray-700">Enable Bot</label>
            <input
              type="checkbox"
              checked={botEnabled}
              onChange={() => setBotEnabled(!botEnabled)}
              className="h-6 w-6 text-blue-600 rounded focus:ring-blue-500"
            />
          </div>

          {/* Preview Section */}
          <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
            <h2 className="font-semibold text-blue-700 mb-3 text-lg">Preview</h2>
            <p><strong>Strategy:</strong> {strategy}</p>
            <p><strong>Timeframe:</strong> {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}</p>
            <p><strong>Profit Target:</strong> {threshold}%</p>
            <p><strong>Status:</strong> {botEnabled ? 'Enabled ✅' : 'Disabled ❌'}</p>
          </div>

          {/* Trade Button */}
          <button
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
            onClick={handleTrade}
            disabled={isTrading}
          >
            {isTrading ? 'Trading...' : 'Execute Trade'}
          </button>

          {status && (
            <div className="text-center mt-4 text-sm font-medium text-gray-700">
              {status}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TradingBotPage;
