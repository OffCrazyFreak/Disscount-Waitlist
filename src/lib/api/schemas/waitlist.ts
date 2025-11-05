import { z } from "zod";

// Croatian validation schema
export const waitlistSubmissionSchemaCro = z.object({
  name: z
    .string()
    .min(2, "Ime mora sadržavati najmanje 2 znaka")
    .max(50, "Ime može sadržavati najviše 50 znakova")
    .trim(),
  surname: z
    .string()
    .trim()
    .max(50, "Prezime može sadržavati najviše 50 znakova")
    .transform((val) => val || undefined)
    .optional(),
  email: z
    .email("Unesi valjanu email adresu")
    .max(50, "Email može sadržavati najviše 50 znakova")
    .toLowerCase(),
  lang: z.enum(["en", "cro"]),
});

// English validation schema
export const waitlistSubmissionSchemaEn = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters")
    .trim(),
  surname: z
    .string()
    .trim()
    .max(50, "Surname must be at most 50 characters")
    .transform((val) => val || undefined)
    .optional(),
  email: z
    .email("Enter a valid email address")
    .max(50, "Email must be at most 50 characters")
    .toLowerCase(),
  lang: z.enum(["en", "cro"]),
});

// Generic schema for backend (no language-specific messages)
export const waitlistSubmissionSchema = z.object({
  name: z.string().min(2).max(50).trim(),
  surname: z
    .string()
    .trim()
    .max(50)
    .transform((val) => val || undefined)
    .optional(),
  email: z.email().max(50).toLowerCase(),
  lang: z.enum(["en", "cro"]),
});

// Waitlist entry DTO schema (from backend)
export const waitlistEntryDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  surname: z.string().nullable().optional(),
  email: z.email(),
  lang: z.string(),
  createdAt: z.string(),
});

// Waitlist stats schema
export const waitlistStatsSchema = z.object({
  totalCount: z.number().int().min(0),
  lastWeekCount: z.number().int().min(0).optional(),
});

// Type exports
export type WaitlistSubmission = z.infer<typeof waitlistSubmissionSchema>;
export type WaitlistEntryDto = z.infer<typeof waitlistEntryDtoSchema>;
export type WaitlistStats = z.infer<typeof waitlistStatsSchema>;
