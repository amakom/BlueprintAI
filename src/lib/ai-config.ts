export const PRODUCT_TYPES = [
  'Mobile App',
  'Web App',
  'SaaS Platform',
  'E-commerce',
  'Internal Tool',
  'Landing Page',
  'API Service'
] as const;

export const TONES = [
  'Standard',
  'Professional',
  'Enthusiastic',
  'Concise',
  'Technical',
  'Friendly'
] as const;

export type ProductType = typeof PRODUCT_TYPES[number];
export type Tone = typeof TONES[number];

export type AIHistoryItem = {
  id: string;
  timestamp: number;
  content: string;
  tone?: string;
  productType?: string;
};

export type AISettings = {
  productType: ProductType;
  tone: Tone;
};

export const DEFAULT_AI_SETTINGS: AISettings = {
  productType: 'Mobile App',
  tone: 'Standard'
};
