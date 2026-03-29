import winston from "winston";
import { env } from "./env.js";

const logFormat = winston.format.printf(({ level, message, timestamp, stack }) => {
  if (stack) {
    return `${timestamp} [${level}] ${message}\n${stack}`;
  }
  return `${timestamp} [${level}] ${message}`;
});

export const logger = winston.createLogger({
  level: env.nodeEnv === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    logFormat
  ),
  transports: [new winston.transports.Console()],
});
