import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import Fastify from "fastify";
import autoload from "@fastify/autoload";
import {
  fastifyZodOpenApiPlugin,
  serializerCompiler,
  validatorCompiler,
} from "fastify-zod-openapi";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function build() {
  const app = Fastify({ logger: true });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  await app.register(fastifyZodOpenApiPlugin);

  // 1. Global plugins — decorators visible in routes/
  await app.register(autoload, {
    dir: join(__dirname, "plugins"),
    encapsulate: false,
  });

  // 2. Routes — folder name → URL prefix, _id → :id
  await app.register(autoload, {
    dir: join(__dirname, "routes"),
    routeParams: true,
    autoHooks: true,
    cascadeHooks: true,
  });

  return app;
}

const app = await build();
const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || "0.0.0.0";

try {
  await app.listen({ port, host });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
