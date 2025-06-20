'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

type VideoAnalysis = {
  title: string;
  score: number;
  timestamp: string;
};

type Props = {
  data: VideoAnalysis[];
};

export default function VideoChartCard({ data }: Props) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">AI Score Over Time</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" tickFormatter={(t) => t.split('T')[0]} />
          <YAxis domain={[0, 10]} />
          <Tooltip />
          <Line type="monotone" dataKey="score" stroke="#0070f3" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

