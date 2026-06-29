import type { FastifyInstance } from "fastify";

// v1 — przestarzała: dorzuca nagłówki Deprecation/Sunset/Warning
export default async function (app: FastifyInstance) {
  app.addHook("onSend", async (_req, reply, payload) => {
    reply.header("Deprecation", "true");
    reply.header("Sunset", "2026-12-31");
    reply.header("Warning", '299 - "API v1 is deprecated, migrate to /v2"');
    reply.header("Link", '</v2/customers>; rel="successor-version"');
    return payload;
  });
}
