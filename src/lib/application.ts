import { z } from "zod";

export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[0-9][0-9\s-]{6,19}$/, { message: "Enter a valid phone number" });

export const applicationSchema = z
  .object({
    tier: z.enum(["student", "professional", "vip"], {
      errorMap: () => ({ message: "Choose a ticket" }),
    }),
    fullName: z
      .string()
      .trim()
      .min(2, { message: "Enter your full name" })
      .max(100, { message: "Name must be under 100 characters" }),
    email: z
      .string()
      .trim()
      .email({ message: "Enter a valid email" })
      .max(255, { message: "Email must be under 255 characters" }),
    phone: phoneSchema,
    organization: z
      .string()
      .trim()
      .min(2, { message: "Enter your company or school" })
      .max(120, { message: "Must be under 120 characters" }),
    paymentMethod: z.enum(["card", "paypal", "bank"], {
      errorMap: () => ({ message: "Choose a payment method" }),
    }),
    cardName: z.string().trim().max(100),
    cardNumber: z.string(),
    cardExpiry: z.string(),
    cardCvc: z.string(),
    paypalEmail: z.string().trim().max(255),
    agreeToConduct: z.boolean(),
  })
  .superRefine((v, ctx) => {
    if (v.paymentMethod === "card") {
      if (v.cardName.length < 2)
        ctx.addIssue({ code: "custom", path: ["cardName"], message: "Enter the name on the card" });
      if (!/^\d{16}$/.test(v.cardNumber.replace(/\s/g, "")))
        ctx.addIssue({ code: "custom", path: ["cardNumber"], message: "Card number must be 16 digits" });
      const m = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(v.cardExpiry);
      if (!m) {
        ctx.addIssue({ code: "custom", path: ["cardExpiry"], message: "Use MM/YY" });
      } else {
        const exp = new Date(2000 + Number(m[2]), Number(m[1]), 1);
        if (exp <= new Date())
          ctx.addIssue({ code: "custom", path: ["cardExpiry"], message: "Card has expired" });
      }
      if (!/^\d{3,4}$/.test(v.cardCvc))
        ctx.addIssue({ code: "custom", path: ["cardCvc"], message: "3 or 4 digits" });
    }
    if (v.paymentMethod === "paypal" && !z.string().email().safeParse(v.paypalEmail).success) {
      ctx.addIssue({ code: "custom", path: ["paypalEmail"], message: "Enter your PayPal email" });
    }
    if (!v.agreeToConduct) {
      ctx.addIssue({
        code: "custom",
        path: ["agreeToConduct"],
        message: "You must agree to the Code of Conduct",
      });
    }
  });

export type ApplicationInput = {
  tier: "" | "student" | "professional" | "vip";
  fullName: string;
  email: string;
  phone: string;
  organization: string;
  paymentMethod: "" | "card" | "paypal" | "bank";
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  paypalEmail: string;
  agreeToConduct: boolean;
};

export function validateApplication(input: ApplicationInput) {
  const result = applicationSchema.safeParse(input);
  const errors: Partial<Record<keyof ApplicationInput, string>> = {};
  if (!result.success) {
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof ApplicationInput;
      if (!errors[key]) errors[key] = issue.message;
    }
  }
  return { valid: result.success, errors };
}

export const contactSchema = z.object({
  email: z.string().trim().email({ message: "Enter a valid email" }).max(255),
  phone: phoneSchema,
});
