// Lemonsqueezy API client for BlueprintAI
// Documentation: https://docs.lemonsqueezy.com/api

const LEMONSQUEEZY_API_URL = 'https://api.lemonsqueezy.com/v1';

export function isLemonSqueezyConfigured(): boolean {
  return !!(process.env.LEMONSQUEEZY_API_KEY && process.env.LEMONSQUEEZY_STORE_ID);
}

async function lemonFetch(endpoint: string, options: RequestInit = {}) {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;

  if (!apiKey) {
    throw new Error('LEMONSQUEEZY_API_KEY is not configured');
  }

  const response = await fetch(`${LEMONSQUEEZY_API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.errors?.[0]?.detail || `Lemonsqueezy API error: ${response.status}`);
  }

  return response.json();
}

export interface CreateCheckoutOptions {
  variantId: string;
  email: string;
  name?: string;
  teamId: string;
  planId: string;
  redirectUrl?: string;
}

export async function createCheckout(options: CreateCheckoutOptions) {
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;

  if (!storeId) {
    throw new Error('LEMONSQUEEZY_STORE_ID is not configured');
  }

  const payload = {
    data: {
      type: 'checkouts',
      attributes: {
        checkout_data: {
          email: options.email,
          name: options.name || 'BlueprintAI User',
          custom: {
            team_id: options.teamId,
            plan_id: options.planId,
          },
        },
        product_options: {
          redirect_url: options.redirectUrl || `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?status=success`,
        },
      },
      relationships: {
        store: {
          data: {
            type: 'stores',
            id: storeId,
          },
        },
        variant: {
          data: {
            type: 'variants',
            id: options.variantId,
          },
        },
      },
    },
  };

  const result = await lemonFetch('/checkouts', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return {
    checkoutUrl: result.data.attributes.url,
    checkoutId: result.data.id,
  };
}

export async function getSubscription(subscriptionId: string) {
  const result = await lemonFetch(`/subscriptions/${subscriptionId}`);
  return result.data;
}

export async function cancelSubscription(subscriptionId: string) {
  const result = await lemonFetch(`/subscriptions/${subscriptionId}`, {
    method: 'DELETE',
  });
  return result.data;
}

export async function resumeSubscription(subscriptionId: string) {
  const result = await lemonFetch(`/subscriptions/${subscriptionId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      data: {
        type: 'subscriptions',
        id: subscriptionId,
        attributes: {
          cancelled: false,
        },
      },
    }),
  });
  return result.data;
}

// Webhook signature verification
import crypto from 'crypto';

export function verifyWebhookSignature(
  payload: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature) return false;

  try {
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(payload).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
  } catch {
    return false;
  }
}

// Event types from Lemonsqueezy webhooks
export type LemonSqueezyEventType =
  | 'subscription_created'
  | 'subscription_updated'
  | 'subscription_cancelled'
  | 'subscription_resumed'
  | 'subscription_expired'
  | 'subscription_paused'
  | 'subscription_unpaused'
  | 'subscription_payment_success'
  | 'subscription_payment_failed'
  | 'order_created'
  | 'order_refunded';
