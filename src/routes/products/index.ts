import type { FastifyInstance } from "fastify";
import { z } from "zod/v4";
import { db } from "../../db.ts";
import { ProductSchema } from "../../schemas/product.ts";

export default async function (app: FastifyInstance) {
  app.get(
    "/",
    { schema: { tags: ["products"], summary: "Lista produktów", response: { 200: z.object({ data: z.array(ProductSchema), total: z.number() }) } } },
    async () => {
      const data = db.products.values();
      return { data, total: data.length };
    },
  );
}
