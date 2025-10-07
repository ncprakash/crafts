import { NextResponse } from "next/server";
import {db} from "@/lib/db"; // adjust path to your Prisma client

export async function GET(req: Request, { params }: { params: { orderItemId: string } }) {
  const { orderItemId } = params;

  try {
    // Fetch order items by orderId
    const orderItems = await db.orderItem.findMany({
      where: { orderId: orderItemId },
      select: {
        imageUrls: true,
        phoneType: true,
        product: {
          select: {
            name: true,
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!orderItems || orderItems.length === 0) {
      return NextResponse.json({ message: "No items found" }, { status: 404 });
    }

    // If you want to return all items for that order, send the array
    return NextResponse.json(orderItems);
  } catch (err) {
    console.error("Error fetching order items:", err);
    return NextResponse.json({ error: "Failed to fetch order items" }, { status: 500 });
  }
}
