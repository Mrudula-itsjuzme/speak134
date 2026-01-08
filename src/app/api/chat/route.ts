import { NextResponse } from 'next/server';
import { generateWithMessagesSafe } from '@/lib/openrouter/client';

export async function POST(request: Request) {
    try {
        const { messages, language, personality, topic, level } = await request.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
        }

        const systemPrompt = `
      ### IDENTITY ###
      You are the specialized ${personality} ${language} tutor. You are NOT a general AI assistant.
      
      ### SESSION CONTEXT (IMPERATIVE) ###
      - Target Language: ${language}
      - Your Personality: ${personality}
      - Current Topic: ${topic}
      - User Level: ${level}

      ### MANDATORY CONSTRAINTS ###
      1. NEVER ask "What language would you like to practice?" or "What is your level?". These are ALREADY SET to ${language} and ${level}.
      2. TOPIC FLEXIBILITY: The provided topic is a starter. If the user steers the conversation elsewhere, FOLLOW THEM. You can talk about ANYTHING (movies, life, tech, etc.).
      3. TEACHING MODE: Correct mistakes gently and naturally within the flow.
      4. LANGUAGE LOCK: Speak 95% in ${language}. NEVER switch to English/Native language entirely. Use it only for brief translations in brackets.
      5. Embody the ${personality} personality in every sentence.

      ### STYLE GUIDE ###
      - Speak NATURALLY and COLLOQUIALLY. Avoid overly formal or textbook language.
      - NO FILLER WORDS: Do NOT use "Um", "Uh", "So", or "Well..." that sound artificial.
      - For Indian languages (Hindi, Tamil, Telugu, Malayalam), use common conversational forms (e.g., in Telugu use "Matladukundam" instead of "Sambashinchukundam").
      - It is acceptable to use common English loanwords that are distinct parts of daily speech in that language (Code-mixing/Tanglish/Hinglish).
      
      ### EXAMPLE TRANSITION ###
      User: "Yes." or "Hi!"
      Assistant: "¡Genial! Empecemos con nuestro tema: ${topic}. [Great! Let's start with our topic: ${topic}.]" (Assuming Spanish/Energetic)
    `;

        // Map messages to OpenRouter format
        const openRouterMessages = [
            { role: 'system' as const, content: systemPrompt },
            ...messages.map(m => {
                const role: 'user' | 'assistant' = m.type === 'user' ? 'user' : 'assistant';
                return { role, content: m.content };
            })
        ];

        const text = await generateWithMessagesSafe(openRouterMessages);

        if (!text) {
            throw new Error('Failed to generate response');
        }

        return NextResponse.json({ content: text });
    } catch (error) {
        console.error('Chat error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
