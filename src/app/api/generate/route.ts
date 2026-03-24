import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { buildFallbackContent, buildPrompts, normalizeGeneratedResponse } from '@/lib/generateContent.mjs';

type GenerateRequest = {
  businessType: string;
  businessName: string;
  location: string;
  description: string;
  offer?: string;
  targetAudience?: string;
  language: 'English' | 'Hindi' | 'Kannada';
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateRequest;

    if (!body.businessName?.trim() || !body.location?.trim() || !body.description?.trim()) {
      return NextResponse.json({ error: 'Business name, location, and description are required.' }, { status: 400 });
    }

    const prompts = buildPrompts(body);
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(buildFallbackContent(body));
    }

    const client = new OpenAI({ apiKey });

    const completion = await client.chat.completions.create({
      model: 'gpt-4.1-mini',
      temperature: 0.8,
      messages: [
        {
          role: 'system',
          content:
            'You create short, high-conversion local marketing content. Return strict JSON with keys whatsapp, instagram, linkedin only. Every value must be a plain string.'
        },
        {
          role: 'user',
          content: `${prompts.whatsapp}\n\n${prompts.instagram}\n\n${prompts.linkedin}\n\nRespond only as JSON.`
        }
      ],
      response_format: { type: 'json_object' }
    });

    const text = completion.choices[0]?.message?.content;
    if (!text) {
      throw new Error('No response from model.');
    }

    const parsed = normalizeGeneratedResponse(JSON.parse(text));

    return NextResponse.json(parsed);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to generate content. Please try again shortly.' }, { status: 500 });
  }
}
