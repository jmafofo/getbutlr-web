import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { channel } = await req.json();

  const prompt = `Create a weekly growth plan for the YouTube channel "${channel}". Include:
1. Recommended platform focus (e.g., Shorts, TikTok, long-form)
2. A day-by-day content plan for the week
3. 2 expert tips or reminders`;

  const chatResponse = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a social media strategist generating weekly plans for creators.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7
  });

  const content = chatResponse.choices[0].message.content || '';
  const [focusBlock, scheduleBlock, notesBlock] = content.split(/\n\n+/);

  const focus = focusBlock.replace(/^1\.\s*/, '').trim();
  const schedule = (scheduleBlock.match(/\d?\.?\s*(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday):?.*/gi) || []).map(line => {
    const [day, ...rest] = line.replace(/^\d?\.?\s*/, '').split(':');
    return { day: day.trim(), task: rest.join(':').trim() };
  });
  const notes = (notesBlock?.match(/-\s.+/g) || []).map(line => line.replace(/-\s/, ''));

  return NextResponse.json({ focus, schedule, notes });
}

