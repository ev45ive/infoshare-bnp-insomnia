import fp from "fastify-plugin";
import basicAuth from "@fastify/basic-auth";
import { db } from "../db.ts";

export default fp(async (app) => {
  await app.register(basicAuth, {
    authenticate: { realm: "InsoBank" },
    validate: async (username, password, _req, _reply) => {
      const user = db.users
        .values()
        .find((u) => u.username === username && u.password === password);
      if (!user) throw app.httpErrors.unauthorized("Invalid credentials");
    },
  });
});
