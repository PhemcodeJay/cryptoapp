import React, { useState, useEffect } from 'react';
import walletService from '../../services/walletService';
import hyperliquidService from '../../services/hyperliquidService';

const TradingBotPage: React.FC = () => {
  const [strategy, setStrategy] = useState('MACD');
  const [threshold, setThreshold] = useState(10);
  const [botEnabled, setBotEnabled] = useState(false);
  const [timeframe, setTimeframe] = useState<'hourly' | 'daily' | 'weekly'>('daily');
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [status, setStatus] = useState<string>('');
  const [isTrading, setIsTrading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [address, setAddress] = useState<string>('');
  const chain = 'eth';

  useEffect(() => {
    const fetchBalance = async () => {
      if (!address) {
        setStatus('⚠️ Please enter your wallet address.');
        setWalletBalance(null);
        return;
      }
      try {
        const balance = await walletService.getWalletBalance(address, chain);
        setWalletBalance(balance);
        setStatus('');
      } catch (err) {
        setStatus('⚠️ Failed to load wallet balance');
        setWalletBalance(null);
        console.error(err);
      }
    };
    fetchBalance();
  }, [address]);

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
      // Mapping strategy/timeframe to symbol and side for demo purpose
      // You may want to adjust this logic to your actual trading parameters
      const symbol = 'BTCUSDT'; // Could be dynamic later
      const side = strategy.toLowerCase() === 'sell' ? 'sell' : 'buy'; // Simplified
      const quantity = threshold; // Use threshold as quantity for demo

      const tradeResult = await hyperliquidService.placeFuturesOrder({
        walletAddress: address,
        symbol,
        side: side as 'buy' | 'sell',
        quantity,
        chain,
        mode: 'demo',
      });

      if (tradeResult.success) {
        setStatus('✅ Trade executed successfully!');
      } else {
        setStatus(`❌ Trade failed: ${tradeResult.message}`);
      }
    } catch (err: any) {
      setStatus('❌ Trade failed: ' + err.message);
    } finally {
      setIsTrading(false);
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-white to-gray-100 text-gray-900'} min-h-screen p-8 flex flex-col max-w-3xl mx-auto`}>
      {/* Dark mode toggle */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg transition font-semibold flex items-center space-x-2"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <span>☀️ Light Mode</span> : <span>🌙 Dark Mode</span>}
        </button>
      </div>

      <h1 className="text-4xl font-extrabold mb-8 text-center">🚀 Trading Bot Control Panel</h1>

      {/* Wallet address input */}
      <label className="block mb-2 font-semibold text-lg" htmlFor="walletAddress">Wallet Address</label>
      <input
        id="walletAddress"
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter your wallet address"
        className={`w-full p-4 rounded-xl border ${
          darkMode ? 'border-gray-600 bg-gray-700 text-white focus:ring-blue-500' : 'border-gray-300 bg-white text-gray-900 focus:ring-indigo-500'
        } mb-4 focus:outline-none focus:ring-2 transition`}
      />

      <p className="text-right mb-6 font-medium">
        Wallet Balance: {walletBalance !== null ? `$${walletBalance.toFixed(2)}` : 'Loading...'}
      </p>

      {/* Strategy selector */}
      <label className="block mb-2 font-semibold text-lg" htmlFor="strategy">Strategy</label>
      <select
        id="strategy"
        className={`w-full p-4 rounded-xl border mb-6 ${
          darkMode ? 'border-gray-600 bg-gray-700 text-white focus:ring-blue-500' : 'border-gray-300 bg-white text-gray-900 focus:ring-indigo-500'
        } transition focus:outline-none focus:ring-2`}
        value={strategy}
        onChange={(e) => setStrategy(e.target.value)}
      >
        <option value="MACD">MACD</option>
        <option value="RSI">RSI</option>
        <option value="Stochastic">Stochastic</option>
        <option value="BollingerBands">Bollinger Bands</option>
      </select>

      {/* Timeframe buttons */}
      <label className="block mb-2 font-semibold text-lg">Timeframe</label>
      <div className="flex gap-4 mb-6">
        {(['hourly', 'daily', 'weekly'] as const).map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`flex-1 py-3 rounded-xl font-semibold border transition
              ${
                timeframe === tf
                  ? 'bg-purple-600 text-white border-purple-700'
                  : darkMode
                  ? 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600'
                  : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-200'
              }`}
            type="button"
          >
            {tf.charAt(0).toUpperCase() + tf.slice(1)}
          </button>
        ))}
      </div>

      {/* Profit threshold input */}
      <label className="block mb-2 font-semibold text-lg" htmlFor="threshold">Profit Threshold (%)</label>
      <input
        id="threshold"
        type="number"
        min={1}
        max={100}
        value={threshold}
        onChange={(e) => setThreshold(Number(e.target.value))}
        className={`w-full p-4 rounded-xl border mb-6 ${
          darkMode ? 'border-gray-600 bg-gray-700 text-white focus:ring-pink-500' : 'border-gray-300 bg-white text-gray-900 focus:ring-pink-500'
        } transition focus:outline-none focus:ring-2`}
      />

      {/* Bot enabled toggle */}
      <div className="flex items-center mb-6 space-x-3">
        <input
          id="enableBot"
          type="checkbox"
          checked={botEnabled}
          onChange={() => setBotEnabled(!botEnabled)}
          className="h-6 w-6 rounded border-gray-300 text-green-600 focus:ring-green-500"
        />
        <label htmlFor="enableBot" className="font-semibold text-lg select-none">Enable Bot</label>
      </div>

      {/* Preview box */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-blue-100 border-blue-300 text-blue-900'} p-6 rounded-xl border mb-8`}>
        <h2 className="text-xl font-semibold mb-3">Preview</h2>
        <p><strong>Strategy:</strong> {strategy}</p>
        <p><strong>Timeframe:</strong> {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}</p>
        <p><strong>Profit Target:</strong> {threshold}%</p>
        <p><strong>Status:</strong> {botEnabled ? '✅ Enabled' : '❌ Disabled'}</p>
      </div>

      {/* Execute trade button */}
      <button
        onClick={handleTrade}
        disabled={isTrading}
        className={`w-full py-4 rounded-xl font-bold text-lg text-white transition ${
          isTrading
            ? 'opacity-50 cursor-not-allowed bg-gradient-to-r from-green-400 to-lime-400'
            : 'bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600'
        }`}
      >
        {isTrading ? '⏳ Trading...' : '🚀 Execute Trade'}
      </button>

      {/* Status message */}
      {status && (
        <p className={`mt-6 text-center font-medium ${status.startsWith('❌') ? 'text-red-600' : status.startsWith('⚠️') ? 'text-yellow-600' : 'text-green-600'}`}>
          {status}
        </p>
      )}
    </div>
  );
};

export default TradingBotPage;
