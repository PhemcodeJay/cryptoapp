import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
} from 'chart.js';
import { FinancialChart } from 'chartjs-chart-financial';
import { Chart } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, TimeScale, Tooltip, FinancialChart);

export default function CandlestickChart({ candles }) {
  const data = {
    datasets: [{
      label: 'Price',
      data: candles,
      type: 'candlestick',
    }]
  };

  return <Chart type='candlestick' data={data} />;
}
