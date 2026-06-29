import type { FastifyInstance } from "fastify";
import { z } from "zod/v4";
import { db } from "../../db.ts";
import { BranchSchema } from "../../schemas/branch.ts";

export default async function (app: FastifyInstance) {
  app.get(
    "/",
    { schema: { tags: ["branches"], summary: "Lista oddziałów", response: { 200: z.object({ data: z.array(BranchSchema), total: z.number() }) } } },
    async () => {
      const data = db.branches.values();
      return { data, total: data.length };
    },
  );
}
