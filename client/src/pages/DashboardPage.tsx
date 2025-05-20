import React, { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
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
  Filler,
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
      { symbol: 'SOL', value: 1103.19, change: 12.4 },
    ],
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
        tension: 0.4,
      },
    ],
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
          'rgba(107, 114, 128, 0.9)',
        ],
      },
    ],
  };

  return (
    <div className="bg-dark text-light min-vh-100 py-4">
      <div className="container">
        <h1 className="text-center mb-4 fw-bold">🚀 CryptoPilot Dashboard</h1>

        {/* Navigation Buttons */}
        <div className="d-flex justify-content-center mb-4 gap-3 flex-wrap">
          <Link to="/" className="btn btn-outline-light">
            🏠 Home
          </Link>
          <Link to="/wallet-connect" className="btn btn-outline-warning text-dark">
            🔐 Connect Wallet
          </Link>
          <Link to="/trading-bot" className="btn btn-outline-primary">
            🤖 Trading Bot
          </Link>
          <Link to="/logout" className="btn btn-outline-danger">
            🚪 Logout
          </Link>
        </div>

        {/* Tabs */}
        <ul className="nav nav-tabs justify-content-center mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'wallet' ? 'active' : ''}`}
              onClick={() => setActiveTab('wallet')}
            >
              Wallet Summary
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'bot' ? 'active' : ''}`}
              onClick={() => setActiveTab('bot')}
            >
              Bot Settings
            </button>
          </li>
        </ul>

        {/* Wallet Summary Tab */}
        {activeTab === 'wallet' ? (
          <div className="row g-4">
            {/* Wallet Overview */}
            <div className="col-12 col-lg-4">
              <div className="card text-dark h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Wallet Overview</h5>
                  <div className="d-flex justify-content-between my-3">
                    <span>Total Balance</span>
                    <span className="fw-bold text-success fs-4">${walletData.balance.toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Profit/Loss</span>
                    <span className={`fs-5 fw-semibold ${walletData.profitLoss >= 0 ? 'text-success' : 'text-danger'}`}>
                      {walletData.profitLoss >= 0 ? '+' : ''}
                      {walletData.profitLoss.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Asset Breakdown */}
            <div className="col-12 col-lg-4">
              <div className="card text-dark h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title mb-3">Asset Breakdown</h5>
                  <ul className="list-group list-group-flush">
                    {walletData.assets.map((asset) => (
                      <li
                        key={asset.symbol}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <div className="d-flex align-items-center gap-3">
                          <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: 32, height: 32 }}>
                            {asset.symbol}
                          </div>
                          <span>{asset.symbol}</span>
                        </div>
                        <div className="text-end">
                          <div className="fw-semibold">${asset.value.toLocaleString()}</div>
                          <div className={asset.change >= 0 ? 'text-success' : 'text-danger'}>
                            {asset.change >= 0 ? '+' : ''}
                            {asset.change}%
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Portfolio Growth Chart */}
            <div className="col-12 col-lg-4">
              <div className="card text-dark h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title mb-3">📈 Portfolio Growth</h5>
                  <div style={{ height: '250px' }}>
                    <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Bot Settings Tab
          <div className="row g-4">
            <div className="col-12 col-lg-6">
              <div className="card text-dark h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title mb-4">⚙️ Bot Controls</h5>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span>Bot Status</span>
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className={`rounded-circle ${
                          botStatus === 'active' ? 'bg-success' : 'bg-warning'
                        }`}
                        style={{ width: 12, height: 12 }}
                      ></div>
                      <span className="text-capitalize fw-semibold">{botStatus}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setBotStatus(botStatus === 'active' ? 'paused' : 'active')}
                    className={`btn w-100 mb-4 ${
                      botStatus === 'active' ? 'btn-danger' : 'btn-success'
                    }`}
                  >
                    {botStatus === 'active' ? 'Pause Bot' : 'Activate Bot'}
                  </button>

                  <div>
                    <label htmlFor="riskLevel" className="form-label d-flex justify-content-between">
                      <span>Risk Level</span>
                      <span>{riskLevel}/5</span>
                    </label>
                    <input
                      type="range"
                      className="form-range"
                      min={1}
                      max={5}
                      value={riskLevel}
                      onChange={(e) => setRiskLevel(parseInt(e.target.value))}
                      id="riskLevel"
                    />
                    <div className="d-flex justify-content-between small text-muted">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div className="card text-dark h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title mb-3">📊 Bot Performance</h5>
                  <div style={{ height: '250px' }}>
                    <Bar data={tradingData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
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
