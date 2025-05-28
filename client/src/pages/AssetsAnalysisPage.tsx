import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, TimeScale, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';
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

const AssetsAnalysisPage: React.FC = () => {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [candles, setCandles] = useState<any[]>([]);
  const [signals, setSignals] = useState<any[]>([]);

  const fetchChartData = async () => {
    try {
      const res = await fetch(`/api/trade/candlestick?symbol=${symbol}`);
      const data = await res.json();
      setCandles(data.candles);
      setSignals(data.signals); // { type: 'buy'|'sell', time: timestamp, price: number }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchChartData();
    const interval = setInterval(fetchChartData, 15000);
    return () => clearInterval(interval);
  }, [symbol]);

  const chartData = {
    datasets: [
      {
        label: symbol,
        data: candles,
        type: 'candlestick',
        borderColor: '#4e73df',
        borderWidth: 1
      },
      ...signals.map((s: any) => ({
        type: 'scatter',
        label: `${s.type.toUpperCase()} Signal`,
        data: [{ x: s.time, y: s.price }],
        backgroundColor: s.type === 'buy' ? 'green' : 'red',
        pointRadius: 6,
        pointStyle: s.type === 'buy' ? 'triangle' : 'rectRot'
      }))
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true }
    },
    scales: {
      x: {
        type: 'time',
        time: { unit: 'minute' },
        ticks: { source: 'auto' }
      },
      y: {
        beginAtZero: false
      }
    }
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
