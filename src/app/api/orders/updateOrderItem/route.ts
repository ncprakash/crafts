// app/api/order/updateOrderItem/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderItemId, imageUrls, phoneType } = body;

    console.log("=== API Handler Debug ===");
    console.log("orderItemId:", orderItemId);
    console.log("imageUrls received:", imageUrls);
    console.log("imageUrls type:", typeof imageUrls);

    if (!orderItemId) {
      return NextResponse.json({ error: "Missing orderItemId" }, { status: 400 });
    }

    let imagesArray: string[] | undefined = undefined;
    if (imageUrls) {
      if (typeof imageUrls === "string") {
        try {
          imagesArray = JSON.parse(imageUrls);
        } catch {
          imagesArray = [imageUrls];
        }
      } else if (Array.isArray(imageUrls)) {
        imagesArray = imageUrls;
      }
    }

    console.log("imagesArray after processing:", imagesArray);

    const updatedItem = await db.orderItem.update({
      where: { id: orderItemId },
      data: {
        imageUrls: imagesArray,
        phoneType: phoneType || undefined,
      },
    });

    console.log("Updated item:", updatedItem);
    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Error updating order item:", error);
    return NextResponse.json(
      { error: "Failed to update order item" },
      { status: 500 }
    );
  }
}