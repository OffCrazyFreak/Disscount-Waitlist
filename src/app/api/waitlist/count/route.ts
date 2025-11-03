import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { waitlist } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(waitlist);

    const totalCount = result[0]?.count ?? 0;

    return NextResponse.json({ totalCount });
  } catch (error) {
    console.error("Error fetching waitlist stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
