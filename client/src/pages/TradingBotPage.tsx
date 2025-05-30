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
      const symbol = 'BTCUSDT'; // Could be dynamic later
      const side = strategy.toLowerCase() === 'sell' ? 'sell' : 'buy'; // Simplified
      const quantity = threshold;

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
    <div className={`${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-white to-gray-100 text-gray-900'} min-h-screen p-8 flex flex-col max-w-4xl mx-auto`}>
      {/* Dark mode toggle */}
      <div className="flex justify-end mb-8">
        <button
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle dark mode"
          className="flex items-center space-x-2 rounded-lg bg-indigo-600 px-5 py-2 text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      <h1 className="text-5xl font-extrabold mb-10 text-center tracking-tight">
        🚀 Trading Bot Control Panel
      </h1>

      {/* Wallet address input */}
      <label htmlFor="walletAddress" className="block text-lg font-semibold mb-2">
        Wallet Address
      </label>
      <input
        id="walletAddress"
        type="text"
        placeholder="Enter your wallet address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className={`w-full rounded-xl border px-5 py-4 mb-6 text-lg transition focus:outline-none focus:ring-2 ${
          darkMode
            ? 'border-gray-600 bg-gray-800 text-gray-100 focus:ring-indigo-500'
            : 'border-gray-300 bg-white text-gray-900 focus:ring-indigo-600'
        }`}
      />

      <p className="text-right text-md font-medium mb-8">
        Wallet Balance: {walletBalance !== null ? `$${walletBalance.toFixed(2)}` : 'Loading...'}
      </p>

      {/* Strategy selector */}
      <label htmlFor="strategy" className="block text-lg font-semibold mb-2">
        Strategy
      </label>
      <select
        id="strategy"
        value={strategy}
        onChange={(e) => setStrategy(e.target.value)}
        className={`w-full rounded-xl border px-5 py-4 mb-8 text-lg transition focus:outline-none focus:ring-2 ${
          darkMode
            ? 'border-gray-600 bg-gray-800 text-gray-100 focus:ring-indigo-500'
            : 'border-gray-300 bg-white text-gray-900 focus:ring-indigo-600'
        }`}
      >
        <option value="MACD">MACD</option>
        <option value="RSI">RSI</option>
        <option value="Stochastic">Stochastic</option>
        <option value="BollingerBands">Bollinger Bands</option>
      </select>

      {/* Timeframe buttons */}
      <label className="block text-lg font-semibold mb-2">Timeframe</label>
      <div className="flex gap-4 mb-8">
        {(['hourly', 'daily', 'weekly'] as const).map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            type="button"
            className={`flex-1 rounded-xl py-4 font-semibold transition focus:outline-none focus:ring-2 ${
              timeframe === tf
                ? 'bg-purple-700 text-white border border-purple-700 shadow-lg'
                : darkMode
                ? 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
                : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-200'
            }`}
          >
            {tf.charAt(0).toUpperCase() + tf.slice(1)}
          </button>
        ))}
      </div>

      {/* Profit threshold input */}
      <label htmlFor="threshold" className="block text-lg font-semibold mb-2">
        Profit Threshold (%)
      </label>
      <input
        id="threshold"
        type="number"
        min={1}
        max={100}
        value={threshold}
        onChange={(e) => setThreshold(Number(e.target.value))}
        className={`w-full rounded-xl border px-5 py-4 mb-8 text-lg transition focus:outline-none focus:ring-2 ${
          darkMode
            ? 'border-gray-600 bg-gray-800 text-gray-100 focus:ring-pink-500'
            : 'border-gray-300 bg-white text-gray-900 focus:ring-pink-500'
        }`}
      />

      {/* Bot enabled toggle */}
      <div className="flex items-center space-x-4 mb-10">
        <input
          id="enableBot"
          type="checkbox"
          checked={botEnabled}
          onChange={() => setBotEnabled(!botEnabled)}
          className="h-6 w-6 rounded border-gray-300 text-green-600 focus:ring-green-500"
        />
        <label htmlFor="enableBot" className="text-lg font-semibold select-none">
          Enable Bot
        </label>
      </div>

      {/* Preview box */}
      <section
        className={`p-6 rounded-xl border mb-12 ${
          darkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-blue-50 border-blue-300 text-blue-900'
        }`}
      >
        <h2 className="text-2xl font-semibold mb-4 border-b border-gray-300 pb-2">
          Preview
        </h2>
        <ul className="space-y-2 text-lg">
          <li>
            <strong>Strategy:</strong> {strategy}
          </li>
          <li>
            <strong>Timeframe:</strong> {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
          </li>
          <li>
            <strong>Profit Target:</strong> {threshold}%
          </li>
          <li>
            <strong>Status:</strong> {botEnabled ? '✅ Enabled' : '❌ Disabled'}
          </li>
        </ul>
      </section>

      {/* Execute trade button */}
      <button
        onClick={handleTrade}
        disabled={isTrading}
        className={`w-full rounded-xl py-5 font-bold text-xl text-white transition ${
          isTrading
            ? 'cursor-not-allowed opacity-60 bg-gradient-to-r from-green-400 to-lime-400'
            : 'bg-gradient-to-r from-green-600 to-lime-600 hover:from-green-700 hover:to-lime-700'
        } focus:outline-none focus:ring-4 focus:ring-green-400`}
      >
        {isTrading ? '⏳ Trading...' : '🚀 Execute Trade'}
      </button>

      {/* Status message */}
      {status && (
        <p
          className={`mt-8 text-center text-lg font-semibold ${
            status.startsWith('❌')
              ? 'text-red-600'
              : status.startsWith('⚠️')
              ? 'text-yellow-600'
              : 'text-green-600'
          }`}
          role="alert"
          aria-live="polite"
        >
          {status}
        </p>
      )}
    </div>
  );
};

export default TradingBotPage;
