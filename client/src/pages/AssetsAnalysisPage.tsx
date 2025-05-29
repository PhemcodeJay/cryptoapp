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

type APIResponse = {
  candles: Candle[];
  signals: Signal[];
};

const AssetsAnalysisPage: React.FC = () => {
  const [symbol, setSymbol] = useState<string>('BTCUSDT');
  const [candles, setCandles] = useState<Candle[]>([]);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChartData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/trade/candlestick?symbol=${symbol}`);
      if (!res.ok) throw new Error(`Fetch error: ${res.statusText}`);

      const data: APIResponse = await res.json();

      const formattedCandles = data.candles.map((c) => ({
        ...c,
        x: typeof c.x === 'number' ? c.x : new Date(c.x).getTime(),
      }));

      setCandles(formattedCandles);
      setSignals(data.signals);
    } catch (e: any) {
      setError(e.message || 'Unknown error');
      setCandles([]);
      setSignals([]);
    } finally {
      setLoading(false);
    }
  }, [symbol]);

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
      ...signals.map((s) => ({
        type: 'scatter' as const,
        label: `${s.type.toUpperCase()} Signal`,
        data: [{ x: s.time, y: s.price }],
        backgroundColor: s.type === 'buy' ? 'green' : 'red',
        pointRadius: 6,
        pointStyle: s.type === 'buy' ? 'triangle' : 'rectRot',
      })),
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
        time: { unit: 'minute' },
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

