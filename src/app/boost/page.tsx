'use client';

import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { classifyViewerEngagement, AudienceTier } from '@/src/lib/boostHelper';

type ViewerData = {
  userId: string;
  videoId: string;
  watchDurationRatio: number;
};

export default function BoostDashboard() {
  const [viewers, setViewers] = useState<ViewerData[]>([]);
  const [tierCounts, setTierCounts] = useState<Record<AudienceTier, number>>({
    [AudienceTier.TIER_1]: 0,
    [AudienceTier.TIER_2]: 0,
    [AudienceTier.TIER_3]: 0,
  });

  useEffect(() => {
    const fetchViewers = async () => {
      // Simulated mock data
      const mock: ViewerData[] = [
        { userId: 'a1', videoId: 'v101', watchDurationRatio: 0.61 },
        { userId: 'b2', videoId: 'v102', watchDurationRatio: 0.45 },
        { userId: 'c3', videoId: 'v103', watchDurationRatio: 0.25 },
        { userId: 'd4', videoId: 'v104', watchDurationRatio: 0.72 },
      ];
      setViewers(mock);

      const summary = {
        [AudienceTier.TIER_1]: 0,
        [AudienceTier.TIER_2]: 0,
        [AudienceTier.TIER_3]: 0,
      };

      for (const v of mock) {
        const tier = classifyViewerEngagement(v);
        summary[tier]++;
      }

      setTierCounts(summary);
    };

    fetchViewers();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
      <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="col-6-m space-y-4"
        >
        <div className="bg-slate-800 rounded-2xl shadow-md p-6">
            <h1 className="text-3xl font-bold mb-4">📈 Butlr Boost – Targeting Dashboard</h1>
            <p className="mb-4">Classified audience based on average watch duration from video analytics.</p>

            <ul className="space-y-2">
                <li className="bg-green-100 p-4 rounded text-black">🎯 {AudienceTier.TIER_1}: {tierCounts[AudienceTier.TIER_1]} viewers</li>
                <li className="bg-yellow-100 p-4 rounded text-black">🔥 {AudienceTier.TIER_2}: {tierCounts[AudienceTier.TIER_2]} viewers</li>
                <li className="bg-red-100 p-4 rounded text-black">👀 {AudienceTier.TIER_3}: {tierCounts[AudienceTier.TIER_3]} viewers</li>
            </ul>

            <div className="mt-8">
                <p className="text-sm text-gray-500">This data is simulated. In production, this will connect to YouTube Analytics API.</p>
            </div>
        </div>
      </motion.div>
    </div>
  );
}
