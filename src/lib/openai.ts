import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY || 'dummy-key-for-build';

export const openai = new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: false,
});

// Check if a real OpenAI API key is configured (not a placeholder)
export const isAIConfigured = () => {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return false;
  // Reject obvious placeholder values
  if (key === 'dummy-key-for-build') return false;
  if (key.includes('your-') || key.includes('placeholder') || key.includes('example')) return false;
  // Valid OpenAI keys start with sk-
  return key.startsWith('sk-');
};
