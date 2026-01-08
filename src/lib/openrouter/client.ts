/**
 * OpenRouter API Client
 * Replaces Google Gemini with OpenRouter for more flexibility and better models
 */

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

// Diagnostic logging removed to prevent build failures during static generation.
// The key is checked inside individual functions at runtime.

// Available models to try in order of preference
// Optimized based on actual availability and performance
const modelsToTry = [
    'google/gemini-2.0-flash-exp:free',       // Free, fast (Rate limits apply)
    'meta-llama/llama-3.1-8b-instruct',       // Standard (Cheap/Free tier often available)
    'mistralai/mistral-7b-instruct',          // Standard
    'microsoft/phi-3-mini-128k-instruct:free',// High quality free model
    'openchat/openchat-7:free',               // Free fallback
    'huggingfaceh4/zephyr-7b-beta:free',      // Free fallback
    'openai/gpt-4o-mini',                     // High quality backup
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
 * Robustly extract JSON from AI response
 */
export function extractJSON(text: string): string {
    // 1. Remove markdown code blocks
    let clean = text.replace(/```json\s*|\s*```/g, '');

    // 2. Find the first '{' and the last '}'
    const start = clean.indexOf('{');
    const end = clean.lastIndexOf('}');

    if (start !== -1 && end !== -1 && end > start) {
        clean = clean.substring(start, end + 1);
    }

    return clean;
}

/**
 * Attempt to parse JSON with simple repair logic for common AI errors
 */
export function tryParseJSON<T>(text: string): T | null {
    try {
        return JSON.parse(text);
    } catch {
        // Robust repair strategy
        try {
            // 1. Remove trailing commas
            let repaired = text.replace(/,(\s*[}\]])/g, '$1');

            // 2. Fix bad unicode escapes (e.g. \u043 -> \u0000 or just remove)
            // Replaces \u followed by less than 4 hex digits with a placeholder
            repaired = repaired.replace(/\\u(?![0-9a-fA-F]{4})/g, '');

            // 3. Fix unescaped newlines in strings
            repaired = repaired.replace(/(?<!\\)\n/g, '\\n');

            return JSON.parse(repaired);
        } catch (e) {
            console.warn('JSON Parse Error:', e);
            console.warn('Failed Text:', text.substring(0, 100)); // Log first 100 chars
            return null;
        }
    }
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
                    ],
                    max_tokens: 2000  // Ensure responses aren't truncated
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorData;
                try {
                    errorData = JSON.parse(errorText);
                } catch {
                    errorData = { message: errorText };
                }

                console.warn(`❌ Model ${modelName} failed (${response.status}):`, errorData);
                console.warn('Raw error text:', errorText.substring(0, 200)); // Log raw text for debugging HTML errors

                // If rate limited, try next model immediately
                if (response.status === 429) {
                    console.warn(`⚠️  Rate limit (429) on ${modelName}. Switching to next backup model...`);
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
    5. Specific speech patterns (strengths and weaknesses)

    Transcript:
    ${transcript}

    Output JSON format:
    {
      "summary": "Brief 1-sentence summary",
      "mistakes": ["mistake 1", "mistake 2"],
      "vocabulary": ["word 1", "word 2"],
      "emotions": ["emotion 1", "emotion 2"],
      "patterns": {
        "strengths": ["pattern 1", "pattern 2"],
        "weaknesses": ["pattern 1", "pattern 2"],
        "pronunciation": ["issue 1"],
        "grammar": ["issue 1"],
        "vocabulary": ["issue 1"]
      }
    }
  `;

    const text = await generateContentSafe(prompt);

    if (!text) return null;

    try {
        const cleanText = extractJSON(text);
        return JSON.parse(cleanText);
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
