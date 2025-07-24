import { NextResponse } from "next/server";

export const runtime = "edge"; // optional for speed

export async function GET() {
  // call your existing sync logic here or just proxy the main /sync route
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/rss/sync`);
  if (!res.ok) return NextResponse.json({ error: "Failed to sync" }, { status: 500 });
  return NextResponse.json({ status: "success" });
}
