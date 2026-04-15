"use server";

import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

// Vercel KV for rate limiting — serverless-native, no migrations needed
async function getKv() {
  const { createClient } = await import("@vercel/kv");
  return createClient({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
  });
}

export async function loginAction(
  _prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0] ??
    h.get("x-real-ip") ??
    "unknown";

  const now = Date.now();
  const key = `rate:${ip}`;

  try {
    const kv = await getKv();
    const raw = await kv.get<{ count: number; resetAt: number }>(key);

    if (raw) {
      if (now < raw.resetAt) {
        if (raw.count >= MAX_ATTEMPTS) {
          return {
            error: "Too many login attempts. Please try again later.",
          };
        }
        await kv.set(key, { count: raw.count + 1, resetAt: raw.resetAt }, { ttl: Math.ceil((raw.resetAt - now) / 1000) });
      } else {
        await kv.set(key, { count: 1, resetAt: now + WINDOW_MS }, { ttl: WINDOW_MS / 1000 });
      }
    } else {
      await kv.set(key, { count: 1, resetAt: now + WINDOW_MS }, { ttl: WINDOW_MS / 1000 });
    }
  } catch (err) {
    // Fail open: allow login if KV is unavailable, but log the issue
    console.error("[rateLimit] KV error:", err);
  }

  const password = formData.get("password") as string;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return { error: "Server configuration error." };
  }

  if (password !== adminPassword) {
    return { error: "Invalid password." };
  }

  const cookieStore = await cookies();
  cookieStore.set("session", "valid", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  return {};
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
