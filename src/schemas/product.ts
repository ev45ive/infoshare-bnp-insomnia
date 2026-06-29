import { z } from "zod/v4";

export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().meta({ example: "Konto Osobiste" }),
  type: z.enum(["account", "card", "deposit"]),
  monthlyFee: z.number().nonnegative().meta({ example: 0 }),
  currency: z.enum(["PLN", "EUR", "USD"]).default("PLN"),
});

export type Product = z.infer<typeof ProductSchema>;
