import type { FastifyInstance } from "fastify";

// celowe 500 — do testów obsługi błędów / CI smoke
export default async function (app: FastifyInstance) {
  app.get("/crash", async () => {
    throw new Error("Intentional crash for testing");
  });

  app.get("/echo", async (req) => ({
    method: req.method,
    headers: req.headers,
    query: req.query,
  }));
}
