import { z } from "zod/v4";

export const AccountSchema = z.object({
  id: z.string().uuid(),
  customerId: z.string().uuid().meta({ example: "11111111-1111-4111-8111-111111111101" }),
  iban: z.string().meta({ example: "PL61109010140000071219812874" }),
  currency: z.enum(["PLN", "EUR", "USD"]).default("PLN"),
  balance: z.number().nonnegative().meta({ example: 1500.5 }),
  status: z.enum(["active", "frozen"]).default("active"),
  createdAt: z.string().datetime(),
});

export const CreateAccountSchema = AccountSchema.omit({
  id: true,
  createdAt: true,
  status: true,
});

export type Account = z.infer<typeof AccountSchema>;
