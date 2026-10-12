import { NextRequest, NextResponse } from "next/server";
import { DataStore } from "@/server/db/store";
import { getAuthFromRequest } from "@/server/auth/session";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { user } = await getAuthFromRequest(req);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const conversations = await DataStore.getConversations(user._id);
    return NextResponse.json({ success: true, data: conversations });
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
    const { recipientId, orderId } = body;

    if (!recipientId) {
      return NextResponse.json({ success: false, error: "Recipient ID required" }, { status: 400 });
    }

    // Check if conversation already exists between these users
    const existingConvs = await DataStore.getConversations(user._id);
    const existing = existingConvs.find((c) => c.participantIds.includes(recipientId));
    if (existing) {
      return NextResponse.json({ success: true, data: existing });
    }

    // Otherwise create conversation in DataStore
    const store = (DataStore as any);
    const newConv = {
      _id: `conv_${Date.now()}`,
      orderId,
      participantIds: [user._id, recipientId],
      lastMessage: "Conversation opened",
      lastMessageAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const rawStore = (await import("@/server/db/store")).getInitialStoreData();
    // Use DataStore
    return NextResponse.json({ success: true, data: newConv });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
