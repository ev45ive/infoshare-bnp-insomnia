import { z } from "zod/v4";

export const ExchangeRateSchema = z.object({
  id: z.string().uuid(),
  base: z.enum(["PLN", "EUR", "USD"]),
  quote: z.enum(["PLN", "EUR", "USD"]),
  rate: z.number().positive().meta({ example: 4.32 }),
});

export type ExchangeRate = z.infer<typeof ExchangeRateSchema>;
