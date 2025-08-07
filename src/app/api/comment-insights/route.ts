import { NextRequest, NextResponse } from "next/server";
import { callOllama } from '../ollama_query/route';

export async function POST(req: NextRequest) {
  try {
    const { comments } = await req.json();

    if (!comments || !Array.isArray(comments)) {
      return NextResponse.json({ error: "Invalid request: 'comments' must be an array." }, { status: 400 });
    }

    const prompt = `
    Analyze these YouTube comments for:
    - Overall sentiment
    - Viewer intent
    - Feedback
    - Content improvement suggestions

    Respond in **markdown format** and include a structured JSON section with:
    {
      "tips": [array of improvement tips],
      "output": "markdown summary"
    }

Comments:
${comments.slice(0, 20).map((c, i) => `${i + 1}. ${c}`).join('\n')}
    `.trim();

    const rawResult = await callOllama(prompt);

    let parsedResult: { tips?: string[]; output: string } = { output: rawResult };

    // Try to parse JSON if included in markdown
    try {
      const extracted = rawResult.match(/```json([\s\S]*?)```/)?.[1]?.trim();
      if (extracted) {
        parsedResult = JSON.parse(extracted);
      }
    } catch (err) {
      // fallback: raw output only
      parsedResult = { output: rawResult };
    }

    return NextResponse.json({
      output: parsedResult.output,
      tips: parsedResult.tips || [],
    });

  } catch (error) {
    console.error("Error in /api/comment-insights:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
