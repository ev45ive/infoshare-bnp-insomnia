import type { FastifyInstance } from "fastify";
import { z } from "zod/v4";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../db.ts";
import {
  TransactionSchema,
  CreateTransactionSchema,
} from "../../schemas/transaction.ts";
import {
  handleGetAll,
  setPaginationHeaders,
  toEnvelope,
} from "../../rest-helpers.ts";
import type { Transaction } from "../../schemas/transaction.ts";

const txs = db.transactions.map;

export default async function (app: FastifyInstance) {
  app.get(
    "/",
    {
      schema: {
        tags: ["transactions"],
        summary: "Lista transakcji",
        response: {
          200: z.object({
            data: z.array(TransactionSchema),
            total: z.number(),
            page: z.number(),
            limit: z.number(),
            pages: z.number(),
          }),
        },
      },
    },
    async (req, reply) => {
      const result = await handleGetAll(req, reply, txs);
      setPaginationHeaders(reply, result);
      return reply.send(toEnvelope(result));
    },
  );

  // księgowanie z walidacją salda → 422 przy braku środków/zamrożeniu
  app.post(
    "/",
    { schema: { tags: ["transactions"], summary: "Zaksięguj wpłatę/wypłatę", body: CreateTransactionSchema, response: { 201: TransactionSchema } }, config: { rateLimit: { max: 5, timeWindow: "1m" } } },
    async (req, reply) => {
    const body = (req.body ?? {}) as {
      accountId?: string;
      type?: "deposit" | "withdrawal";
      amount?: number;
      currency?: "PLN" | "EUR" | "USD";
    };
    const acc = body.accountId ? db.accounts.map.get(body.accountId) : undefined;
    if (!acc) throw reply.notFound("Account not found");
    if (acc.status === "frozen")
      throw reply.unprocessableEntity("Account is frozen");
    const amount = Number(body.amount);
    if (!(amount > 0)) throw reply.unprocessableEntity("Amount must be > 0");
    if (body.type === "withdrawal" && acc.balance < amount)
      throw reply.unprocessableEntity("Insufficient funds");

    acc.balance += body.type === "deposit" ? amount : -amount;
    const tx: Transaction = {
      id: uuidv4(),
      accountId: acc.id,
      type: body.type ?? "deposit",
      amount,
      currency: body.currency ?? acc.currency,
      status: "completed",
      createdAt: new Date().toISOString(),
    };
    txs.set(tx.id, tx);
    return reply.code(201).send(tx);
  },
  );
}
