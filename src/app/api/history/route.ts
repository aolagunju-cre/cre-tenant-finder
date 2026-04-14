import { NextResponse } from "next/server";
import { getSearchHistory } from "@/lib/server/search";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");
  if (!session || session.value !== "valid") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const history = await getSearchHistory();
    return NextResponse.json(history);
  } catch {
    return NextResponse.json([]);
  }
}
