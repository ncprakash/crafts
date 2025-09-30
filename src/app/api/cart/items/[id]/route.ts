import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

// Update quantity of a cart item
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }  // params is now a Promise
) {
  const { id } = await params;

  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { quantity } = await request.json();

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { error: 'Quantity must be at least 1' },
        { status: 400 }
      );
    }

    const updatedItem = await db.orderItem.update({
      where: { id },
      data: { quantity },
    });

    return NextResponse.json({ success: true, updatedItem });
  } catch (err: any) {
    console.error('Error updating item:', err);
    return NextResponse.json({ error: err.message || 'Failed to update item' }, { status: 500 });
  }
}

// Remove a single cart item
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }  // params is now a Promise
) {
  const { id } = await params;

  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await db.orderItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error deleting cart item:', err);
    return NextResponse.json({ error: err.message || 'Failed to delete item' }, { status: 500 });
  }
}
