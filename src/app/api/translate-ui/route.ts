import { NextResponse } from 'next/server';
import { generateContentSafe, extractJSON, tryParseJSON } from '@/lib/openrouter/client';

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
  'placeholder': 'Talk to MisSpoke !!',
  'dashboard': 'Dashboard',
  'community': 'Community',
  'login': 'Log In',
  'signup': 'Sign Up',
  'hi': 'Hi',
  'logout': 'Log Out',
  'select_language': 'Select Your Language',
  'unlock_cultures': 'Choose from our curated selection of languages. Unlock new cultures and career opportunities with our AI-driven path.',
  'filter_all': 'All',
  'filter_beginner': 'Beginner',
  'filter_intermediate': 'Intermediate',
  'filter_advanced': 'Advanced',
  'choose_personality': 'Choose Your AI Personality',
  'mood_match': 'Every mood has a match. Who do you want to talk to today?'
};

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({})); // Handle empty/invalid body safely
    const { targetLanguage } = body;

    if (!targetLanguage || targetLanguage === 'English') {
      return NextResponse.json(uiKeys);
    }

    const prompt = `
      Translate the following UI keys to ${targetLanguage}.
      Return ONLY a valid, raw JSON object - no markdown, no code blocks, no explanations.
      
      CRITICAL RULES:
      1. Response must be STRICTLY valid JSON that can be parsed by JSON.parse().
      2. Use ONLY standard ASCII characters in the JSON structure (keys and syntax).
      3. Translated values can use Unicode characters (e.g., Chinese, Japanese, Arabic).
      4. Do NOT use any escape sequences or special formatting in the values.
      5. Maintain the exact same keys as the input.
      6. Do NOT add any text before or after the JSON object.
      
      Example of correct format:
      {"key1": "translated text 1", "key2": "translated text 2"}
      
      Input JSON to translate:
      ${JSON.stringify(uiKeys, null, 2)}
      
      Return the translated JSON now:
    `;

    const text = await generateContentSafe(prompt);

    if (!text) throw new Error('Failed to translate');

    // Clean up markdown code blocks if present
    const cleanText = extractJSON(text);

    console.log('DEBUG: Raw AI Text:', text.substring(0, 200));
    console.log('DEBUG: Clean Text:', cleanText.substring(0, 200));

    // Try to parse with additional cleaning
    let translations = tryParseJSON(cleanText);

    // If failed, try additional cleaning strategies
    if (!translations) {
      console.warn('First parse failed, trying additional cleaning...');
      
      // Strategy 1: Remove any BOM or invisible characters
      let cleaned = cleanText.replace(/^\uFEFF/, '').trim();
      
      // Strategy 2: Try to find and extract just the object
      const objectMatch = cleaned.match(/\{[\s\S]*\}/);
      if (objectMatch) {
        cleaned = objectMatch[0];
      }
      
      translations = tryParseJSON(cleaned);
      
      if (!translations) {
        console.error('Failed to parse translations after cleaning, falling back to English.');
        return NextResponse.json(uiKeys);
      }
    }

    // Validate that translations has the same keys
    const missingKeys = Object.keys(uiKeys).filter(key => !(key in translations));
    if (missingKeys.length > 0) {
      console.warn('Missing translated keys:', missingKeys);
      // Fill in missing keys with English
      missingKeys.forEach(key => {
        translations[key] = uiKeys[key as keyof typeof uiKeys];
      });
    }

    return NextResponse.json(translations);
  } catch (error) {
    console.error('Translation error:', error);
    // Fallback to English
    return NextResponse.json(uiKeys);
  }
}
