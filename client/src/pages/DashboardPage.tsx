import React, { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'wallet' | 'bot'>('wallet');
  const [botStatus, setBotStatus] = useState<'active' | 'paused'>('paused');
  const [riskLevel, setRiskLevel] = useState<number>(3);

  const walletData = {
    balance: 12453.87,
    profitLoss: 1245.32,
    assets: [
      { symbol: 'BTC', value: 8230.45, change: 5.2 },
      { symbol: 'ETH', value: 3120.23, change: -1.8 },
      { symbol: 'SOL', value: 1103.19, change: 12.4 }
    ]
  };

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Portfolio Value',
        data: [5000, 7000, 8500, 9200, 11000, 12453],
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const tradingData = {
    labels: ['Wins', 'Losses', 'Open'],
    datasets: [
      {
        label: 'Trades',
        data: [42, 18, 7],
        backgroundColor: [
          'rgba(34, 197, 94, 0.9)',
          'rgba(239, 68, 68, 0.9)',
          'rgba(107, 114, 128, 0.9)'
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-sky-900 via-indigo-800 to-purple-800 p-6 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-6 text-center">🚀 CryptoPilot Dashboard</h1>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <button
            onClick={() => setActiveTab('wallet')}
            className={`px-6 py-2 rounded-full mx-2 font-medium transition-all ${
              activeTab === 'wallet'
                ? 'bg-white text-indigo-800 shadow-lg'
                : 'bg-indigo-500 hover:bg-indigo-600'
            }`}
          >
            Wallet Summary
          </button>
          <button
            onClick={() => setActiveTab('bot')}
            className={`px-6 py-2 rounded-full mx-2 font-medium transition-all ${
              activeTab === 'bot'
                ? 'bg-white text-indigo-800 shadow-lg'
                : 'bg-indigo-500 hover:bg-indigo-600'
            }`}
          >
            Bot Settings
          </button>
        </div>

        {/* Wallet View */}
        {activeTab === 'wallet' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Summary */}
            <div className="bg-white text-gray-800 p-6 rounded-xl shadow-md border">
              <h2 className="text-xl font-semibold mb-4">Wallet Overview</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Balance</span>
                  <span className="text-2xl font-bold text-green-600">${walletData.balance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Profit/Loss</span>
                  <span className={`text-xl font-medium ${walletData.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {walletData.profitLoss >= 0 ? '+' : ''}
                    {walletData.profitLoss.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Assets */}
            <div className="bg-white text-gray-800 p-6 rounded-xl shadow-md border">
              <h2 className="text-xl font-semibold mb-4">Asset Breakdown</h2>
              <div className="space-y-4">
                {walletData.assets.map((asset) => (
                  <div key={asset.symbol} className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center font-bold text-indigo-800">
                        {asset.symbol}
                      </div>
                      <span className="font-medium">{asset.symbol}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${asset.value.toLocaleString()}</div>
                      <div className={`text-sm ${asset.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {asset.change >= 0 ? '+' : ''}
                        {asset.change}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white text-gray-800 p-6 rounded-xl shadow-md border lg:col-span-3">
              <h2 className="text-xl font-semibold mb-4">📈 Portfolio Growth</h2>
              <div className="h-80">
                <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
          </div>
        ) : (
          // Bot Settings
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white text-gray-800 p-6 rounded-xl shadow-md border">
              <h2 className="text-xl font-semibold mb-4">⚙️ Bot Controls</h2>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span>Bot Status</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${botStatus === 'active' ? 'bg-green-500' : 'bg-yellow-400'}`}></div>
                    <span className="capitalize font-medium">{botStatus}</span>
                  </div>
                </div>

                <button
                  onClick={() => setBotStatus(botStatus === 'active' ? 'paused' : 'active')}
                  className={`w-full py-2 rounded-lg font-medium transition ${
                    botStatus === 'active'
                      ? 'bg-red-100 text-red-600 hover:bg-red-200'
                      : 'bg-green-100 text-green-600 hover:bg-green-200'
                  }`}
                >
                  {botStatus === 'active' ? 'Pause Bot' : 'Activate Bot'}
                </button>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>Risk Level</span>
                    <span>{riskLevel}/5</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={riskLevel}
                    onChange={(e) => setRiskLevel(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white text-gray-800 p-6 rounded-xl shadow-md border">
              <h2 className="text-xl font-semibold mb-4">📊 Bot Performance</h2>
              <div className="h-64">
                <Bar data={tradingData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">42</div>
                  <div className="text-sm text-gray-500">Wins</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">18</div>
                  <div className="text-sm text-gray-500">Losses</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-600">7</div>
                  <div className="text-sm text-gray-500">Open</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
