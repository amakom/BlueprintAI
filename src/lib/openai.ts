import OpenAI from 'openai';

// Use Google Gemini via OpenAI-compatible API (free tier)
const apiKey = process.env.GEMINI_API_KEY || 'dummy-key-for-build';

export const openai = new OpenAI({
  apiKey,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
});

// Default model for all AI routes
export const AI_MODEL = 'gemini-2.0-flash';

// Check if a real AI API key is configured (not a placeholder)
export const isAIConfigured = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return false;
  if (key === 'dummy-key-for-build') return false;
  if (key.includes('your-') || key.includes('placeholder') || key.includes('example')) return false;
  // Gemini keys start with AI
  return key.startsWith('AI');
};
