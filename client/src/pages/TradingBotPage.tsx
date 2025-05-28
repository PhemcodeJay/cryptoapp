import React, { useState } from 'react';

const TradingBotPage: React.FC = () => {
  const [strategy, setStrategy] = useState('MACD');
  const [threshold, setThreshold] = useState(10);
  const [botEnabled, setBotEnabled] = useState(false);
  const [timeframe, setTimeframe] = useState('daily');

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 p-10">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
          Trading Bot Configuration
        </h1>

        <div className="space-y-8">

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

          {/* Submit Button */}
          <button
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            onClick={() => alert('Configuration saved!')}
          >
            Save Configuration
          </button>

        </div>
      </div>
    </div>
  );
};

export default TradingBotPage;