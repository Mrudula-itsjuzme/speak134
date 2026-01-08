import { generateContentSafe } from '@/lib/openrouter/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { text, targetLanguage } = await request.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        if (!targetLanguage || targetLanguage === 'Detect') {
            return NextResponse.json({ error: 'Target language is required for translation' }, { status: 400 });
        }

        const prompt = `
      Translate the following text into ${targetLanguage}. 
      Ensure the translation is natural and accurate for a language learner.
      Return ONLY the translated text. Do not include any explanations or markdown.

      Text to translate:
      "${text}"
    `;

        const status = await generateContentSafe(prompt);

        if (!status) {
            throw new Error('Failed to generate translation');
        }

        return NextResponse.json({ translation: status });
    } catch (error) {
        console.error('Translation error:', error);
        return NextResponse.json({ error: 'Failed to translate' }, { status: 500 });
    }
}
