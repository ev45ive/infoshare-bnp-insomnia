import type { FastifyInstance } from "fastify";
import { z } from "zod/v4";
import { db } from "../../db.ts";
import {
  CustomerSchema,
  CreateCustomerSchema,
} from "../../schemas/customer.ts";
import {
  handleCreate,
  handleGetAll,
  setPaginationHeaders,
  toEnvelope,
} from "../../rest-helpers.ts";

const customers = db.customers.map;

export default async function (app: FastifyInstance) {
  app.get(
    "/",
    {
      schema: {
        tags: ["customers"],
        summary: "Lista klientów (koperta + paginacja)",
        response: {
          200: z.object({
            data: z.array(CustomerSchema),
            total: z.number(),
            page: z.number(),
            limit: z.number(),
            pages: z.number(),
          }),
        },
      },
    },
    async (req, reply) => {
      const result = await handleGetAll(req, reply, customers);
      setPaginationHeaders(reply, result);
      return reply.send(toEnvelope(result));
    },
  );

  app.post(
    "/",
    {
      schema: {
        tags: ["customers"],
        summary: "Utwórz klienta",
        body: CreateCustomerSchema,
        response: { 201: CustomerSchema },
      },
    },
    async (req, reply) => {
      const created = await handleCreate(req, reply, customers);
      return reply.code(201).send(created);
    },
  );
}
