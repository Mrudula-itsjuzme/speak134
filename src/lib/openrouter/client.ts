/**
 * OpenRouter API Client
 * Replaces Google Gemini with OpenRouter for more flexibility and better models
 */

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

// Diagnostic logging
if (typeof window === 'undefined') { // Server-side only
    if (!OPENROUTER_API_KEY) {
        console.error('❌ CRITICAL: OPENROUTER_API_KEY is not set! Text chat will not work.');
        console.log('📝 Add OPENROUTER_API_KEY to your .env.local file and restart the server.');
    } else {
        console.log('✅ OpenRouter API key detected (length:', OPENROUTER_API_KEY.length, ')');
    }
}

// Available models to try in order of preference
// Optimized based on actual availability and performance
const modelsToTry = [
    'google/gemini-2.0-flash-exp:free',      // Free, fast (may have rate limits)
    'openai/gpt-4o-mini',                     // Paid, reliable, good quality
    'meta-llama/llama-3.1-8b-instruct:free', // Free fallback
    'anthropic/claude-3.5-sonnet',           // Paid, highest quality (requires credits)
    'google/gemini-flash-1.5-8b'             // Alternative Gemini model
];

interface OpenRouterMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

interface OpenRouterResponse {
    choices: Array<{
        message: {
            content: string;
        };
    }>;
    model: string;
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

/**
 * Generate content using OpenRouter API with automatic model fallback
 */
export async function generateContentSafe(prompt: string): Promise<string | null> {
    if (!OPENROUTER_API_KEY) {
        console.error('❌ OPENROUTER_API_KEY is not set');
        return null;
    }

    for (const modelName of modelsToTry) {
        try {
            const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
                    'X-Title': 'Language Tutor Bot'
                },
                body: JSON.stringify({
                    model: modelName,
                    messages: [
                        {
                            role: 'user',
                            content: prompt
                        }
                    ]
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorData;
                try {
                    errorData = JSON.parse(errorText);
                } catch (e) {
                    errorData = { message: errorText };
                }

                console.warn(`❌ Model ${modelName} failed (${response.status}):`, errorData);

                // If rate limited, try next model immediately
                if (response.status === 429) {
                    console.warn(`⏱️  Rate limited on ${modelName}, trying next model...`);
                    continue;
                }
                continue;
            }

            const data: OpenRouterResponse = await response.json();
            const content = data.choices[0]?.message?.content;

            if (content) {
                console.log(`✅ Success with model: ${data.model}`);
                return content;
            }
        } catch (error) {
            console.warn(`Failed with model ${modelName}:`, error);
            continue;
        }
    }

    console.error('❌ All models failed');
    return null;
}

/**
 * Generate content with custom messages (with automatic model fallback)
 */
export async function generateWithMessagesSafe(
    messages: OpenRouterMessage[]
): Promise<string | null> {
    if (!OPENROUTER_API_KEY) {
        console.error('❌ OPENROUTER_API_KEY is not set');
        return null;
    }

    for (const modelName of modelsToTry) {
        try {
            const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
                    'X-Title': 'Language Tutor Bot'
                },
                body: JSON.stringify({
                    model: modelName,
                    messages
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.warn(`❌ Model ${modelName} failed (${response.status}):`, errorText);
                continue;
            }

            const data: OpenRouterResponse = await response.json();
            const content = data.choices[0]?.message?.content;

            if (content) {
                console.log(`✅ Success with model: ${data.model}`);
                return content;
            }
        } catch (error) {
            console.warn(`Failed with model ${modelName}:`, error);
            continue;
        }
    }

    console.error('❌ All models failed');
    return null;
}

/**
 * Generate session summary from transcript
 */
export async function generateSessionSummary(transcript: string) {
    const prompt = `
    Analyze the following language learning session transcript.
    Identify:
    1. Key topics discussed
    2. Main grammatical mistakes made by the user
    3. New vocabulary used correctly
    4. The user's emotional state (confident, hesitant, frustrated, etc.)

    Transcript:
    ${transcript}

    Output JSON format:
    {
      "summary": "Brief 1-sentence summary",
      "mistakes": ["mistake 1", "mistake 2"],
      "vocabulary": ["word 1", "word 2"],
      "emotions": ["emotion 1", "emotion 2"]
    }
  `;

    const text = await generateContentSafe(prompt);

    if (!text) return null;

    try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (error) {
        console.error('Summary parsing failed:', error);
        return null;
    }
}

// Legacy export for backward compatibility
export const model = {
    generateContent: async (prompt: string) => {
        const text = await generateContentSafe(prompt);
        return {
            response: {
                text: () => text || ''
            }
        };
    }
};
