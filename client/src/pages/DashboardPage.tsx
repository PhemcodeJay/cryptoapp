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
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
import { Chart } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

// Register necessary ChartJS components including financial charts
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

// Asset type for gainers/losers
interface Asset {
  symbol: string;
  changePercent: number;
}

// Wallet summary response type (partial)
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

  // Fetch wallet summary
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

  // Fetch candlestick data for selected asset
  const fetchCandlestickData = async (asset: string) => {
    try {
      const res = await fetch(`/api/wallet/candlestick?symbol=${asset}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      // Expecting data as array of { x, o, h, l, c }
      setCandlestickData(data);
    } catch (err) {
      console.error('Candlestick fetch failed:', err);
      setCandlestickData([]); // Clear on error
    }
  };

  // Sync wallet data
  const syncWallet = async () => {
    try {
      const res = await fetch('/api/wallet/sync', { method: 'POST' });
      if (res.ok) setLastSynced(new Date());
      else throw new Error(`Sync failed: status ${res.status}`);
    } catch (err) {
      console.error('Wallet sync failed:', err);
    }
  };

  // Effect: fetch data on mount and whenever selectedAsset changes
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

  // Chart.js data and options
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

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
      title: { display: true, text: `${selectedAsset} Candlestick Chart` },
    },
    scales: {
      x: {
        type: 'timeseries' as const,
        time: { unit: 'hour' },
        ticks: { source: 'auto' as 'auto' }, // Explicitly type as literal
      },
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="p-4 space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">📊 Dashboard</h1>
        <button
          onClick={syncWallet}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          title="Sync Wallet Now"
        >
          🔄 Sync Wallet
        </button>
      </div>

      <div className="text-sm text-gray-600">
        Last synced: {lastSynced ? lastSynced.toLocaleTimeString() : 'Never'}
      </div>

      <div className="flex gap-4 items-center">
        <label htmlFor="asset" className="text-gray-700 font-medium">
          Asset:
        </label>
        <select
          id="asset"
          value={selectedAsset}
          onChange={(e) => setSelectedAsset(e.target.value)}
          className="border px-3 py-1 rounded"
        >
          <option value="BTCUSDT">BTC/USDT</option>
          <option value="ETHUSDT">ETH/USDT</option>
          <option value="BNBUSDT">BNB/USDT</option>
        </select>
      </div>

      <div className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Candlestick Chart</h2>
        <Chart type="candlestick" data={chartData} options={chartOptions} />
      </div>

      {walletSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-lg font-semibold mb-2">Balance Breakdown</h2>
            <ul>
              {walletSummary.assetClasses?.map((item) => (
                <li key={item.class} className="flex justify-between border-b py-1">
                  <span>{item.class}</span>
                  <span>${item.total.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded shadow p-4">
            <h2 className="text-lg font-semibold mb-2">Top Movers</h2>
            <ul className="text-sm space-y-1">
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

      <div className="text-center mt-4">
        <Link to="/portfolio" className="text-blue-500 hover:underline">
          View Full Portfolio →
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;
