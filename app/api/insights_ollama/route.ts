import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { query, tone } = await req.json();

    const prompt = `For the topic "${query}", in "${tone}" tone, suggest JSON with:
    {
      "keywords": [...],
      "tags": [...],
      "title_variants": [...],
      "thumbnail_prompt": "..."
    }`;

    const ollamaRes = await fetch(`${process.env.OLLAMA_SERVER_URL}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gemma3:27b",
        prompt: prompt,
        stream: false,
      }),
    });

    const data = await ollamaRes.json();

    if (!ollamaRes.ok) {
      console.error("Ollama Error:", data);
      return NextResponse.json({ error: data }, { status: 500 });
    }

    return NextResponse.json({ insight: data.response ?? "No response generated." });
  } catch (err) {
    console.error("Internal Server Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
