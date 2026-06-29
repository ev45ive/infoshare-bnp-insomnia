import type { FastifyInstance } from "fastify";
import { db } from "../../../db.ts";
import { handleGetOne } from "../../../rest-helpers.ts";

const txs = db.transactions.map;

export default async function (app: FastifyInstance) {
  app.get("/", async (req, reply) =>
    reply.send(await handleGetOne(req, reply, txs)),
  );

  // anulowanie → odwrócenie salda, 422 gdy już anulowana
  app.post("/cancel", async (req, reply) => {
    const tx = await handleGetOne(req, reply, txs);
    if (tx.status === "cancelled")
      throw reply.unprocessableEntity("Already cancelled");
    const acc = db.accounts.map.get(tx.accountId);
    if (acc) acc.balance += tx.type === "deposit" ? -tx.amount : tx.amount;
    tx.status = "cancelled";
    return tx;
  });
}
