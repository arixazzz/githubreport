import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.NEXTAUTH_SECRET ||
  (process.env.NODE_ENV === "production" ? "" : "dev-secret-only");

if (process.env.NODE_ENV === "production" && !JWT_SECRET) {
  console.warn("⚠️ [Security] NEXTAUTH_SECRET is not defined in production!");
}

export function signJwt(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyJwt(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
