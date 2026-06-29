import fp from "fastify-plugin";
import cors from "@fastify/cors";

export default fp(async (app) => {
  const origins = (process.env.CORS_ORIGINS ?? "").split(",").filter(Boolean);
  await app.register(cors, {
    origin: origins.length > 0 ? origins : true,
    credentials: true,
  });
});
