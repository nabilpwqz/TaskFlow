import { NextRequest, NextResponse } from "next/server";
import { DataStore } from "@/server/db/store";
import { getAuthFromRequest } from "@/server/auth/session";
import { z } from "zod";

const CreateServiceSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  shortDesc: z.string().min(10, "Short description is required"),
  fullDesc: z.string().min(30, "Full description must be detailed"),
  category: z.string().min(2, "Category is required"),
  tags: z.array(z.string()).default([]),
  packages: z.array(
    z.object({
      id: z.enum(["basic", "standard", "premium"]),
      name: z.string(),
      description: z.string(),
      price: z.number().min(5),
      deliveryDays: z.number().min(1),
      revisions: z.number().default(2),
      features: z.array(z.string()).default([]),
    })
  ).min(1, "At least one package is required"),
  coverImage: z.string().url("Valid cover image URL is required"),
  images: z.array(z.string()).default([]),
});

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || undefined;
    const category = searchParams.get("category") || undefined;
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
    const minRating = searchParams.get("minRating") ? Number(searchParams.get("minRating")) : undefined;
    const sellerId = searchParams.get("sellerId") || undefined;
    const status = searchParams.get("status") || undefined;
    const sort = searchParams.get("sort") || undefined;
    const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 12;

    const result = await DataStore.getServices({
      q,
      category,
      minPrice,
      maxPrice,
      minRating,
      sellerId,
      status,
      sort,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: result.items,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
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

    if (user.role !== "freelancer" && user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Only freelancers can publish service listings" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = CreateServiceSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const newService = await DataStore.createService({
      ...parsed.data,
      sellerId: user._id,
    });

    return NextResponse.json({
      success: true,
      data: newService,
      message: "Service published successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
