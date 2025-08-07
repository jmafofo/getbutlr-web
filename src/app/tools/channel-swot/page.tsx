"use client";

import { useState } from "react";

export default function ChannelSWOTPage() {
  const [swot, setSwot] = useState({
    strengths: ["High CTR on thumbnails", "Engaging intros"],
    weaknesses: ["Low average view duration", "Inconsistent posting"],
    opportunities: ["Trending in Shorts", "High search for tutorial topics"],
    threats: ["Competitor uploading daily", "Viewer fatigue"]
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Channel SWOT Analyzer</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(swot).map(([key, value]) => (
          <div key={key}>
            <div>
              <h2 className="text-xl font-semibold capitalize">{key}</h2>
              <ul className="list-disc pl-6 mt-2">
                {value.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
