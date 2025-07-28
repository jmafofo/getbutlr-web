import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { goals, niche, frequency } = await req.json()

    const prompt = `
I am a content creator in the "${niche}" niche. I want to grow by "${goals}" and can publish ${frequency} videos per week. Please give me a personalized weekly content plan with topics, posting schedule, and optimization tips.
    `.trim();

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
