import fp from "fastify-plugin";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { fastifyZodOpenApiTransformers } from "fastify-zod-openapi";

export default fp(async (app) => {
  await app.register(swagger, {
    openapi: {
      openapi: "3.1.0",
      info: { title: "InsoBank Demo API", version: "1.0.0" },
      servers: [{ url: "http://localhost:3000" }],
    },
    ...fastifyZodOpenApiTransformers,
  });

  await app.register(swaggerUi, { routePrefix: "/docs" });

  // alias zgodny z planem (Etap 5)
  app.get("/openapi.json", async () => app.swagger());
});
