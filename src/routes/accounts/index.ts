import type { FastifyInstance } from "fastify";
import { db } from "../../db.ts";
import { AccountSchema, CreateAccountSchema } from "../../schemas/account.ts";
import {
  PaginationQuerySchema,
  paginationEnvelope,
} from "../../schemas/pagination.ts";
import {
  handleCreate,
  handleGetAll,
  setPaginationHeaders,
  toEnvelope,
} from "../../rest-helpers.ts";

const accounts = db.accounts.map;

export default async function (app: FastifyInstance) {
  app.get(
    "/",
    {
      schema: {
        tags: ["accounts"],
        summary: "Lista kont (koperta + paginacja)",
        querystring: PaginationQuerySchema,
        response: {
          200: paginationEnvelope(AccountSchema),
        },
      },
    },
    async (req, reply) => {
      const result = await handleGetAll(req, reply, accounts);
      setPaginationHeaders(reply, result);
      return reply.send(toEnvelope(result));
    },
  );

  app.post(
    "/",
    { schema: { tags: ["accounts"], summary: "Utwórz konto", body: CreateAccountSchema, response: { 201: AccountSchema } } },
    async (req, reply) => {
      const created = await handleCreate(req, reply, accounts);
      return reply.code(201).send(created);
    },
  );
}
