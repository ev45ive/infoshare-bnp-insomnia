import type { FastifyInstance } from "fastify";
import { z } from "zod/v4";
import { db } from "../../db.ts";
import { ExchangeRateSchema } from "../../schemas/exchange-rate.ts";

export default async function (app: FastifyInstance) {
  app.get(
    "/",
    { schema: { tags: ["exchange-rates"], summary: "Kursy walut", response: { 200: z.object({ data: z.array(ExchangeRateSchema), total: z.number() }) } } },
    async () => {
      const data = db.exchangeRates.values();
      return { data, total: data.length };
    },
  );
}
