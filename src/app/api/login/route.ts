import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = formData.get("password") as string;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
  }

  if (password !== adminPassword) {
    return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set("session", "valid", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  return NextResponse.json({ success: true });
}
