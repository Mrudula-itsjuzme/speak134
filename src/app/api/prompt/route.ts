import { NextResponse } from 'next/server';
import { generateContentSafe, extractJSON } from '@/lib/openrouter/client';

export async function POST(request: Request) {
  let language, personality, topic, level;

  try {
    // Safely parse body
    interface PromptRequestBody {
      language?: string;
      nativeLanguage?: string;
      personality?: string;
      topic?: string;
      level?: string;
      historyContext?: string;
    }

    let body: PromptRequestBody = {};
    try {
      const text = await request.text();
      if (text) body = JSON.parse(text);
    } catch {
      console.warn('Empty or invalid body provided to prompt generation');
    }

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
      ${historyContext ? `6. Previous Context: ${historyContext}` : ''}
      7. INSTRUCTIONS:
         - Output valid JSON only.
         - NO Markdown.
         - "systemPrompt": A detailed instruction set for the AI.
         - "firstMessage": The opening greeting in ${language}.
         - "accent": "native" (This is crucial).

      Output Format:
      {
        "systemPrompt": "...",
        "firstMessage": "..."
      }
    `;

    const text = await generateContentSafe(prompt);

    if (!text) {
      throw new Error('Failed to generate prompt from any model');
    }

    // Clean up markdown code blocks if present
    const cleanText = extractJSON(text);

    // Sanitize: AI often returns raw newlines in string values which break JSON.parse
    const sanitizedText = cleanText.replace(/"([^"]*)"/g, (match: string, p1: string) => {
      // Very basic sanitization of newlines inside strings
      return '"' + p1.replace(/\n/g, '\\n') + '"';
    });

    try {
      const data = JSON.parse(sanitizedText);
      return NextResponse.json(data);
    } catch {
      console.error('Failed to parse (even sanitized) response:', sanitizedText);
      // Try one more time with simple repair or fallback
      return NextResponse.json({
        systemPrompt: `You are a ${personality} ${language} tutor. Teach ${topic}.`,
        firstMessage: `Hello! Let's learn ${language}.`
      });
    }

  } catch (error) {
    console.error('Error in prompt route:', error);
    // Fallback to static prompt on error
    return NextResponse.json({
      systemPrompt: `You are a ${personality || 'friendly'} ${language || 'language'} tutor. Teach ${topic || 'conversation'}.`,
      firstMessage: `Hello! Let's learn ${language || 'a new language'}.`
    });
  }
}
