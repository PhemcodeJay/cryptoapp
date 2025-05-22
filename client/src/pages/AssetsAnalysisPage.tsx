import React, { useState } from 'react';

const BotConfigPage: React.FC = () => {
  const [strategy, setStrategy] = useState('MACD');
  const [threshold, setThreshold] = useState(10);
  const [botEnabled, setBotEnabled] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Assets Analysis</h1>

        <div className="space-y-6">

          

          {/* Strategy Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Strategy</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
            >
              <option value="MACD">MACD</option>
              <option value="RSI">RSI</option>
              <option value="Stochastic">Stochastic</option>
              <option value="BollingerBands">Bollinger Bands</option>
            </select>
          </div>

          {/* Threshold Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profit Threshold (%)
            </label>
            <input
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md"
              min={1}
              max={100}
            />
          </div>

          {/* Enable Bot Switch */}
          <div className="flex items-center">
            <label className="text-sm font-medium text-gray-700 mr-4">Enable Bot</label>
            <input
              type="checkbox"
              checked={botEnabled}
              onChange={() => setBotEnabled(!botEnabled)}
              className="h-5 w-5 text-blue-600"
            />
          </div>

          {/* Preview Section */}
          <div className="bg-gray-50 p-4 rounded border">
            <h2 className="font-semibold text-gray-700 mb-2">Preview</h2>
            <p><strong>Strategy:</strong> {strategy}</p>
            <p><strong>Profit Target:</strong> {threshold}%</p>
            <p><strong>Status:</strong> {botEnabled ? 'Enabled ✅' : 'Disabled ❌'}</p>
          </div>

          {/* Submit Button */}
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            onClick={() => alert('Configuration saved!')}
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

export default BotConfigPage;
