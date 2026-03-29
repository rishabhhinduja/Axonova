import { asyncHandler } from "../utils/asyncHandler.js";
import {
  login,
  loginWithGoogle,
  logout,
  refreshAuthToken,
  signup,
} from "../services/authService.js";

export const signupController = asyncHandler(async (req, res) => {
  const payload = await signup(req.validated.body);
  res.status(201).json(payload);
});

export const loginController = asyncHandler(async (req, res) => {
  const payload = await login(req.validated.body);
  res.status(200).json(payload);
});

export const googleAuthController = asyncHandler(async (req, res) => {
  const payload = await loginWithGoogle(req.validated.body.idToken);
  res.status(200).json(payload);
});

export const refreshController = asyncHandler(async (req, res) => {
  const payload = await refreshAuthToken(req.validated.body.refreshToken);
  res.status(200).json({ tokens: payload });
});

export const logoutController = asyncHandler(async (req, res) => {
  const refreshToken = req.body?.refreshToken;
  await logout(req.user._id, refreshToken);
  res.status(200).json({ message: "Logged out successfully" });
});
