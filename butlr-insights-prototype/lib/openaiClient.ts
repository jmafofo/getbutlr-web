export async function generateInsights(query: string, tone: string) {
  const r = await fetch("/api/insights", {
    method: "POST", body: JSON.stringify({ query, tone })
  });
  return r.json();
}


