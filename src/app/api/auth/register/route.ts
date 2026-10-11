import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { DataStore } from "@/server/db/store";
import { hashPassword } from "@/server/auth/password";
import { signToken } from "@/server/auth/jwt";
import { COOKIE_NAME } from "@/lib/constants";

const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["client", "freelancer", "admin"]).default("client"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const { name, email, password, role } = parsed.data;

    const existing = await DataStore.findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const username = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "") + Math.floor(100 + Math.random() * 900);
    const passwordHash = await hashPassword(password);

    const user = await DataStore.createUser({
      name,
      email,
      passwordHash,
      role,
      username,
    });

    const token = signToken({
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    const res = NextResponse.json({
      success: true,
      data: user,
      message: "Account created successfully",
    });

    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return res;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create account" },
      { status: 500 }
    );
  }
}
