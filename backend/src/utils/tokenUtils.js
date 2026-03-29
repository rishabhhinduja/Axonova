import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { env } from "../config/env.js";

export function signAccessToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    },
    env.accessTokenSecret,
    { expiresIn: env.accessTokenExpiresIn }
  );
}

export function signRefreshToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      tokenType: "refresh",
    },
    env.refreshTokenSecret,
    { expiresIn: env.refreshTokenExpiresIn }
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.accessTokenSecret);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, env.refreshTokenSecret);
}

export function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
