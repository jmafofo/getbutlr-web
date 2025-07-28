import { InsightData } from "@/src/types/insights";

export async function generateInsights(query: string, tone: string): Promise<InsightData> {
  const res = await fetch("/api/insights_ollama", {
    method: "POST",
    body: JSON.stringify({ query, tone }),
  });
  return await res.json();
}