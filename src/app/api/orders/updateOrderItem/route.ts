// app/api/order/updateOrderItem/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderItemId, orderId, imageUrls, phoneType } = body;

    console.log("=== Update Order Item ===");
    console.log("orderItemId:", orderItemId);
    console.log("orderId:", orderId);
    console.log("imageUrls:", imageUrls);
    console.log("phoneType:", phoneType);

    if (!orderItemId) {
      return NextResponse.json({ error: "Missing orderItemId" }, { status: 400 });
    }

    // Process imageUrls array
    let imagesArray: string[] = [];
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

    console.log("Processed imagesArray:", imagesArray);

    // Update the order item
    const updatedItem = await db.orderItem.update({
      where: { id: orderItemId },
      data: {
        imageUrls: imagesArray, // This will replace the entire array
        phoneType: phoneType || null, // Set to null if empty
      },
      include: {
        order: {
          select: {
            id: true,
            customerName: true
          }
        }
      }
    });

    console.log("Successfully updated order item:", updatedItem.id);
    
    return NextResponse.json({
      success: true,
      orderItem: updatedItem,
      message: `Updated ${imagesArray.length} image${imagesArray.length !== 1 ? 's' : ''}`
    });
    
  } catch (error) {
    console.error("Error updating order item:", error);
    return NextResponse.json(
      { error: "Failed to update order item" },
      { status: 500 }
    );
  }
}