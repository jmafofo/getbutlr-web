import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    const res = await fetch(
      `${process.env.SUPABASE_FUNCTION_URL}/analyzeTitle`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('Error in analyze-title route:', err);
    return NextResponse.error();
  }
}

