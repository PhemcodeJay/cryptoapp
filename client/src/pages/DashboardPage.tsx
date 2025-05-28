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

// Register Chart.js components including financial chart elements
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

// Type definitions for wallet summary
interface AssetClass {
  class: string;
  total: number;
}

interface GainerLoser {
  symbol: string;
  changePercent: number;
}

interface WalletSummary {
  assetClasses: AssetClass[];
  gainers?: GainerLoser[];
  losers?: GainerLoser[];
}

const DashboardPage: React.FC = () => {
  const [walletSummary, setWalletSummary] = useState<WalletSummary | null>(null);
  const [candlestickData, setCandlestickData] = useState<any[]>([]);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [loadingSync, setLoadingSync] = useState(false);

  // Sync wallet endpoint trigger
  const syncWallet = async () => {
    try {
      setLoadingSync(true);
      const res = await fetch('/api/wallet/sync', { method: 'POST' });
      if (res.ok) {
        setLastSynced(new Date());
        // Optionally refresh summary & chart after sync
        await Promise.all([fetchSummary(), fetchChartData()]);
      } else {
        console.error('Sync failed with status:', res.status);
      }
    } catch (err) {
      console.error('Wallet sync failed', err);
    } finally {
      setLoadingSync(false);
    }
  };

  // Fetch wallet summary data
  const fetchSummary = async () => {
    try {
      const res = await fetch('/api/wallet/summary');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setWalletSummary(data);
    } catch (err) {
      console.error('Failed to fetch wallet summary', err);
      setWalletSummary(null);
    }
  };

  // Fetch candlestick chart data
  const fetchChartData = async () => {
    try {
      const res = await fetch('/api/wallet/candlestick');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setCandlestickData(data);
    } catch (err) {
      console.error('Failed to load candlestick chart', err);
      setCandlestickData([]);
    }
  };

  // Initial data load + periodic refresh
  useEffect(() => {
    fetchSummary();
    fetchChartData();

    const interval = setInterval(() => {
      syncWallet();
    }, 30000); // every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const breakdownByAssetClass = walletSummary?.assetClasses || [];

  // Chart.js dataset config for candlestick
  const chartData = {
    datasets: [
      {
        label: 'Price',
        data: candlestickData,
        type: 'candlestick' as const,
        borderColor: '#4e73df',
        borderWidth: 1,
        color: {
          up: '#16a34a',
          down: '#dc2626',
          unchanged: '#facc15',
        },
      },
    ],
  };

  // Chart.js options config
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
      title: {
        display: true,
        text: 'Wallet Candlestick Chart',
        color: '#333',
      },
    },
    scales: {
      x: {
        type: 'time' as const,
        time: { unit: 'day' },
        ticks: { source: 'auto', color: '#333' },
        grid: { color: '#eee' },
      },
      y: {
        beginAtZero: false,
        ticks: { color: '#333' },
        grid: { color: '#eee' },
      },
    },
  };

  return (
    <div className="p-4 space-y-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Dashboard</h1>

      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-600">
          Last synced: {lastSynced ? lastSynced.toLocaleTimeString() : 'Never'}
        </p>
        <button
          className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition ${
            loadingSync ? 'opacity-60 cursor-not-allowed' : ''
          }`}
          onClick={syncWallet}
          disabled={loadingSync}
          aria-busy={loadingSync}
        >
          {loadingSync ? 'Syncing...' : 'Sync Wallet'}
        </button>
      </div>

      {walletSummary ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white p-6 rounded shadow">
            <h2 className="font-semibold text-xl mb-4">Balance Breakdown</h2>
            {breakdownByAssetClass.length ? (
              <ul className="space-y-2">
                {breakdownByAssetClass.map((item) => (
                  <li key={item.class} className="flex justify-between">
                    <span>{item.class}</span>
                    <span>${item.total.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No asset class data available.</p>
            )}
          </section>

          <section className="bg-white p-6 rounded shadow">
            <h2 className="font-semibold text-xl mb-4">Top Gainers / Losers</h2>
            <div className="text-sm space-y-1">
              {walletSummary.gainers && walletSummary.gainers.length > 0 ? (
                walletSummary.gainers.map((a) => (
                  <p key={`gainer-${a.symbol}`} className="text-green-600">
                    +{a.symbol}: {a.changePercent.toFixed(2)}%
                  </p>
                ))
              ) : (
                <p>No gainers data available.</p>
              )}
              {walletSummary.losers && walletSummary.losers.length > 0 ? (
                walletSummary.losers.map((a) => (
                  <p key={`loser-${a.symbol}`} className="text-red-600">
                    -{a.symbol}: {a.changePercent.toFixed(2)}%
                  </p>
                ))
              ) : (
                <p>No losers data available.</p>
              )}
            </div>
          </section>
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading wallet summary...</p>
      )}

      <section className="bg-white p-6 rounded shadow mt-6">
        <h2 className="font-semibold text-xl mb-4">Candlestick Chart</h2>
        {candlestickData.length > 0 ? (
          <Chart type="candlestick" data={chartData} options={chartOptions} />
        ) : (
          <p className="text-center text-gray-500">Loading candlestick data...</p>
        )}
      </section>

      <div className="mt-8 text-center">
        <Link
          to="/portfolio"
          className="text-blue-600 hover:underline font-semibold"
          aria-label="View Full Portfolio"
        >
          View Full Portfolio
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;
