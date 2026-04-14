"use server";

import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { prisma } from "@/lib/server/prisma";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

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

  try {
    const record = await prisma.rateLimit.findUnique({ where: { ip } });

    if (record) {
      if (now < record.resetAt.getTime()) {
        if (record.count >= MAX_ATTEMPTS) {
          return {
            error: "Too many login attempts. Please try again later.",
          };
        }
        await prisma.rateLimit.update({
          where: { ip },
          data: { count: record.count + 1 },
        });
      } else {
        await prisma.rateLimit.update({
          where: { ip },
          data: { count: 1, resetAt: new Date(now + WINDOW_MS) },
        });
      }
    } else {
      await prisma.rateLimit.create({
        data: { ip, count: 1, resetAt: new Date(now + WINDOW_MS) },
      });
    }
  } catch (err) {
    // Fail open: allow login on Prisma errors, but log the issue
    console.error("[rateLimit] Prisma error:", err);
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
