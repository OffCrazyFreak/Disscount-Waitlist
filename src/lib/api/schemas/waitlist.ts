import { z } from "zod";

// Waitlist submission request schema
export const waitlistSubmissionSchema = z.object({
  email: z.email("Unesi valjanu email adresu").toLowerCase(),
});

// Waitlist entry DTO schema (from backend)
export const waitlistEntryDtoSchema = z.object({
  id: z.string(),
  email: z.email(),
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
