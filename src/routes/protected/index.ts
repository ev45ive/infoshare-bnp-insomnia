import type { FastifyInstance } from "fastify";
import { db } from "../../db.ts";

export default async function (app: FastifyInstance) {
  // tylko admin — w przeciwnym razie 403
  app.get(
    "/report",
    { onRequest: app.authorize("admin") },
    async () => ({
      generatedBy: "admin",
      customers: db.customers.values().length,
      users: db.users.values().length,
      timestamp: new Date().toISOString(),
    }),
  );

  // demo Basic Auth — wymaga nagłówka Authorization: Basic
  app.get(
    "/basic",
    { onRequest: app.basicAuth },
    async (req) => ({ message: "Basic auth OK", user: (req.headers.authorization ?? "").slice(0, 16) }),
  );
}
