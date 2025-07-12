import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// ❗ Do NOT use type annotations for `context` — let Next.js infer it
export async function GET(req: NextRequest, context: any) {
  const id = context?.params?.id;

  try {
    const product = await db.product.findUnique({
      where: { id },
      include: {
        category: {
          select: { name: true },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: any) {
  const id = context?.params?.id;

  try {
    const body = await req.json();
    const {
      name,
      categoryId,
      price,
      discount,
      stock,
      description,
      tags,
      featured,
      images,
    } = body;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const product = await db.product.update({
      where: { id },
      data: {
        name,
        categoryId,
        price: parseFloat(price),
        discount: parseFloat(discount || '0'),
        stock: parseInt(stock),
        description,
        tags,
        featured: featured || false,
        slug,
        images,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: any) {
  const id = context?.params?.id;

  try {
    await db.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
