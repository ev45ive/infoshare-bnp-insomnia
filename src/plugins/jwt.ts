import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import type { FastifyReply, FastifyRequest } from "fastify";

export interface TokenPayload {
  sub: string;
  username: string;
  role: "admin" | "manager" | "user";
  customerId?: string;
}

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
    authorize: (
      ...roles: TokenPayload["role"][]
    ) => (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: TokenPayload;
    user: TokenPayload;
  }
}

export default fp(async (app) => {
  await app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET ?? "insobank-workshop-secret",
  });

  app.decorate("authenticate", async (req, reply) => {
    try {
      await req.jwtVerify();
    } catch {
      throw reply.unauthorized("Missing or invalid token");
    }
  });

  app.decorate("authorize", (...roles) => async (req, reply) => {
    await app.authenticate(req, reply);
    if (!roles.includes(req.user.role)) {
      throw reply.forbidden(`Requires role: ${roles.join(", ")}`);
    }
  });
});
