import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const ADMIN_TOKEN_COOKIE = "admin_token";
const ADMIN_TOKEN_EXPIRY_SECONDS = 60 * 60 * 24 * 7;

type AdminTokenPayload = {
  userId: number;
  email: string;
  role: "ADMIN";
};

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return secret;
}

export function signAdminToken(payload: AdminTokenPayload): string {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: ADMIN_TOKEN_EXPIRY_SECONDS,
  });
}

export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret());

    if (
      typeof decoded === "object" &&
      decoded &&
      decoded.role === "ADMIN" &&
      typeof decoded.userId === "number" &&
      typeof decoded.email === "string"
    ) {
      return decoded as AdminTokenPayload;
    }

    return null;
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_TOKEN_COOKIE)?.value;

  if (!token) {
    return null;
  }

  return verifyAdminToken(token);
}

export const adminAuthCookie = {
  name: ADMIN_TOKEN_COOKIE,
  maxAge: ADMIN_TOKEN_EXPIRY_SECONDS,
};
