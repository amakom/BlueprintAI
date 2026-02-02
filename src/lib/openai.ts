import OpenAI from 'openai';

// Initialize OpenAI client
// Note: It will automatically use process.env.OPENAI_API_KEY
// Make sure this environment variable is set in your .env.local file

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build', // Fallback to avoid build errors if env is missing, but runtime will fail if not set
  dangerouslyAllowBrowser: false, // Only allow server-side usage
});

// Helper to check if AI is configured
export const isAIConfigured = () => {
  return !!process.env.OPENAI_API_KEY;
};
