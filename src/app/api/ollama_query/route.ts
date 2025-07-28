import { NextRequest, NextResponse } from "next/server";

export async function callOllama(query: string) {
  const ollamaRes = await fetch(`${process.env.OLLAMA_SERVER_URL}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gemma3:27b",
      prompt: query,
      stream: false,
    }),
  });

  const data = await ollamaRes.json();

  if (!ollamaRes.ok) {
    console.error("Ollama Error:", data);
    throw new Error(data.error || "Ollama API error");
  }

  return data.response ?? "No response generated.";
}

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    const insight = await callOllama(query);

    return NextResponse.json({ insight });
  } catch (err: any) {
    console.error("Internal Server Error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
