import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { hookText } = await req.json();

    const prompt = `
        You are a YouTube content strategist.
        Analyze the following YouTube hook for effectiveness:
        "${hookText}"

        Evaluate:
        1. Emotional appeal
        2. Curiosity and engagement
        3. Pacing and clarity
        4. Strength of the opening seconds

        Then:
        - Suggest 3 improved versions of this hook.
        - Simulate a viewer retention curve across 6 time segments (0–1 min to 6 min).
        - Provide 3 general improvement tips for video hooks like this.
        Respond in structured JSON like this:
        {
          "analysis": "Your feedback...",
          "improvedHooks": ["...", "...", "..."],
          "retentionCurve": [100, 85, 70, 55, 40, 25],
          "tips": ["...", "...", "..."]
        }
            `.trim();

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

    if (!ollamaRes.ok || !data.response) {
      console.error("Ollama Error:", data);
      return NextResponse.json({ error: data }, { status: 500 });
    }

    let parsed;
    try {
      const cleanJson = data.response.replace(/```json|```/g, '').trim();
      parsed = JSON.parse(cleanJson);
    } catch (jsonErr) {
      console.error("Failed to parse Ollama JSON:", jsonErr);
      return NextResponse.json({ error: "Invalid response format from model" }, { status: 500 });
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Internal Server Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
