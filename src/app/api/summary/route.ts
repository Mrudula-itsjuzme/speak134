import { NextResponse } from 'next/server';
import { generateSessionSummary } from '@/lib/openrouter/client';


export async function POST(request: Request) {
  try {
    const { transcript } = await request.json();

    if (!transcript) {
      return NextResponse.json({ error: 'Transcript is required' }, { status: 400 });
    }

    const summary = await generateSessionSummary(transcript);

    if (!summary) {
      return NextResponse.json({
        summary: 'Session completed',
        mistakes: [],
        vocabulary: [],
        emotions: ['neutral'],
        patterns: { strengths: [], weaknesses: [] }
      });
    }

    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error generating summary:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
