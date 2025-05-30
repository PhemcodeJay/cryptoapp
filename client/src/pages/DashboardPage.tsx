import React, { useEffect, useState } from 'react';
import { EthereumProvider } from '@walletconnect/ethereum-provider';
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
      const provider = await EthereumProvider.init({
        projectId: 'YOUR_PROJECT_ID',
        chains: [1, 56],
        methods: ['eth_sendTransaction', 'personal_sign', 'eth_signTypedData'],
        rpcMap: {
          1: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
          56: 'https://bsc-dataseed.binance.org/',
        },
        showQrModal: true,
      });

      await provider.enable();
      const web3 = new Web3(provider as any);
      const accounts = await web3.eth.getAccounts();
      const networkId = Number(await web3.eth.net.getId());

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
        font: { size: 20, weight: 'bold' },
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
    <main className="min-h-screen bg-gray-100 text-gray-900 py-10 px-4 sm:px-10 max-w-7xl mx-auto">
      {!account ? (
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <h1 className="text-4xl font-bold mb-4">Welcome to Your Crypto Dashboard</h1>
          <p className="text-lg mb-6 text-gray-600">Connect your wallet to get started</p>
          <button
            onClick={connectWallet}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-lg shadow-md"
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
              <p className="text-sm text-gray-500">
                Last Synced: {lastSynced ? lastSynced.toLocaleTimeString() : 'Never'}
              </p>
            </div>
            <button
              onClick={connectWallet}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow"
            >
              Reconnect Wallet
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-5">
              <p className="text-sm text-gray-500 mb-1">Account</p>
              <p className="font-mono break-all">{account}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-5">
              <p className="text-sm text-gray-500 mb-1">Chain</p>
              <p className="font-semibold uppercase">{chain}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-5">
              <p className="text-sm text-gray-500 mb-1">USDT Balance</p>
              <p className="font-semibold">
                {usdtBalance !== null ? `$${usdtBalance.toFixed(2)}` : 'Loading...'}
              </p>
            </div>
          </div>

          <div className="mb-6 flex items-center gap-4">
            <label htmlFor="asset-select" className="font-medium">
              Select Asset:
            </label>
            <select
              id="asset-select"
              value={selectedAsset}
              onChange={e => setSelectedAsset(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 bg-white"
            >
              {ASSETS.map(asset => (
                <option key={asset} value={asset}>
                  {asset}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-xl shadow p-6 mb-10">
            <CandlestickChart type="candlestick" data={chartData} options={chartOptions} />
          </div>

          {walletSummary && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow p-5">
                <h2 className="text-lg font-bold mb-2">Asset Classes</h2>
                <ul className="text-sm space-y-1">
                  {walletSummary.assetClasses?.map((cls, i) => (
                    <li key={i} className="flex justify-between">
                      <span>{cls.class}</span>
                      <span>{cls.total}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-xl shadow p-5">
                <h2 className="text-lg font-bold mb-2">Top Gainers</h2>
                <ul className="text-sm space-y-1">
                  {walletSummary.gainers?.map((g, i) => (
                    <li key={i} className="flex justify-between text-green-600">
                      <span>{g.symbol}</span>
                      <span>{g.changePercent}%</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-xl shadow p-5">
                <h2 className="text-lg font-bold mb-2">Top Losers</h2>
                <ul className="text-sm space-y-1">
                  {walletSummary.losers?.map((l, i) => (
                    <li key={i} className="flex justify-between text-red-500">
                      <span>{l.symbol}</span>
                      <span>{l.changePercent}%</span>
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
