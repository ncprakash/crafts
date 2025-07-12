import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get total users
    const totalUsers = await db.user.count();

    // Get total products
    const totalProducts = await db.product.count();

    // Get total orders
    const totalOrders = await db.order.count();

    // Get total sales (sum of all order totals)
    const orders = await db.order.findMany({
      where: {
        status: { not: 'cancelled' }
      },
      select: {
        total: true
      }
    });

    const totalSales = orders.reduce((sum, order) => sum + Number(order.total), 0);

    // Get low stock items (products with stock <= 5)
    const lowStockItems = await db.product.count({
      where: {
        stock: {
          lte: 5
        }
      }
    });

    // Get top selling products (mock data for now)
    const topProducts = [
      { name: 'Custom Polaroid Set', sales: 12, revenue: 2400 },
      { name: 'Phone Case - Vintage', sales: 8, revenue: 1600 },
      { name: 'Handmade Gift Box', sales: 6, revenue: 1800 }
    ];

    // Get recent orders
    const recentOrders = await db.order.findMany({
      take: 5,
      orderBy: {
        orderDate: 'desc'
      },
      include: {
        user: {
          select: {
            username: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({
      totalSales,
      totalProducts,
      totalOrders,
      totalUsers,
      lowStockItems,
      topProducts,
      recentOrders
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
} 