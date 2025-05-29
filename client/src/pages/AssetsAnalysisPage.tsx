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

// === Types ===
type Signal = {
  type: 'buy' | 'sell';
  time: number;
  price: number;
};

type Candle = {
  x: number;
  o: number;
  h: number;
  l: number;
  c: number;
};

type APIResponse = Record<'4h' | '1d' | '1w', Candle[]>; // matches backend response structure

const intervalMap: Record<'hourly' | 'daily' | 'weekly', '4h' | '1d' | '1w'> = {
  hourly: '4h',
  daily: '1d',
  weekly: '1w',
};

const AssetsAnalysisPage: React.FC = () => {
  const [symbol, setSymbol] = useState<string>('BTCUSDT');
  const [interval, setIntervalValue] = useState<'hourly' | 'daily' | 'weekly'>('hourly');
  const [candles, setCandles] = useState<Candle[]>([]);
  const [signals, setSignals] = useState<Signal[]>([]); // no signals from backend currently
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChartData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const apiInterval = intervalMap[interval];
      const res = await fetch(`/api/bot/analyze?symbol=${symbol}`); // adjust API path as per your backend
      if (!res.ok) throw new Error(`Fetch error: ${res.statusText}`);

      const data: APIResponse = await res.json();

      const rawCandles = data[apiInterval] || [];

      // Convert backend candle structure to chart candles (x,o,h,l,c)
      // Your backend candles have: openTime, open, high, low, close, etc.
      // We need to map accordingly
      const formattedCandles = rawCandles.map((c: any) => ({
        x: c.openTime,
        o: c.open,
        h: c.high,
        l: c.low,
        c: c.close,
      }));

      setCandles(formattedCandles);
      setSignals([]); // No signals currently from backend
    } catch (e: any) {
      setError(e.message || 'Unknown error');
      setCandles([]);
      setSignals([]);
    } finally {
      setLoading(false);
    }
  }, [symbol, interval]);

  useEffect(() => {
    fetchChartData();
    const intervalId = setInterval(fetchChartData, 15000);
    return () => clearInterval(intervalId);
  }, [fetchChartData]);

  const chartData: ChartData<'candlestick' | 'scatter'> = {
    datasets: [
      {
        label: symbol,
        type: 'candlestick',
        data: candles,
        borderColor: '#4e73df',
        borderWidth: 1,
      },
      // No signals yet
    ],
  };

  const options: ChartOptions<'candlestick' | 'scatter'> = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        type: 'timeseries',
        time: {
          // Adjust time unit based on interval
          unit: interval === 'hourly' ? 'hour' : interval === 'daily' ? 'day' : 'week',
        },
        ticks: { source: 'auto' },
      },
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-tr from-indigo-800 via-purple-700 to-pink-600 text-white px-6 py-10">
      <h1 className="text-4xl font-extrabold mb-4">📊 Asset Analysis</h1>
      <p className="text-lg text-center max-w-xl mb-8 opacity-90">
        Explore market signals and candlestick patterns for popular crypto assets.
      </p>

      <div className="bg-white text-black w-full max-w-6xl p-6 rounded-xl shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <label htmlFor="symbol" className="text-xl font-bold">Symbol:</label>
          <select
            id="symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="BTCUSDT">BTC/USDT</option>
            <option value="ETHUSDT">ETH/USDT</option>
            <option value="SOLUSDT">SOL/USDT</option>
          </select>
        </div>

        <div className="flex justify-center gap-4 mt-2">
          {(['hourly', 'daily', 'weekly'] as const).map((i) => (
            <button
              key={i}
              className={`px-4 py-2 rounded-lg font-semibold border-2 ${
                interval === i
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-black border-gray-300 hover:bg-gray-100'
              }`}
              onClick={() => setIntervalValue(i)}
            >
              {i.charAt(0).toUpperCase() + i.slice(1)}
            </button>
          ))}
        </div>

        <div className="w-full overflow-x-auto min-h-[300px] flex justify-center items-center">
          {loading ? (
            <p>Loading chart data...</p>
          ) : error ? (
            <p className="text-red-600">Error: {error}</p>
          ) : candles.length > 0 ? (
            <Chart type="candlestick" data={chartData} options={options} />
          ) : (
            <p>No chart data available.</p>
          )}
        </div>
      </div>

      <p className="mt-10 text-sm text-white text-opacity-80">
        This chart updates every 15 seconds with fresh data.
      </p>
    </div>
  );
};

export default AssetsAnalysisPage;
