import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { DataStore } from "@/server/db/store";
import { verifyPassword } from "@/server/auth/password";
import { signToken } from "@/server/auth/jwt";
import { COOKIE_NAME } from "@/lib/constants";

const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message || "Invalid credentials" },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const userWithHash = await DataStore.findUserByEmail(email);

    if (!userWithHash) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (userWithHash.status === "suspended") {
      return NextResponse.json(
        { success: false, error: "Your account has been suspended. Please contact platform support." },
        { status: 403 }
      );
    }

    const isValid = await verifyPassword(password, userWithHash.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = signToken({
      userId: userWithHash._id,
      email: userWithHash.email,
      role: userWithHash.role,
    });

    const { passwordHash, ...safeUser } = userWithHash;

    const res = NextResponse.json({
      success: true,
      data: safeUser,
      token,
      message: "Logged in successfully",
    });

    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return res;
  } catch (error: any) {
    console.error("LOGIN_ERROR_DETAILS:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Authentication error" },
      { status: 500 }
    );
  }
}
