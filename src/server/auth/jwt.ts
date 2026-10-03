import jwt from "jsonwebtoken";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.trim().length < 32) {
    throw new Error("JWT_SECRET must be configured with at least 32 characters.");
  }

  return secret;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: "client" | "freelancer" | "admin";
}

export function signToken(payload: JwtPayload): string {
  const secret = getJwtSecret();
  try {
    return jwt.sign(payload, secret, { expiresIn: "7d" });
  } catch (err) {
    console.error("Token signing error:", err);
    throw new Error("Failed to sign authentication token");
  }
}

export function verifyToken(token: string): JwtPayload | null {
  if (!token || typeof token !== "string") {
    return null;
  }

  const secret = getJwtSecret();
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch {
    return null;
  }
}
