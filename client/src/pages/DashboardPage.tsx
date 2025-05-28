import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, TimeScale, Tooltip, Legend, Title } from 'chart.js';
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
import { Chart } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

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

const DashboardPage: React.FC = () => {
  const [walletSummary, setWalletSummary] = useState<any>(null);
  const [candlestickData, setCandlestickData] = useState<any[]>([]);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  const syncWallet = async () => {
    try {
      const res = await fetch('/api/wallet/sync', { method: 'POST' });
      if (res.ok) {
        setLastSynced(new Date());
      }
    } catch (err) {
      console.error('Wallet sync failed', err);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await fetch('/api/wallet/summary');
      const data = await res.json();
      setWalletSummary(data);
    } catch (err) {
      console.error('Failed to fetch wallet summary', err);
    }
  };

  const fetchChartData = async () => {
    try {
      const res = await fetch('/api/wallet/candlestick');
      const data = await res.json();
      setCandlestickData(data);
    } catch (err) {
      console.error('Failed to load candlestick chart', err);
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchChartData();
    const interval = setInterval(() => {
      syncWallet();
      fetchSummary();
    }, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const breakdownByAssetClass = walletSummary?.assetClasses || [];

  const chartData = {
    datasets: [
      {
        label: 'Price',
        data: candlestickData,
        type: 'candlestick',
        borderColor: '#4e73df',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        type: 'time',
        time: { unit: 'day' },
        ticks: { source: 'auto' },
      },
      y: {
        beginAtZero: false
      }
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Last synced: {lastSynced ? lastSynced.toLocaleTimeString() : 'Never'}
        </p>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={syncWallet}
        >
          Sync Wallet
        </button>
      </div>

      {walletSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold text-lg">Balance Breakdown</h2>
            <ul className="mt-2 space-y-1">
              {breakdownByAssetClass.map((item: any) => (
                <li key={item.class} className="flex justify-between">
                  <span>{item.class}</span>
                  <span>${item.total.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold text-lg">Top Gainers / Losers</h2>
            <ul className="mt-2 text-sm">
              {walletSummary.gainers?.map((a: any) => (
                <li key={a.symbol} className="text-green-600">
                  +{a.symbol}: {a.changePercent}%
                </li>
              ))}
              {walletSummary.losers?.map((a: any) => (
                <li key={a.symbol} className="text-red-600">
                  -{a.symbol}: {a.changePercent}%
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold text-lg mb-2">Candlestick Chart</h2>
        <Chart type="candlestick" data={chartData} options={chartOptions} />
      </div>

      <div className="mt-6 text-center">
        <Link to="/portfolio" className="text-blue-500 hover:underline">
          View Full Portfolio
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;