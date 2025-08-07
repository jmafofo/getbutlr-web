import { NextRequest, NextResponse } from 'next/server';
import { callOllama } from '../ollama_query/route'; // your existing function
import path from 'path';
import fs from 'fs';
import pdf from 'pdf-parse/lib/pdf-parse'

async function extractTextFromPdf(filePath: string): Promise<string> {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer);
  return data.text;
}

export async function POST(req: NextRequest) {
  const { query, history = [] } = await req.json();

  const platformDetails = await extractTextFromPdf('public/platform-details.pdf');

  const prompt = `
You're an expert assistant for a platform called "Getbutlr", an all-in-one SEO optimizer for content creators.

Only answer based on the platform details below:
---
${platformDetails}
---

User question: ${query}

Make the response in clean, helpful **Markdown** format. If applicable, suggest helpful **links** from the context or PDF.
`;

  const rawResult = await callOllama(prompt);

  const responseMarkdown = rawResult.trim();

  const updatedHistory = [...history, { query, response: responseMarkdown }];

  return NextResponse.json({ markdown: responseMarkdown, history: updatedHistory });
}
