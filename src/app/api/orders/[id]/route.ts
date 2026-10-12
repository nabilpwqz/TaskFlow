import { NextRequest, NextResponse } from "next/server";
import { DataStore } from "@/server/db/store";
import { getAuthFromRequest } from "@/server/auth/session";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user } = await getAuthFromRequest(req);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const order = await DataStore.getOrderById(params.id);
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    // Authorization check: Only client, freelancer, or admin
    if (order.clientId !== user._id && order.freelancerId !== user._id && user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden: Not your order" }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user } = await getAuthFromRequest(req);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const order = await DataStore.getOrderById(params.id);
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    const isClient = order.clientId === user._id;
    const isFreelancer = order.freelancerId === user._id;
    const isAdmin = user.role === "admin";

    if (!isClient && !isFreelancer && !isAdmin) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { action, deliveryMessage, deliveryFiles, revisionFeedback } = body;

    // Transition 1: Freelancer submits deliverable
    if (action === "deliver") {
      if (!isFreelancer && !isAdmin) {
        return NextResponse.json({ success: false, error: "Only the freelancer can submit deliveries" }, { status: 403 });
      }
      if (order.status !== "IN_PROGRESS" && order.status !== "REVISION_REQUESTED") {
        return NextResponse.json({ success: false, error: "Order is not currently active for delivery" }, { status: 400 });
      }

      const updated = await DataStore.updateOrderStatus(order._id, "DELIVERED", {
        delivery: {
          message: deliveryMessage || "Work deliverable submitted for review.",
          files: deliveryFiles || [{ name: "Project_Deliverable_v1.zip", url: "#", size: "3.5 MB" }],
        },
      });
      return NextResponse.json({ success: true, data: updated, message: "Work delivered successfully" });
    }

    // Transition 2: Client requests revision
    if (action === "request_revision") {
      if (!isClient && !isAdmin) {
        return NextResponse.json({ success: false, error: "Only the client can request revisions" }, { status: 403 });
      }
      if (order.status !== "DELIVERED") {
        return NextResponse.json({ success: false, error: "Revisions can only be requested after work is delivered" }, { status: 400 });
      }

      const updated = await DataStore.updateOrderStatus(order._id, "REVISION_REQUESTED", {
        revisionFeedback: revisionFeedback || "Please review the feedback notes and update.",
      });
      return NextResponse.json({ success: true, data: updated, message: "Revision requested" });
    }

    // Transition 3: Client approves and completes order
    if (action === "complete") {
      if (!isClient && !isAdmin) {
        return NextResponse.json({ success: false, error: "Only the client can approve and complete an order" }, { status: 403 });
      }
      if (order.status !== "DELIVERED" && order.status !== "IN_PROGRESS") {
        return NextResponse.json({ success: false, error: "Cannot complete an order in current status" }, { status: 400 });
      }

      const updated = await DataStore.updateOrderStatus(order._id, "COMPLETED");
      return NextResponse.json({ success: true, data: updated, message: "Order completed and approved! Funds released to freelancer." });
    }

    // Transition 4: Cancellation
    if (action === "cancel") {
      if (order.status === "COMPLETED") {
        return NextResponse.json({ success: false, error: "Cannot cancel an already completed order" }, { status: 400 });
      }

      const updated = await DataStore.updateOrderStatus(order._id, "CANCELLED");
      return NextResponse.json({ success: true, data: updated, message: "Order cancelled" });
    }

    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
