import fp from "fastify-plugin";
import rateLimit from "@fastify/rate-limit";

export default fp(async (app) => {
  // globalny, wysoki limit; konkretne trasy nadpisują per-route config
  await app.register(rateLimit, {
    global: false,
    max: 1000,
    timeWindow: "1m",
  });
});
