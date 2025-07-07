import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { commentsText } = await req.json()

    const prompt = `Analyze these YouTube comments for sentiment, viewer intent, feedback, and content suggestions:\n\n${commentsText}`;

    const ollamaRes = await fetch(`${process.env.OLLAMA_SERVER_URL}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gemma3:27b",
        prompt,
        stream: false,
      }),
    })

    const data = await ollamaRes.json()

    if (!ollamaRes.ok) {
      console.error("Ollama Error:", data)
      return NextResponse.json({ error: data }, { status: 500 })
    }

    return NextResponse.json({ plan: data.response ?? "No growth plan generated." })
  } catch (err) {
    console.error("Internal Server Error:", err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
