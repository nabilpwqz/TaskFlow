import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { DataStore } from "@/server/db/store";
import { signToken } from "@/server/auth/jwt";
import { COOKIE_NAME } from "@/lib/constants";

const FirebaseSyncSchema = z.object({
  uid: z.string().min(1, "UID is required"),
  email: z.string().email("Valid email is required"),
  name: z.string().optional(),
  role: z.enum(["client", "freelancer", "admin"]).optional(),
  avatar: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = FirebaseSyncSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message || "Invalid payload" },
        { status: 400 }
      );
    }

    const { uid, email, name, role = "client", avatar } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists in DataStore
    let user = await DataStore.findUserByEmail(normalizedEmail);
    let isNewUser = false;

    if (user) {
      if (user.status === "suspended") {
        return NextResponse.json(
          { success: false, error: "Your account has been suspended. Please contact platform support." },
          { status: 403 }
        );
      }

      // Update avatar if provided and not already custom
      if (avatar && (!user.avatar || user.avatar.includes("dicebear"))) {
        await DataStore.updateUser(user._id, { avatar });
        user.avatar = avatar;
      }
    } else {
      // Create new user linked to this Firebase account
      isNewUser = true;
      const baseName = name && name.trim().length > 0 ? name.trim() : email.split("@")[0];
      const usernameClean = email
        .split("@")[0]
        .replace(/[^a-zA-Z0-9]/g, "")
        .toLowerCase();
      const username = `${usernameClean}${Math.floor(100 + Math.random() * 900)}`;

      const created = await DataStore.createUser({
        name: baseName,
        email: normalizedEmail,
        passwordHash: `firebase:${uid}`,
        role: role as "client" | "freelancer" | "admin",
        username,
      });

      if (avatar) {
        await DataStore.updateUser(created._id, { avatar });
        created.avatar = avatar;
      }

      user = created as any;
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Failed to resolve user account" },
        { status: 500 }
      );
    }

    const token = signToken({
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      username: user.username,
      avatar: user.avatar,
      status: user.status,
      bio: user.bio,
      skills: user.skills,
      hourlyRate: user.hourlyRate,
      rating: user.rating,
      reviewCount: user.reviewCount,
      completedOrders: user.completedOrders,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const res = NextResponse.json({
      success: true,
      data: safeUser,
      token,
      isNewUser,
      message: isNewUser ? "Firebase account registered successfully" : "Logged in successfully via Firebase",
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
    console.error("FIREBASE_AUTH_SYNC_ERROR:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to authenticate with Firebase" },
      { status: 500 }
    );
  }
}
