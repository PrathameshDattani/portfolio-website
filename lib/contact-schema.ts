import { z } from "zod";

export const SUBJECTS = ["Box box", "Collab", "Hiring", "Just saying hi"] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name needs at least 2 characters").max(80, "Name is too long"),
  email: z.string().trim().email("That email doesn't look right"),
  subject: z.enum(SUBJECTS, { message: "Pick a channel" }),
  message: z
    .string()
    .trim()
    .min(10, "Give the pit wall a little more (10+ characters)")
    .max(2000, "Keep it under 2000 characters"),
  /** Honeypot: humans never see or fill this. */
  website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
