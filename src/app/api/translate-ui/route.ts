import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

const uiKeys = {
  'practice': 'Conversation Practice',
  'topic': 'Topic',
  'online': 'AI ONLINE',
  'roadmap': 'Your Roadmap',
  'complete': 'Complete',
  'completed': 'COMPLETED',
  'in_progress': 'IN PROGRESS',
  'locked': 'LOCKED',
  'listen': 'Listen',
  'translate': 'Translate',
  'connected': 'Connected',
  'join': 'Join Call',
  'leave': 'Leave',
  'placeholder': 'Talk to MisSpoke !!'
};

export async function POST(request: Request) {
  try {
    const { targetLanguage } = await request.json();

    if (!targetLanguage || targetLanguage === 'English') {
      return NextResponse.json(uiKeys);
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      Translate the following UI strings to ${targetLanguage}.
      Return ONLY a valid JSON object where the keys are the same as the input keys, and the values are the translations.
      Do not include any markdown formatting or explanations.

      Input JSON:
      ${JSON.stringify(uiKeys, null, 2)}
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Clean up markdown code blocks if present
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const translations = JSON.parse(cleanText);

    return NextResponse.json(translations);
  } catch (error) {
    console.error('Translation error:', error);
    // Fallback to English
    return NextResponse.json(uiKeys);
  }
}
