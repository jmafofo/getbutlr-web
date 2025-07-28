'use client';

import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function ChartCard({
  title,
  labels = [],
  dataValues = [],
}: {
  title: string;
  labels: string[];
  dataValues: number[];
}) {
  const data = {
    labels,
    datasets: [
      {
        label: title,
        data: dataValues,
        backgroundColor: '#4F46E5',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        backgroundColor: '#292930',
        titleColor: '#fff',
        bodyColor: '#fff',
      },
      legend: { display: false },
    },
  };

  return (
    <div className="card">
      <h3 className="text-white text-lg mb-3">{title}</h3>
      <div className="chart-placeholder h-64">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
