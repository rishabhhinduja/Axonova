import { ApiError } from "../utils/ApiError.js";
import { logger } from "../config/logger.js";

export function notFoundMiddleware(req, _res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorMiddleware(err, _req, res, _next) {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err instanceof ApiError ? err.message : "Internal server error";

  if (statusCode >= 500) {
    logger.error(err);
  }

  return res.status(statusCode).json({
    message,
    details: err instanceof ApiError ? err.details : undefined,
  });
}
