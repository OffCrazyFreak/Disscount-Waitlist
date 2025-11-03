import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { waitlist } from "@/lib/db/schema";
import { waitlistSubmissionSchema } from "@/lib/api/schemas/waitlist";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate with Zod
    const validatedData = waitlistSubmissionSchema.parse(body);

    // Insert into database (will fail if email already exists due to unique constraint)
    const [entry] = await db
      .insert(waitlist)
      .values({
        email: validatedData.email,
      })
      .returning();

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    // Check for unique constraint violation
    if (error instanceof Error && error.message.includes("UNIQUE")) {
      return NextResponse.json(
        { error: "Email adresa već zapisana" },
        { status: 409 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Došlo je do greške pri prijavi" },
      { status: 500 }
    );
  }
}
