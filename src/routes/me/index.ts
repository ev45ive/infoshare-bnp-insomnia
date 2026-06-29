import type { FastifyInstance } from "fastify";
import { db } from "../../db.ts";

export default async function (app: FastifyInstance) {
  // bieżący użytkownik (JWT)
  app.get("/", { onRequest: app.authenticate }, async (req) => {
    const customer = req.user.customerId
      ? db.customers.map.get(req.user.customerId)
      : undefined;
    return {
      username: req.user.username,
      role: req.user.role,
      customerId: req.user.customerId,
      customer,
    };
  });
}
