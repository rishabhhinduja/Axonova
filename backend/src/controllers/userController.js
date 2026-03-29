import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/User.js";

export const getProfileController = asyncHandler(async (req, res) => {
  res.status(200).json({ user: req.user });
});

export const updateProfileController = asyncHandler(async (req, res) => {
  const { name, avatar, preferences } = req.validated.body;
  const next = await User.findByIdAndUpdate(
    req.user._id,
    {
      ...(name ? { name } : {}),
      ...(typeof avatar !== "undefined" ? { avatar } : {}),
      ...(preferences ? { preferences: { ...req.user.preferences, ...preferences } } : {}),
    },
    { new: true }
  ).select("-password");

  res.status(200).json({ user: next });
});
