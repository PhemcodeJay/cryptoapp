// src/pages/DashboardPage.tsx
import React, { useEffect, useState } from 'react';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3 from 'web3';

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

const CandlestickChart = ChartJSReact as unknown as React.FC<{
  type: 'candlestick';
  data: any;
  options: any;
}>;

const ASSETS = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'ADAUSDT'];

interface WalletSummary {
  assetClasses?: { class: string; total: number }[];
  gainers?: { symbol: string; changePercent: number }[];
  losers?: { symbol: string; changePercent: number }[];
}

const DashboardPage: React.FC = () => {
  const [account, setAccount] = useState<string>('');
  const [chain, setChain] = useState<'eth' | 'bsc'>('eth');
  const [usdtBalance, setUsdtBalance] = useState<number | null>(null);
  const [walletSummary, setWalletSummary] = useState<WalletSummary | null>(null);
  const [selectedAsset, setSelectedAsset] = useState('BTCUSDT');
  const [candlestickData, setCandlestickData] = useState<any[]>([]);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  const connectWallet = async () => {
    try {
      const walletConnectProvider = new WalletConnectProvider({
        rpc: {
          1: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
          56: 'https://bsc-dataseed.binance.org/',
        },
      });

      await walletConnectProvider.enable();
      const web3Instance = new Web3(walletConnectProvider as any);
      const accounts = await web3Instance.eth.getAccounts();
      const networkId = Number(await web3Instance.eth.net.getId());

      setAccount(accounts[0]);
      setChain(networkId === 56 ? 'bsc' : 'eth');
    } catch (err) {
      console.error('Wallet connection failed:', err);
    }
  };

  const fetchUsdtBalance = async (address: string, chain: string) => {
    try {
      const response = await fetch(`/api/wallet/usdt?address=${address}&chain=${chain}`);
      const data = await response.json();
      return data?.balance ?? null;
    } catch (err) {
      console.error('Failed to fetch USDT balance:', err);
      return null;
    }
  };

  const fetchWalletSummary = async () => {
    try {
      const response = await fetch('/api/wallet/summary');
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Failed to fetch wallet summary:', err);
      return null;
    }
  };

  const fetchCandlestickData = async (symbol: string) => {
    try {
      const response = await fetch(`/api/wallet/candlestick?symbol=${symbol}`);
      const data = await response.json();
      setCandlestickData(data);
    } catch (err) {
      console.error('Failed to fetch candlestick data:', err);
      setCandlestickData([]);
    }
  };

  const syncWallet = async () => {
    try {
      const response = await fetch('/api/wallet/sync', {
        method: 'POST',
      });
      if (response.ok) {
        setLastSynced(new Date());
      }
    } catch (err) {
      console.error('Wallet sync failed:', err);
    }
  };

  useEffect(() => {
    if (account && chain) {
      fetchUsdtBalance(account, chain).then(balance => {
        setUsdtBalance(balance);
      });
    }
  }, [account, chain]);

  useEffect(() => {
    if (account) {
      fetchWalletSummary().then(data => setWalletSummary(data));
      fetchCandlestickData(selectedAsset);

      const interval = setInterval(() => {
        syncWallet();
        fetchWalletSummary().then(data => setWalletSummary(data));
        fetchCandlestickData(selectedAsset);
      }, 15000);

      return () => clearInterval(interval);
    }
  }, [account, selectedAsset]);

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
      title: {
        display: true,
        text: `${selectedAsset} Candlestick Chart`,
        font: { size: 20, weight: 700 },
        color: '#1f2937',
      },
    },
    scales: {
      x: {
        type: 'timeseries',
        time: { unit: 'hour' },
        grid: { color: '#e5e7eb' },
      },
      y: {
        beginAtZero: false,
        grid: { color: '#e5e7eb' },
      },
    },
  };

  return (
    <main className="min-h-screen bg-white text-gray-900 p-10 max-w-7xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={connectWallet}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Connect Wallet
        </button>
      </div>

      {account && (
        <>
          <div className="mb-6">
            <p className="text-lg">
              <strong>Account:</strong> {account}
            </p>
            <p className="text-lg">
              <strong>Chain:</strong> {chain.toUpperCase()}
            </p>
            <p className="text-lg">
              <strong>USDT Balance:</strong>{' '}
              {usdtBalance !== null ? usdtBalance.toFixed(2) : 'Loading...'}
            </p>
            <p className="text-sm text-gray-500">
              Last Synced: {lastSynced ? lastSynced.toLocaleTimeString() : 'Never'}
            </p>
          </div>

          <div className="mb-6">
            <label htmlFor="asset-select" className="mr-2 font-semibold">
              Select Asset:
            </label>
            <select
              id="asset-select"
              value={selectedAsset}
              onChange={e => setSelectedAsset(e.target.value)}
              className="border border-gray-300 rounded p-2"
            >
              {ASSETS.map(asset => (
                <option key={asset} value={asset}>
                  {asset}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-8">
            <CandlestickChart type="candlestick" data={chartData} options={chartOptions} />
          </div>

          {walletSummary && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h2 className="text-xl font-bold mb-2">Asset Classes</h2>
                <ul>
                  {walletSummary.assetClasses?.map((cls, i) => (
                    <li key={i}>
                      {cls.class}: {cls.total}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">Top Gainers</h2>
                <ul>
                  {walletSummary.gainers?.map((g, i) => (
                    <li key={i}>
                      {g.symbol}: {g.changePercent}%
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">Top Losers</h2>
                <ul>
                  {walletSummary.losers?.map((l, i) => (
                    <li key={i}>
                      {l.symbol}: {l.changePercent}%
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default DashboardPage;
