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
        name: validatedData.name,
        surname: validatedData.surname || null,
        email: validatedData.email,
        lang: validatedData.lang,
      })
      .returning();

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error("Waitlist error:", error);

    // Detect language from referer or accept-language header
    const referer = request.headers.get("referer") || "";
    const isEnglish = referer.includes("/en");

    const errorCode = (error as any)?.code || (error as any)?.cause?.code;
    const errorMessage = error instanceof Error ? error.message : "";
    const causeMessage = (error as any)?.cause?.message || "";

    if (errorCode === "SQLITE_CONSTRAINT") {
      return NextResponse.json(
        {
          error: isEnglish
            ? "Email address already registered"
            : "Email adresa već zapisana",
        },
        { status: 409 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      {
        error: isEnglish
          ? "An error occurred during registration"
          : "Došlo je do greške pri prijavi",
      },
      { status: 500 }
    );
  }
}
