"use client";

import { useState } from "react";

export default function MonetizationCoachPage() {
  const [channelDetails, setChannelDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const handleAnalyze = async () => {
    setLoading(true);
    setResponse("");
    const res = await fetch("/api/monetization-coach", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ channelDetails }),
    });
    const data = await res.json();
    setResponse(data.result);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
        <Sparkles className="text-yellow-500" /> Monetization Coach
      </h1>
      <p className="mb-4 text-muted-foreground">
        Get tailored monetization strategies for your YouTube channel.
      </p>

      <div className="mb-4">
        <Label htmlFor="channelDetails">Describe your channel</Label>
        <Textarea
          id="channelDetails"
          placeholder="Tell us about your niche, subscribers, average views, content type..."
          value={channelDetails}
          onChange={(e) => setChannelDetails(e.target.value)}
          rows={5}
        />
      </div>

      <Button onClick={handleAnalyze} disabled={loading}>
        {loading ? "Analyzing..." : "Generate Strategy"}
      </Button>

      {response && (
        <div className="mt-6 p-4 border rounded-md bg-muted">
          <h2 className="font-semibold mb-2">Monetization Strategy:</h2>
          <p className="whitespace-pre-line">{response}</p>
        </div>
      )} */}
    </div>
  );
}