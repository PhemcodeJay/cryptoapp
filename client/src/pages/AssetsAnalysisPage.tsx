import React, { useEffect, useState, useCallback } from 'react';
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js';
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
import { Chart } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  CandlestickController,
  CandlestickElement
);

type Candle = {
  x: number;
  o: number;
  h: number;
  l: number;
  c: number;
};

type APIResponse = Record<'4h' | '1d' | '1w', Candle[]>;

const intervalMap: Record<'hourly' | 'daily' | 'weekly', '4h' | '1d' | '1w'> = {
  hourly: '4h',
  daily: '1d',
  weekly: '1w',
};

const ASSETS = [
  { value: 'BTCUSDT', label: 'Bitcoin / USDT' },
  { value: 'ETHUSDT', label: 'Ethereum / USDT' },
  { value: 'SOLUSDT', label: 'Solana / USDT' },
];

const AssetsAnalysisPage: React.FC = () => {
  const [symbol, setSymbol] = useState<string>('BTCUSDT');
  const [interval, setIntervalValue] = useState<'hourly' | 'daily' | 'weekly'>('hourly');
  const [candles, setCandles] = useState<Candle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChartData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const apiInterval = intervalMap[interval];
      const res = await fetch(`/api/bot/analyze?symbol=${symbol}`);
      if (!res.ok) throw new Error(`Fetch error: ${res.statusText}`);
      const data: APIResponse = await res.json();
      const rawCandles = data[apiInterval] || [];

      const formattedCandles = rawCandles.map((c: any) => ({
        x: c.openTime,
        o: c.open,
        h: c.high,
        l: c.low,
        c: c.close,
      }));

      setCandles(formattedCandles);
    } catch (e: any) {
      setError(e.message || 'Unknown error');
      setCandles([]);
    } finally {
      setLoading(false);
    }
  }, [symbol, interval]);

  useEffect(() => {
    fetchChartData();
    const intervalId = setInterval(fetchChartData, 15000);
    return () => clearInterval(intervalId);
  }, [fetchChartData]);

  const chartData: ChartData<'candlestick'> = {
    datasets: [
      {
        label: symbol,
        type: 'candlestick',
        data: candles,
        borderColor: '#4e73df',
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'candlestick'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: { color: '#4B5563', font: { weight: 600 } },
      },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        type: 'timeseries',
        time: {
          unit: interval === 'hourly' ? 'hour' : interval === 'daily' ? 'day' : 'week',
        },
        ticks: {
          color: '#6B7280',
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 10,
        },
        grid: {
          color: '#E5E7EB',
        },
      },
      y: {
        beginAtZero: false,
        ticks: {
          color: '#6B7280',
        },
        grid: {
          color: '#E5E7EB',
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-6 sm:px-12">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-3 select-none">📊 Asset Analysis</h1>
      <p className="max-w-3xl text-center text-gray-600 text-lg mb-10">
        Explore market signals and candlestick patterns for popular crypto assets. Chart updates every 15 seconds.
      </p>

      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-xl p-8">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
          {/* Symbol Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <label
              htmlFor="symbol"
              className="text-lg font-semibold text-gray-700 select-none"
            >
              Select Asset:
            </label>
            <select
              id="symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {ASSETS.map((asset) => (
                <option key={asset.value} value={asset.value}>
                  {asset.label}
                </option>
              ))}
            </select>
          </div>

          {/* Interval Buttons */}
          <div className="flex space-x-4">
            {(['hourly', 'daily', 'weekly'] as const).map((intv) => (
              <button
                key={intv}
                onClick={() => setIntervalValue(intv)}
                className={`px-5 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                  interval === intv
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-pressed={interval === intv}
              >
                {intv.charAt(0).toUpperCase() + intv.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Container */}
        <div className="relative w-full min-h-[400px] flex justify-center items-center border border-gray-200 rounded-lg bg-white shadow-inner">
          {loading ? (
            <p className="text-gray-500 text-lg select-none">Loading chart data...</p>
          ) : error ? (
            <p className="text-red-600 font-semibold select-none">Error: {error}</p>
          ) : candles.length > 0 ? (
            <Chart type="candlestick" data={chartData} options={options} />
          ) : (
            <p className="text-gray-400 select-none">No chart data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetsAnalysisPage;
