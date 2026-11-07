import { NextRequest, NextResponse } from "next/server";
import { adminGuard } from "@/lib/adminAuth";

// Lightweight credential check used by the admin login screen.
export async function GET(req: NextRequest) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  return NextResponse.json({ ok: true });
}
