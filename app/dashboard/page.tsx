import ChartCard from '@/components/ChartCard';
import ChatPanel from '@/components/ChatPanel';

export default function DashboardPage() {
  return (
    <div className='p-5'>
        {/* Top Row of Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800 rounded-2xl shadow-md p-4">
            <ChartCard title="Weekly Report" />
          </div>
          <div className="bg-slate-800 rounded-2xl shadow-md p-4">
            <ChartCard title="YouTube Views" />
          </div>
        </div>

        {/* Bottom Full-Width Chart */}
        <div className="bg-slate-800 rounded-2xl shadow-md p-4 mt-5">
          <ChartCard title="Performance Overview" />
        </div>
    </div>
  );
}
