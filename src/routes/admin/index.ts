import type { FastifyInstance } from "fastify";
import { db, resetDb } from "../../db.ts";

export default async function (app: FastifyInstance) {
  // reset stanu — tylko admin → 403 dla pozostałych
  app.post(
    "/reset",
    { onRequest: app.authorize("admin") },
    async () => {
      resetDb();
      return {
        message: "Database reset",
        customers: db.customers.values().length,
        accounts: db.accounts.values().length,
      };
    },
  );
}
