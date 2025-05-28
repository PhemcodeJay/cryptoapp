import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  CandlestickController,
  BarElement,
  Title,
  ChartOptions,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

// Register necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  CandlestickController,
  BarElement, // Needed for candlestick to render bars properly
  Title
);

// Define your timeframes
const timeframes = [
  { label: '4H', value: 0.5 },
  { label: '1D', value: 1 },
  { label: '1W', value: 7 }
];

// Define tokens
const tokens = [
  { id: 'bitcoin', symbol: 'BTC' },
  { id: 'ethereum', symbol: 'ETH' },
  { id: 'solana', symbol: 'SOL' }
];

const AssetAnalysisPage: React.FC = () => {
  const [priceData, setPriceData] = useState<Record<string, any[]>>({});
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframes[1]);
  const [loading, setLoading] = useState(false);

  const fetchTokenData = async () => {
    setLoading(true);
    const updatedData: Record<string, any[]> = {};
    await Promise.all(
      tokens.map(async (token) => {
        try {
          const res = await axios.get(
            `https://api.coingecko.com/api/v3/coins/${token.id}/ohlc`,
            {
              params: {
                vs_currency: 'usd',
                days: selectedTimeframe.value
              }
            }
          );
          // Format data for candlestick chart
          const formatted = res.data.map((d: any) => ({
            x: new Date(d[0]),
            o: d[1],
            h: d[2],
            l: d[3],
            c: d[4]
          }));
          updatedData[token.symbol] = formatted;
        } catch (e) {
          console.error(`Error fetching data for ${token.symbol}:`, e);
          updatedData[token.symbol] = []; // Fallback empty array
        }
      })
    );
    setPriceData(updatedData);
    setLoading(false);
  };

  useEffect(() => {
    fetchTokenData();
  }, [selectedTimeframe]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">📈 Multi-Token Asset Analysis</h1>

        <div className="flex justify-center gap-4 mb-6">
          {timeframes.map((tf) => (
            <button
              key={tf.label}
              onClick={() => setSelectedTimeframe(tf)}
              className={`px-5 py-2 rounded-xl font-semibold transition ${
                selectedTimeframe.label === tf.label
                  ? 'bg-blue-600'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>

        {loading && <p className="text-center text-yellow-400">Loading data...</p>}

        {!loading &&
          tokens.map((token) => (
            <div
              key={token.symbol}
              className="bg-white/5 p-6 rounded-2xl shadow-xl mb-10"
            >
              <h2 className="text-xl font-semibold mb-4">{token.symbol}/USD</h2>
              <Chart
                type="candlestick"
                data={{
                  datasets: [
                    {
                      label: `${token.symbol} Price`,
                      data: priceData[token.symbol] || [],
                      borderColor: 'lime',
                      color: {
                        up: '#16a34a',
                        down: '#dc2626',
                        unchanged: '#facc15'
                      }
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  scales: {
                    x: {
                      type: 'time',
                      time: {
                        tooltipFormat: 'MMM dd, HH:mm'
                      },
                      ticks: { color: 'white' }
                    },
                    y: {
                      ticks: { color: 'white' }
                    }
                  },
                  plugins: {
                    legend: { labels: { color: 'white' } }
                  }
                }}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default AssetAnalysisPage;
