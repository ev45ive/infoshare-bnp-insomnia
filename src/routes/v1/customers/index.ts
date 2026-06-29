import type { FastifyInstance } from "fastify";
import { db } from "../../../db.ts";

// v1 — pełne imię w jednym polu (stary kontrakt)
export default async function (app: FastifyInstance) {
  app.get("/", { schema: { tags: ["v1"], summary: "Klienci (v1, deprecated)" } }, async () => {
    const data = db.customers.values().map((c) => ({
      id: c.id,
      name: `${c.firstName} ${c.lastName}`,
      email: c.email,
    }));
    return { data, total: data.length };
  });
}
