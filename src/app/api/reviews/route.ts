import { NextRequest, NextResponse } from "next/server";
import { DataStore } from "@/server/db/store";
import { getAuthFromRequest } from "@/server/auth/session";
import { z } from "zod";

const CreateReviewSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  rating: z.number().min(1).max(5),
  comment: z.string().min(5, "Review comment must be at least 5 characters"),
});

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const serviceId = searchParams.get("serviceId") || undefined;
    const freelancerId = searchParams.get("freelancerId") || undefined;

    const reviews = await DataStore.getReviews({ serviceId, freelancerId });
    return NextResponse.json({ success: true, data: reviews });
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
    const parsed = CreateReviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const order = await DataStore.getOrderById(parsed.data.orderId);
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    // Business rule: Only the buyer can review
    if (order.clientId !== user._id) {
      return NextResponse.json(
        { success: false, error: "Only the verified buyer of this order can submit a review" },
        { status: 403 }
      );
    }

    // Business rule: Must be completed
    if (order.status !== "COMPLETED") {
      return NextResponse.json(
        { success: false, error: "You can only review completed orders" },
        { status: 400 }
      );
    }

    const review = await DataStore.createReview({
      orderId: order._id,
      clientId: user._id,
      rating: parsed.data.rating,
      comment: parsed.data.comment,
    });

    return NextResponse.json({
      success: true,
      data: review,
      message: "Thank you! Your verified review has been published.",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
