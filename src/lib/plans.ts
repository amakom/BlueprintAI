export type PlanConfig = {
  id: string; // Internal ID
  name: string;
  price: number;
  currency: 'USD';
  lemonVariantId?: string; // Variant ID from Lemonsqueezy Dashboard
  features: string[];
  highlight?: boolean;
};

export const SUBSCRIPTION_PLANS: Record<string, PlanConfig> = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'USD',
    features: ['1 Project', 'Basic Canvas', 'Community Support'],
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    price: 10,
    currency: 'USD',
    lemonVariantId: process.env.LEMON_VARIANT_PRO,
    features: ['Unlimited Projects', 'AI PRD Generation', 'Priority Support'],
    highlight: true,
  },
  TEAM: {
    id: 'team',
    name: 'Team',
    price: 39,
    currency: 'USD',
    lemonVariantId: process.env.LEMON_VARIANT_TEAM,
    features: ['Everything in Pro', 'Team Collaboration', 'Role Management'],
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 0, // Custom
    currency: 'USD',
    features: ['SSO', 'Audit Logs', 'Dedicated Success Manager'],
  },
};
