import type { FastifyInstance } from "fastify";
import { z } from "zod/v4";
import { db } from "../../db.ts";
import { LoginSchema } from "../../schemas/user.ts";
import type { TokenPayload } from "../../plugins/jwt.ts";

const TokenResponse = z.object({
  access_token: z.string(),
  token_type: z.string(),
});

function tokenFor(app: FastifyInstance, u: TokenPayload) {
  return app.jwt.sign(u, { expiresIn: "1h" });
}

export default async function (app: FastifyInstance) {
  // username/password → JWT
  app.post(
    "/login",
    { schema: { tags: ["auth"], summary: "Login → JWT", body: LoginSchema, response: { 200: TokenResponse } }, config: { rateLimit: { max: 3, timeWindow: "1m" } } },
    async (req, reply) => {
    const { username, password } = (req.body ?? {}) as {
      username?: string;
      password?: string;
    };
    const user = db.users
      .values()
      .find((u) => u.username === username && u.password === password);
    if (!user) throw reply.unauthorized("Invalid username or password");
    const payload: TokenPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      customerId: user.customerId,
    };
    return { access_token: tokenFor(app, payload), token_type: "Bearer" };
  },
  );

  // ważny token → nowy token
  app.post(
    "/refresh",
    { onRequest: app.authenticate },
    async (req) => ({
      access_token: tokenFor(app, req.user),
      token_type: "Bearer",
    }),
  );

  // stateless — klient po prostu kasuje token
  app.post("/logout", async () => ({ message: "Logged out" }));

  // OAuth2 client_credentials stub
  app.post("/oauth/token", async (req, reply) => {
    const body = (req.body ?? {}) as Record<string, string>;
    if (body.grant_type !== "client_credentials") {
      throw reply.badRequest("unsupported_grant_type");
    }
    const payload: TokenPayload = {
      sub: "client",
      username: body.client_id ?? "client",
      role: "user",
    };
    return {
      access_token: tokenFor(app, payload),
      token_type: "Bearer",
      expires_in: 3600,
    };
  });
}
