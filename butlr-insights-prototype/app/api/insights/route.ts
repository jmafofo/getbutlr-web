import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { query, tone } = await req.json();
    const res = await fetch(
      `${process.env.SUPABASE_FUNCTION_URL}/generateInsights`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, tone }),
      }
    );
    const body = await res.json();
    return NextResponse.json(body);
  } catch (err) {
    console.error(err);
    return NextResponse.error();
  }
}

