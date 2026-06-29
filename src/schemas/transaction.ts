import { z } from "zod/v4";

export const TransactionSchema = z.object({
  id: z.string().uuid(),
  accountId: z.string().uuid(),
  type: z.enum(["deposit", "withdrawal"]).meta({ example: "deposit" }),
  amount: z.number().positive().meta({ example: 100.0 }),
  currency: z.enum(["PLN", "EUR", "USD"]).default("PLN"),
  status: z.enum(["completed", "cancelled"]).default("completed"),
  createdAt: z.string().datetime(),
}).meta({ id: "Transaction" });

export const CreateTransactionSchema = TransactionSchema.pick({
  accountId: true,
  type: true,
  amount: true,
}).extend({
  currency: z.enum(["PLN", "EUR", "USD"]).default("PLN").optional(),
});

export type Transaction = z.infer<typeof TransactionSchema>;
