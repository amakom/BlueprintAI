
import { NextResponse } from 'next/server';

interface RateLimitStore {
  [key: string]: {
    count: number;
    reset: number;
  };
}

// In-memory store (Note: This resets on server restart/lambda cold start)
// For production, use Redis (e.g., @upstash/ratelimit) or database
const store: RateLimitStore = {};

interface RateLimitOptions {
  limit: number; // Max requests
  window: number; // Window size in seconds
}

export async function checkRateLimit(identifier: string, options: RateLimitOptions = { limit: 10, window: 60 }) {
  const now = Date.now();
  const key = identifier;
  
  const record = store[key];

  if (!record || now > record.reset) {
    store[key] = {
      count: 1,
      reset: now + options.window * 1000,
    };
    return { success: true, limit: options.limit, remaining: options.limit - 1, reset: store[key].reset };
  }

  if (record.count >= options.limit) {
    return { 
      success: false, 
      limit: options.limit, 
      remaining: 0, 
      reset: record.reset 
    };
  }

  record.count += 1;
  return { 
    success: true, 
    limit: options.limit, 
    remaining: options.limit - record.count, 
    reset: record.reset 
  };
}

export function rateLimitResponse(result: { reset: number }) {
  return new NextResponse('Too Many Requests', {
    status: 429,
    headers: {
      'X-RateLimit-Limit': '10',
      'X-RateLimit-Remaining': '0',
      'X-RateLimit-Reset': result.reset.toString(),
    },
  });
}
