
"use client";

import { useState } from "react";
import ToolHeader from "@/components/ToolHeader";
import "@/styles/tool.css";

export default function GrowthPlannerPage() {
  const [goals, setGoals] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    const response = await fetch("/api/growth-planner", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goals }),
    });

    const data = await response.json();
    setPlan(data.plan);
    setLoading(false);
  }

  return (
    <div className="tool-page">
      <ToolHeader
        title="Weekly Growth Planner"
        icon="📈"
        description="Generate a focused weekly growth plan tailored to your content goals."
      />

      <textarea
        className="tool-textarea"
        placeholder="What are your goals for this week?"
        value={goals}
        onChange={(e) => setGoals(e.target.value)}
      />

      <button className="tool-button" onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate Plan"}
      </button>

      {plan && (
        <div className="tool-output">
          <h3>Weekly Plan:</h3>
          <pre>{plan}</pre>
        </div>
      )}
    </div>
  );
}
