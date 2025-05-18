
// ChartComponent.js

import React from 'react';
import { Chart, registerables } from 'chart.js';
import { Chart as ReactChart } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { FinancialController, CandlestickController, CandlestickElement } from 'chartjs-chart-financial';

Chart.register(...registerables, FinancialController, CandlestickController, CandlestickElement);

export default function ChartComponent({ data }) {
    const chartData = {
        datasets: [
            {
                label: 'Candlestick',
                data: data.candles,
                type: 'candlestick',
                borderColor: '#000',
            },
            {
                label: 'MA 20',
                data: data.ma20,
                type: 'line',
                borderColor: 'blue',
                borderWidth: 1,
                pointRadius: 0,
            },
            {
                label: 'MA 200',
                data: data.ma200,
                type: 'line',
                borderColor: 'red',
                borderWidth: 1,
                pointRadius: 0,
            }
        ]
    };

    return <ReactChart type="candlestick" data={chartData} />;
}
