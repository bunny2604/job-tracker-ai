import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const prompt = `
You are a career assistant.

Analyze this job application:
Company: ${body.company}
Role: ${body.role}
Status: ${body.status}

Give short actionable advice in 2-3 lines.
`;

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });

    const result = response.choices[0].message.content;

    return NextResponse.json({ insight: result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'AI failed' }, { status: 500 });
  }
}