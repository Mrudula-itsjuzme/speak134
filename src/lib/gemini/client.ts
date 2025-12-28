import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GOOGLE_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

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

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    // Extract JSON from potential markdown code blocks
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
  } catch (error) {
    console.error('Gemini summary generation failed:', error);
    return null;
  }
}
