import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productName = searchParams.get('productName');

    const whereClause: { status: string; productName?: string } = {
      status: 'approved',
    };

    if (productName) {
      whereClause.productName = productName;
    }

    const testimonials = await db.testimonial.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      },
      take: 20, // Limit to 20 testimonials
      include: {
        user: {
          select: {
            username: true,
            email: true
          }
        }
      }
    });

    // Transform the data to match the expected format
    const transformedTestimonials = testimonials.map((testimonial) => ({
      id: testimonial.id,
      customerName: testimonial.user.username,
      customerEmail: testimonial.user.email,
      rating: testimonial.rating,
      comment: testimonial.comment,
      createdAt: testimonial.createdAt,
      productName: testimonial.productName
    }));
    return NextResponse.json(transformedTestimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productName, rating, comment } = body;

    if (!productName || !rating || !comment) {
      return NextResponse.json(
        { error: 'Product name, rating, and comment are required' },
        { status: 400 }
      );
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Check if user has already reviewed this product
    // Parse user ID (should now always be a valid integer string from our auth fix)
    const userId = parseInt(session.user.id);
    
    if (isNaN(userId)) {
      console.error('Invalid user ID in session:', session.user.id);
      return NextResponse.json(
        { error: 'Invalid user session. Please sign in again.' },
        { status: 401 }
      );
    }

    const existingReview = await db.testimonial.findFirst({
      where: {
        productName,
        userId: userId
      }
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      );
    }

    const testimonial = await db.testimonial.create({
      data: {
        userId: userId,
        productName,
        rating,
        comment,
        status: 'pending' // New testimonials are pending approval
      }
    });

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to create testimonial' },
      { status: 500 }
    );
  }
} 