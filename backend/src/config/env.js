import dotenv from "dotenv";

dotenv.config();

const requiredVars = [
  "MONGODB_URI",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "GOOGLE_CLIENT_ID",
];

if (process.env.NODE_ENV === "production") {
  const missing = requiredVars.filter((name) => !process.env[name]);
  if (missing.length) {
    throw new Error(`Missing required env vars: ${missing.join(", ")}`);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 4001),
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/axonova_ai",
  accessTokenSecret: process.env.JWT_ACCESS_SECRET || "dev-access-secret",
  refreshTokenSecret: process.env.JWT_REFRESH_SECRET || "dev-refresh-secret",
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:8082",
};
