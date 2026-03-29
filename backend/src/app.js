import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import apiRoutes from "./routes/index.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { swaggerSpec } from "./config/swagger.js";
import { apiRateLimiter } from "./middleware/rateLimiter.js";
import { errorMiddleware, notFoundMiddleware } from "./middleware/errorMiddleware.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(apiRateLimiter);

app.use(
  morgan("dev", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "axonova-backend" });
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", apiRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
