import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { Chart as ChartJSReact } from 'react-chartjs-2';
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
import 'chartjs-adapter-date-fns';
import type { ChartOptions } from 'chart.js';

// Register chart.js components and plugins
ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  Title,
  CandlestickController,
  CandlestickElement
);

// Custom wrapper for candlestick chart
const CandlestickChart = ChartJSReact as unknown as React.FC<{
  type: 'candlestick';
  data: any;
  options: any;
}>;

interface Asset {
  symbol: string;
  changePercent: number;
}

interface WalletSummary {
  assetClasses?: { class: string; total: number }[];
  gainers?: Asset[];
  losers?: Asset[];
}

const DashboardPage: React.FC = () => {
  const [walletSummary, setWalletSummary] = useState<WalletSummary | null>(null);
  const [candlestickData, setCandlestickData] = useState<
    { x: number | string | Date; o: number; h: number; l: number; c: number }[]
  >([]);
  const [selectedAsset, setSelectedAsset] = useState<string>('BTCUSDT');
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  const fetchWalletSummary = async () => {
    try {
      const res = await fetch('/api/wallet/summary');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data: WalletSummary = await res.json();
      setWalletSummary(data);
    } catch (err) {
      console.error('Failed to fetch wallet summary:', err);
    }
  };

  const fetchCandlestickData = async (asset: string) => {
    try {
      const res = await fetch(`/api/wallet/candlestick?symbol=${asset}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setCandlestickData(data);
    } catch (err) {
      console.error('Failed to fetch candlestick data:', err);
      setCandlestickData([]);
    }
  };

  const syncWallet = async () => {
    try {
      const res = await fetch('/api/wallet/sync', { method: 'POST' });
      if (res.ok) setLastSynced(new Date());
      else throw new Error(`Sync failed: status ${res.status}`);
    } catch (err) {
      console.error('Wallet sync failed:', err);
    }
  };

  useEffect(() => {
    fetchWalletSummary();
    fetchCandlestickData(selectedAsset);

    const interval = setInterval(() => {
      syncWallet();
      fetchWalletSummary();
      fetchCandlestickData(selectedAsset);
    }, 15000);

    return () => clearInterval(interval);
  }, [selectedAsset]);

  const chartData = {
    datasets: [
      {
        label: selectedAsset,
        data: candlestickData,
        type: 'candlestick' as const,
        borderColor: '#4e73df',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions: ChartOptions<'candlestick'> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
      title: { display: true, text: `${selectedAsset} Candlestick Chart` },
    },
    scales: {
      x: {
        type: 'timeseries',
        time: { unit: 'hour' },
        ticks: { source: 'auto' },
      },
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-800">📊 Dashboard</h1>
        <button
          onClick={syncWallet}
          className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition"
        >
          🔄 Sync Wallet
        </button>
      </div>

      <p className="text-sm text-gray-500">
        Last synced:{' '}
        <span className="font-medium text-gray-700">
          {lastSynced ? lastSynced.toLocaleTimeString() : 'Never'}
        </span>
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor="asset" className="text-sm font-medium text-gray-700">
          Select Asset:
        </label>
        <select
          id="asset"
          value={selectedAsset}
          onChange={(e) => setSelectedAsset(e.target.value)}
          className="border border-gray-300 px-3 py-1 rounded-md shadow-sm"
        >
          <option value="BTCUSDT">BTC/USDT</option>
          <option value="ETHUSDT">ETH/USDT</option>
          <option value="BNBUSDT">BNB/USDT</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Candlestick Chart</h2>
        {candlestickData.length > 0 ? (
          <CandlestickChart type="candlestick" data={chartData} options={chartOptions} />
        ) : (
          <p className="text-sm text-gray-500">No chart data available.</p>
        )}
      </div>

      {walletSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Balance Breakdown</h2>
            <ul className="space-y-2 text-sm">
              {walletSummary.assetClasses?.map((item) => (
                <li key={item.class} className="flex justify-between border-b pb-1">
                  <span className="text-gray-600">{item.class}</span>
                  <span className="font-medium text-gray-800">${item.total.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Top Movers</h2>
            <ul className="space-y-1 text-sm">
              {walletSummary.gainers?.map((a) => (
                <li key={a.symbol} className="text-green-600">
                  ▲ {a.symbol}: {a.changePercent.toFixed(2)}%
                </li>
              ))}
              {walletSummary.losers?.map((a) => (
                <li key={a.symbol} className="text-red-600">
                  ▼ {a.symbol}: {a.changePercent.toFixed(2)}%
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="text-center pt-4">
        <Link to="/portfolio" className="text-blue-600 font-medium hover:underline">
          → View Full Portfolio
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;
