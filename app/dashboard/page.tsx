import Sidebar from '@/components/Sidebar';
import ChartCard from '@/components/ChartCard';
import ChatPanel from '@/components/ChatPanel';

export default function DashboardPage() {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main">
        <div className="card-row">
          <ChartCard title="Weekly Report" />
          <ChartCard title="YouTube Views" />
        </div>
        <div className="dashboard-chart">
          <ChartCard title="Performance Overview" />
        </div>
      </main>
      <ChatPanel />
    </div>
  );
}

