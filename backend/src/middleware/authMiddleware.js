import User from "../models/User.js";
import { verifyAccessToken } from "../utils/tokenUtils.js";
import { ApiError } from "../utils/ApiError.js";

export async function requireAuth(req, _res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return next(new ApiError(401, "Authentication required"));
  }

  try {
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub).select("-password");

    if (!user) {
      return next(new ApiError(401, "User no longer exists"));
    }

    req.user = user;
    return next();
  } catch {
    return next(new ApiError(401, "Invalid or expired access token"));
  }
}

export function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, "Insufficient permissions"));
    }

    return next();
  };
}
