import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const userQuery = body.query;

  const prompt = `
        For the topic: "${userQuery}", in SEO-rich tone, generate 5 enhance unique title that make the viewers think what's the content all about and seek more what would be the next video content, make them excite on whats next, and also engaging 5-sentence description optimized for clicks and watch time.

        Respond ONLY in the following JSON format:

        {
        "items": [
            {
            "title": "First video title",
            "description": "First video description"
            },
            {
            "title": "Second video title",
            "description": "Second video description"
            },
            {
            "title": "Third video title",
            "description": "Third video description"
            },
            {
            "title": "Fourth video title",
            "description": "Fourth video description"
            },
            {
            "title": "Fifth video title",
            "description": "Fifth video description"
            }
        ]
        }
        `;

  try {
    const res = await fetch(`${process.env.OLLAMA_SERVER_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gemma3:27b",
        prompt,
        stream: false,
      }),
    });

    const ollamaData = await res.json();
    const rawResponse = ollamaData.response;

    // Match content inside ```json ... ```
    const match = rawResponse.match(/```json\s*([\s\S]*?)\s*```/i);
    const jsonStr = match ? match[1] : rawResponse; // fallback to raw if no code block

    let parsed;
    try {
      parsed = JSON.parse(jsonStr);
    } catch (err) {
      console.error("Invalid JSON from Ollama:", jsonStr);
      throw new Error("Failed to parse Ollama response JSON");
    }

    const items = parsed.items.map((item: any, index: number) => ({
      id: Math.random().toString(36).substring(2, 12),
      snippet: {
        title: item.title,
        description: item.description,
      },
    }));

    return NextResponse.json({ items });
  } catch (err) {
    console.error("Failed to generate from Ollama", err);
    return NextResponse.json(
      { error: "Failed to generate title/description list." },
      { status: 500 }
    );
  }
}
