import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { verifyToken, JwtPayload } from "./jwt";
import { COOKIE_NAME } from "@/lib/constants";
import { DataStore } from "@/server/db/store";
import { User } from "@/types";

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload?.userId) return null;

    return await DataStore.findUserById(payload.userId);
  } catch {
    return null;
  }
}

export async function getAuthFromRequest(req: NextRequest): Promise<{ user: User | null; payload: JwtPayload | null }> {
  try {
    let token = req.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      const authHeader = req.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (!token) return { user: null, payload: null };

    const payload = verifyToken(token);
    if (!payload?.userId) return { user: null, payload: null };

    const user = await DataStore.findUserById(payload.userId);
    return { user, payload };
  } catch (err: any) {
    if (err?.digest === "DYNAMIC_SERVER_USAGE" || err?.message?.includes("Dynamic server usage")) {
      throw err;
    }
    console.error("Auth extraction error:", err);
    return { user: null, payload: null };
  }
}
