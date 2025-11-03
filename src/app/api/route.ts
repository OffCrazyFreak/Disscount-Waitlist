import { NextResponse } from "next/server";

// turbopack type checking bug workaround
export async function GET() {
  return NextResponse.json({ status: "ok" });
}
