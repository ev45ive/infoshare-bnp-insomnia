import type { FastifyInstance } from "fastify";
import { db } from "../../../db.ts";

// v2 — rozdzielone firstName/lastName + koperta z paginacją
export default async function (app: FastifyInstance) {
  app.get("/", { schema: { tags: ["v2"], summary: "Klienci (v2)" } }, async () => {
    const data = db.customers.values().map((c) => ({
      id: c.id,
      firstName: c.firstName,
      lastName: c.lastName,
      email: c.email,
      status: c.status,
    }));
    return { data, total: data.length, version: "v2" };
  });
}
