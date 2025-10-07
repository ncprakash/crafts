import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // adjust path

export async function GET(
  req: Request,
   { params }: { params: any }) {
    const { orderItemId } = params;

  try {
    const orderItems = await db.orderItem.findMany({
      where: { orderId: orderItemId },
      select: {
        imageUrls: true,
        phoneType: true,
        product: {
          select: {
            name: true,
            category: { select: { name: true } },
          },
        },
      },
    });

    return NextResponse.json(orderItems);
  } catch (err) {
    console.error("Failed to fetch order items:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
