import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch all products
export async function GET(request: NextRequest) {
  try {
    const products = await db.product.findMany({
      include: {
        category: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      categoryId,
      price,
      discount,
      stock,
      description,
      tags,
      featured,
      images
    } = body;

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const product = await db.product.create({
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
        createdBy: 'admin' // You can get this from session later
      }
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
} 