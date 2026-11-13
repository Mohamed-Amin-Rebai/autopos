import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

type RateLimitType = "ai" | "cashierLogin";

type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
};

let redis: Redis | undefined;
const limiters = new Map<RateLimitType, Ratelimit>();

function getRedis() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    throw new Error(
      "UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be configured"
    );
  }

  redis ??= Redis.fromEnv();
  return redis;
}

function getLimiter(type: RateLimitType) {
  const existing = limiters.get(type);
  if (existing) return existing;

  const limiter =
    type === "ai"
      ? new Ratelimit({
          redis: getRedis(),
          limiter: Ratelimit.slidingWindow(10, "1 m"),
          prefix: "autopos:rate-limit:ai",
        })
      : new Ratelimit({
          redis: getRedis(),
          limiter: Ratelimit.slidingWindow(5, "15 m"),
          prefix: "autopos:rate-limit:cashier-login",
        });

  limiters.set(type, limiter);
  return limiter;
}

export async function checkRateLimit(
  type: RateLimitType,
  identifier: string
): Promise<RateLimitResult> {
  return getLimiter(type).limit(identifier);
}

export function getClientIp(req: Request) {
  const cloudflareIp = req.headers.get("cf-connecting-ip")?.trim();
  if (cloudflareIp) return cloudflareIp;

  const vercelIp = req.headers.get("x-vercel-ip")?.trim();
  if (vercelIp) return vercelIp;

  if (process.env.NODE_ENV !== "production") {
    return (
      req.headers.get("x-real-ip")?.trim() ||
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      null
    );
  }

  return null;
}

export function rateLimitResponse(result: RateLimitResult) {
  const retryAfter = Math.max(
    1,
    Math.ceil((result.reset - Date.now()) / 1000)
  );

  return NextResponse.json(
    { error: "Too many requests. Please try again later." },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
        "X-RateLimit-Limit": String(result.limit),
        "X-RateLimit-Remaining": String(result.remaining),
        "X-RateLimit-Reset": String(result.reset),
      },
    }
  );
}
