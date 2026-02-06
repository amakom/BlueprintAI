// Google Gemini AI - Native REST API (no SDK compatibility issues)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

export const AI_MODEL = 'gemini-2.0-flash';

// Check if a real Gemini API key is configured
export const isAIConfigured = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return false;
  if (key === 'dummy-key-for-build') return false;
  if (key.includes('your-') || key.includes('placeholder') || key.includes('example')) return false;
  return key.startsWith('AI');
};

export interface AIResponse {
  text: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
    model: string;
  };
}

/**
 * Call Google Gemini API directly via fetch.
 * @param systemPrompt - System instruction for the model
 * @param userPrompt - User message/prompt
 * @param options - Optional: jsonMode (structured JSON output), temperature
 */
export async function generateAI(
  systemPrompt: string,
  userPrompt: string,
  options?: { jsonMode?: boolean; temperature?: number }
): Promise<AIResponse> {
  const url = `${GEMINI_BASE_URL}/models/${AI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const body: Record<string, unknown> = {
    contents: [
      {
        role: 'user',
        parts: [{ text: userPrompt }],
      },
    ],
    systemInstruction: {
      parts: [{ text: systemPrompt }],
    },
    generationConfig: {
      ...(options?.jsonMode ? { responseMimeType: 'application/json' } : {}),
      ...(options?.temperature !== undefined ? { temperature: options.temperature } : {}),
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

  return {
    text,
    usage: {
      inputTokens: data.usageMetadata?.promptTokenCount || 0,
      outputTokens: data.usageMetadata?.candidatesTokenCount || 0,
      model: AI_MODEL,
    },
  };
}
