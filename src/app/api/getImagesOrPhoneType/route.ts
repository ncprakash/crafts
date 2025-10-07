import { NextResponse } from "next/server";
import {db} from "@/lib/db";

export async function GET(req: Request, context: any) {
  // Let Next.js infer `params`
  const { id } = context.params;

  try {
    const orderItem = await db.orderItem.findUnique({
      where: { id },
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

    if (!orderItem) {
      return NextResponse.json({ message: "Order item not found" }, { status: 404 });
    }

    return NextResponse.json(orderItem);
  } catch (error) {
    console.error("Error fetching order item:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
