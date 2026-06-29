import type { FastifyInstance } from "fastify";
import { db } from "../../../../db.ts";

export default async function (app: FastifyInstance) {
  // GET /customers/:id/accounts — konta danego klienta
  app.get("/", { onRequest: app.authenticate }, async (req, reply) => {
    const { id } = req.params as { id: string };
    if (req.user.role !== "admin" && req.user.customerId !== id)
      throw reply.forbidden("Cannot access another customer's accounts");
    if (!db.customers.map.has(id)) throw reply.notFound("Customer not found");
    const data = db.accounts.values().filter((a) => a.customerId === id);
    return { data, total: data.length };
  });
}
