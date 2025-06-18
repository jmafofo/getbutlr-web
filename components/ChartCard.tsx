'use client';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function ChartCard({ title }) {
  const data = {
    labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    datasets: [
      {
        label: title,
        data: [12, 19, 3, 5, 2, 3, 7],
        backgroundColor: '#4F46E5'
      }
    ]
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
      legend: { display: false }
    }
  };

  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="chart-placeholder">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}

