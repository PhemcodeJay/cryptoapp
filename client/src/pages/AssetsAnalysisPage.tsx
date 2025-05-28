import React, { useEffect, useState } from 'react';
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

type Signal = {
  type: 'buy' | 'sell';
  time: number; // timestamp in ms
  price: number;
};

type Candle = {
  x: number; // timestamp in ms
  o: number;
  h: number;
  l: number;
  c: number;
};

const AssetsAnalysisPage: React.FC = () => {
  const [symbol, setSymbol] = useState<string>('BTCUSDT');
  const [candles, setCandles] = useState<Candle[]>([]);
  const [signals, setSignals] = useState<Signal[]>([]);

  const fetchChartData = async () => {
    try {
      const res = await fetch(`/api/trade/candlestick?symbol=${symbol}`);
      const data = await res.json();
      // Ensure all x values are numbers (timestamps)
      setCandles(
        data.candles.map((c: any) => ({
          ...c,
          x: typeof c.x === 'number' ? c.x : new Date(c.x).getTime(),
        }))
      );
      setSignals(data.signals);
    } catch (err) {
      console.error('Failed to fetch chart data:', err);
    }
  };

  useEffect(() => {
    fetchChartData();
    const interval = setInterval(fetchChartData, 15000);
    return () => clearInterval(interval);
  }, [symbol]);

  const chartData: ChartData<'candlestick' | 'scatter'> = {
    datasets: [
      {
        label: symbol,
        data: candles,
        type: 'candlestick',
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
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">🧠 Asset Analysis</h1>
        <select
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="border px-4 py-2 rounded"
        >
          <option value="BTCUSDT">BTC/USDT</option>
          <option value="ETHUSDT">ETH/USDT</option>
          <option value="SOLUSDT">SOL/USDT</option>
        </select>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <Chart type="candlestick" data={chartData} options={options} />
      </div>
    </div>
  );
};

export default AssetsAnalysisPage;
