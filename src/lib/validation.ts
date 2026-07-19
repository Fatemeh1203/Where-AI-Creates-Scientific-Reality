import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  subject: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().min(5).max(5000),
  locale: z.enum(["en", "fa"]).default("en"),
});

export const orderSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  serviceType: z.string().trim().min(2).max(160),
  budgetRange: z.string().trim().max(80).optional().or(z.literal("")),
  timeline: z.string().trim().max(80).optional().or(z.literal("")),
  description: z.string().trim().min(10).max(8000),
  locale: z.enum(["en", "fa"]).default("en"),
  wantsDeposit: z.boolean().default(false),
  depositAmount: z.number().int().positive().max(500000000).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
