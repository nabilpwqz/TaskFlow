import { NextRequest, NextResponse } from "next/server";
import { DataStore } from "@/server/db/store";
import { getAuthFromRequest } from "@/server/auth/session";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const service = await DataStore.getServiceBySlug(params.slug);
    if (!service) {
      return NextResponse.json({ success: false, error: "Service not found" }, { status: 404 });
    }

    const reviews = await DataStore.getReviews({ serviceId: service._id });

    return NextResponse.json({
      success: true,
      data: {
        ...service,
        reviews,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { user } = await getAuthFromRequest(req);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const service = await DataStore.getServiceBySlug(params.slug);
    if (!service) {
      return NextResponse.json({ success: false, error: "Service not found" }, { status: 404 });
    }

    // Ownership or admin check
    if (service.sellerId !== user._id && user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden: Not your service" }, { status: 403 });
    }

    const body = await req.json();
    const updated = await DataStore.updateService(service._id, body);

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Service updated successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { user } = await getAuthFromRequest(req);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const service = await DataStore.getServiceBySlug(params.slug);
    if (!service) {
      return NextResponse.json({ success: false, error: "Service not found" }, { status: 404 });
    }

    if (service.sellerId !== user._id && user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    await DataStore.deleteService(service._id);

    return NextResponse.json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
