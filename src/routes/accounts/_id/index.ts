import type { FastifyInstance } from "fastify";
import { db } from "../../../db.ts";
import {
  handleDelete,
  handleGetOne,
  handleReplace,
  handleUpdate,
} from "../../../rest-helpers.ts";

const accounts = db.accounts.map;

export default async function (app: FastifyInstance) {
  app.get("/", async (req, reply) =>
    reply.send(await handleGetOne(req, reply, accounts)),
  );

  app.put("/", async (req, reply) =>
    reply.send(await handleReplace(req, reply, accounts)),
  );

  app.patch("/", async (req, reply) =>
    reply.send(await handleUpdate(req, reply, accounts)),
  );

  app.delete("/", async (req, reply) => {
    await handleDelete(req, reply, accounts);
    return reply.code(204).send();
  });

  app.get("/balance", async (req, reply) => {
    const acc = await handleGetOne(req, reply, accounts);
    return { accountId: acc.id, balance: acc.balance, currency: acc.currency };
  });

  app.post("/freeze", async (req, reply) => {
    const acc = await handleGetOne(req, reply, accounts);
    acc.status = "frozen";
    return acc;
  });

  app.post("/unfreeze", async (req, reply) => {
    const acc = await handleGetOne(req, reply, accounts);
    acc.status = "active";
    return acc;
  });
}
