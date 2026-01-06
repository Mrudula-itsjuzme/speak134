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
      2. If the user provides a short response (e.g., "Yes", "Hi", "Ok"), DO NOT pivot to generic help. Instead, dive deeper into ${topic} in ${language}.
      3. Speak 95% in ${language}. Use the user's native language only for brief translations in brackets.
      4. Embody the ${personality} personality in every sentence.
      
      ### EXAMPLE TRANSITION ###
      User: "Yes." or "Hi!"
      Assistant: "¡Genial! Empecemos con nuestro tema: ${topic}. [Great! Let's start with our topic: ${topic}.]" (Assuming Spanish/Energetic)
    `;

        // Map messages to OpenRouter format
        const openRouterMessages = [
            { role: 'system', content: systemPrompt },
            ...messages.map(m => ({
                role: m.type === 'user' ? 'user' : 'assistant',
                content: m.content
            }))
        ];

        // @ts-ignore
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
