import app from "./app.js";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";

async function bootstrap() {
  await connectDatabase();

  app.listen(env.port, () => {
    logger.info(`Axonova backend listening on http://localhost:${env.port}`);
  });
}

bootstrap().catch((error) => {
  logger.error(error);
  process.exit(1);
});
