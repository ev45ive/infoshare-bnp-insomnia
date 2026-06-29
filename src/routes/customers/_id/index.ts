import type { FastifyInstance } from "fastify";
import { z } from "zod/v4";
import { db } from "../../../db.ts";
import {
  CustomerSchema,
  CreateCustomerSchema,
} from "../../../schemas/customer.ts";
import {
  handleDelete,
  handleGetOne,
  handleReplace,
  handleUpdate,
} from "../../../rest-helpers.ts";

const customers = db.customers.map;
const params = z.object({ id: z.string().uuid() });

export default async function (app: FastifyInstance) {
  app.get(
    "/",
    { schema: { tags: ["customers"], summary: "Klient po ID", params, response: { 200: CustomerSchema } } },
    async (req, reply) => reply.send(await handleGetOne(req, reply, customers)),
  );

  app.put(
    "/",
    { schema: { tags: ["customers"], summary: "Zamień klienta", params, body: CreateCustomerSchema, response: { 200: CustomerSchema } } },
    async (req, reply) => reply.send(await handleReplace(req, reply, customers)),
  );

  app.patch(
    "/",
    { schema: { tags: ["customers"], summary: "Aktualizuj klienta", params, body: CreateCustomerSchema.partial(), response: { 200: CustomerSchema } } },
    async (req, reply) => reply.send(await handleUpdate(req, reply, customers)),
  );

  app.delete(
    "/",
    { schema: { tags: ["customers"], summary: "Usuń klienta", params } },
    async (req, reply) => {
      await handleDelete(req, reply, customers);
      return reply.code(204).send();
    },
  );
}
