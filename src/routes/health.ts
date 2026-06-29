import type { FastifyInstance } from "fastify";
import { db } from "../db.ts";

export default async function (app: FastifyInstance) {
  app.get("/health", async () => ({
    status: "ok",
    version: "1.0.0",
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  }));

  app.get("/health/detailed", async () => ({
    status: "ok",
    version: "1.0.0",
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage().rss,
    node: process.version,
    counts: {
      customers: db.customers.values().length,
      accounts: db.accounts.values().length,
      transactions: db.transactions.values().length,
    },
  }));
}
