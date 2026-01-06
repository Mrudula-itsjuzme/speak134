import { NextResponse } from 'next/server';
import { generateContentSafe } from '@/lib/openrouter/client';


export async function POST(request: Request) {
  let language, personality, topic, level;

  try {
    const body = await request.json();
    language = body.language;
    const nativeLanguage = body.nativeLanguage || 'English';
    personality = body.personality;
    topic = body.topic;
    level = body.level;
    const historyContext = body.historyContext || '';

    if (!language) {
      return NextResponse.json({ error: 'Language is required' }, { status: 400 });
    }

    const prompt = `
      You are generating the SYSTEM PROMPT for an AI language tutor.
      
      STRICT REQUIREMENTS:
      1. Target Language: ${language} (The AI MUST speak primarily in this language).
      2. Persona: ${personality} (The AI MUST embody this personality throughout).
      3. User's Native Language: ${nativeLanguage} (Only for translations/explanations).
      4. Level: ${level || 'Beginner'}
      5. Current Topic: ${topic || 'Immersive Daily Conversation'}

      INSTRUCTIONS for the AI Agent:
      - Start the conversation AS IF YOU ALREADY KNOW the user's intent.
      - Use ${language} for 90% of the interaction.
      - Correct the user's mistakes gently but clearly.
      - Keep responses concise (1-3 sentences).
      - NEVER ask the user what language they want to learn or their level.
      - DO NOT introduce yourself as a general bot. You are the specific ${personality} ${language} tutor.
      - Ensure the "firstMessage" is in ${language}, reflects the ${personality} persona, and mentions the topic: ${topic}.

      ${historyContext ? `---
      PREVIOUS CONTEXT:
      ${historyContext}
      ---` : ''}

      Output JSON format:
      {
        "systemPrompt": "The full instruction for the AI tutor...",
        "firstMessage": "The opening greeting in ${language}..."
      }
    `;

    const text = await generateContentSafe(prompt);

    if (!text) {
      throw new Error('Failed to generate prompt from any model');
    }

    // Clean up markdown code blocks if present
    const cleanText = text.replace(/```json\n|\n```/g, '').trim();

    try {
      const data = JSON.parse(cleanText);
      return NextResponse.json(data);
    } catch (e) {
      console.error('Failed to parse Gemini response:', text);
      return NextResponse.json({
        systemPrompt: `You are a ${personality} ${language} tutor. Teach ${topic}.`,
        firstMessage: `Hello! Let's learn ${language}.`
      });
    }

  } catch (error) {
    console.error('Error generating prompt:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    // Fallback to static prompt on error
    return NextResponse.json({
      systemPrompt: `You are a ${personality || 'friendly'} ${language || 'language'} tutor. Teach ${topic || 'conversation'}.`,
      firstMessage: `Hello! Let's learn ${language || 'a new language'}.`
    });
  }
}
