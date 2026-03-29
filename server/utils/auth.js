import jwt from "jsonwebtoken";

export function signToken(user) {
  const secret = process.env.JWT_SECRET || "dev-secret-change-me";
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
    },
    secret,
    { expiresIn: "7d" }
  );
}

export function verifyToken(token) {
  const secret = process.env.JWT_SECRET || "dev-secret-change-me";
  return jwt.verify(token, secret);
}
