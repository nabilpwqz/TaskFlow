import { NextRequest, NextResponse } from "next/server";
import { DataStore } from "@/server/db/store";
import { getAuthFromRequest } from "@/server/auth/session";
import { z } from "zod";

const CreateOrderSchema = z.object({
  serviceId: z.string().min(1, "Service ID is required"),
  packageId: z.enum(["basic", "standard", "premium"]).default("basic"),
  requirements: z.string().optional(),
});

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { user } = await getAuthFromRequest(req);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const roleParam = searchParams.get("role") || undefined;
    const status = searchParams.get("status") || undefined;

    // Filter by authenticated user
    const orders = await DataStore.getOrders({
      userId: user.role === "admin" && searchParams.get("all") ? undefined : user._id,
      role: roleParam,
      status,
    });

    return NextResponse.json({
      success: true,
      data: orders,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user } = await getAuthFromRequest(req);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = CreateOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message || "Invalid payload" },
        { status: 400 }
      );
    }

    const service = await DataStore.getServiceBySlug(parsed.data.serviceId);
    if (!service) {
      return NextResponse.json({ success: false, error: "Service not found" }, { status: 404 });
    }

    // Business rule: Prevent purchasing own service
    if (service.sellerId === user._id) {
      return NextResponse.json(
        { success: false, error: "You cannot purchase your own service" },
        { status: 400 }
      );
    }

    const order = await DataStore.createOrder({
      clientId: user._id,
      serviceId: service._id,
      packageId: parsed.data.packageId,
      requirements: parsed.data.requirements,
    });

    return NextResponse.json({
      success: true,
      data: order,
      message: "Order placed successfully! Project activated.",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
