import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const backendUrl = process.env.BACKEND_URL;

    const backendForm = new FormData();
    backendForm.append('file', file);

    const response = await fetch(`${backendUrl}/api/v1/transcribe`, {
      method: 'POST',
      body: backendForm,
    });

    const raw = await response.text();
    console.log('Backend response:', raw);

    try {
      const json = JSON.parse(raw);
      if (!response.ok) {
        return NextResponse.json({ error: json.detail || 'Backend Error' }, { status: response.status });
      }
      return NextResponse.json(json);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid JSON from backend', raw }, { status: 500 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
