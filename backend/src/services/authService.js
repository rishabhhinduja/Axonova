import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import {
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/tokenUtils.js";
import { env } from "../config/env.js";

const googleClient = new OAuth2Client(env.googleClientId);

function buildAuthPayload(user, accessToken, refreshToken) {
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      preferences: user.preferences,
    },
    tokens: {
      accessToken,
      refreshToken,
    },
  };
}

async function persistRefreshToken(user, refreshToken) {
  const payload = verifyRefreshToken(refreshToken);
  const expiresAt = new Date(payload.exp * 1000);
  user.refreshTokens.push({
    tokenHash: hashToken(refreshToken),
    expiresAt,
  });
  user.refreshTokens = user.refreshTokens.filter((item) => item.expiresAt > new Date());
  await user.save();
}

export async function signup({ name, email, password }) {
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new ApiError(409, "Email already in use");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: passwordHash,
  });

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  await persistRefreshToken(user, refreshToken);

  return buildAuthPayload(user, accessToken, refreshToken);
}

export async function login({ email, password }) {
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user || !user.password) {
    throw new ApiError(401, "Invalid credentials");
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  await persistRefreshToken(user, refreshToken);

  return buildAuthPayload(user, accessToken, refreshToken);
}

export async function loginWithGoogle(idToken) {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: env.googleClientId,
  });

  const payload = ticket.getPayload();
  if (!payload?.email) {
    throw new ApiError(401, "Google token verification failed");
  }

  let user = await User.findOne({ email: payload.email.toLowerCase() });

  if (!user) {
    user = await User.create({
      name: payload.name || payload.email.split("@")[0],
      email: payload.email.toLowerCase(),
      googleId: payload.sub,
      avatar: payload.picture || null,
      password: null,
    });
  } else if (!user.googleId) {
    user.googleId = payload.sub;
    if (!user.avatar && payload.picture) {
      user.avatar = payload.picture;
    }
    await user.save();
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  await persistRefreshToken(user, refreshToken);

  return buildAuthPayload(user, accessToken, refreshToken);
}

export async function refreshAuthToken(refreshToken) {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new ApiError(401, "Invalid refresh token");
  }

  const user = await User.findById(payload.sub);
  if (!user) {
    throw new ApiError(401, "User no longer exists");
  }

  const incomingHash = hashToken(refreshToken);
  const tokenRecord = user.refreshTokens.find((item) => item.tokenHash === incomingHash);

  if (!tokenRecord || tokenRecord.expiresAt <= new Date()) {
    throw new ApiError(401, "Refresh token expired or revoked");
  }

  user.refreshTokens = user.refreshTokens.filter((item) => item.tokenHash !== incomingHash);

  const nextAccessToken = signAccessToken(user);
  const nextRefreshToken = signRefreshToken(user);

  await persistRefreshToken(user, nextRefreshToken);

  return {
    accessToken: nextAccessToken,
    refreshToken: nextRefreshToken,
  };
}

export async function logout(userId, refreshToken) {
  const user = await User.findById(userId);
  if (!user) {
    return;
  }

  if (refreshToken) {
    const tokenHash = hashToken(refreshToken);
    user.refreshTokens = user.refreshTokens.filter((item) => item.tokenHash !== tokenHash);
  } else {
    user.refreshTokens = [];
  }

  await user.save();
}
