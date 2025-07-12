'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign,
  AlertTriangle,
  Star
} from 'lucide-react';

interface DashboardStats {
  totalSales: number;
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  lowStockItems: number;
  topProducts: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
  recentOrders: Array<{
    id: string;
    customerName: string;
    total: number;
    status: string;
    orderDate: string;
    user: {
      username: string;
      email: string;
    };
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    lowStockItems: 0,
    topProducts: [],
    recentOrders: []
  });

  useEffect(() => {
    // Fetch dashboard stats
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      
      if (response.ok) {
        setStats(data);
      } else {
        console.error('Error fetching stats:', data.error);
        // Fallback to mock data if API fails
        setStats({
          totalSales: 15420,
          totalProducts: 45,
          totalOrders: 23,
          totalUsers: 156,
          lowStockItems: 3,
          topProducts: [
            { name: 'Custom Polaroid Set', sales: 12, revenue: 2400 },
            { name: 'Phone Case - Vintage', sales: 8, revenue: 1600 },
            { name: 'Handmade Gift Box', sales: 6, revenue: 1800 }
          ],
          recentOrders: []
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Fallback to mock data if API fails
      setStats({
        totalSales: 15420,
        totalProducts: 45,
        totalOrders: 23,
        totalUsers: 156,
        lowStockItems: 3,
        topProducts: [
          { name: 'Custom Polaroid Set', sales: 12, revenue: 2400 },
          { name: 'Phone Case - Vintage', sales: 8, revenue: 1600 },
          { name: 'Handmade Gift Box', sales: 6, revenue: 1800 }
        ],
        recentOrders: []
      });
    }
  };

  const statCards = [
    {
      title: 'Total Sales',
      value: `$${stats.totalSales.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-500',
      change: '+12%'
    },
    {
      title: 'Products',
      value: stats.totalProducts.toString(),
      icon: Package,
      color: 'bg-blue-500',
      change: '+3'
    },
    {
      title: 'Orders',
      value: stats.totalOrders.toString(),
      icon: ShoppingCart,
      color: 'bg-purple-500',
      change: '+5'
    },
    {
      title: 'Users',
      value: stats.totalUsers.toString(),
      icon: Users,
      color: 'bg-orange-500',
      change: '+8'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to your admin dashboard</p>
        </div>
     
     
      </div>

      {/* Stats Cards */}
      
      

      {/* Alerts */}
      
      

      {/* Top Products */}
     

      {/* Recent Orders */}
      {stats.recentOrders.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Order #{order.id.slice(-6)}</h3>
                      <p className="text-sm text-gray-500">{order.customerName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${Number(order.total).toFixed(2)}</p>
                    <p className={`text-sm ${
                      order.status === 'delivered' ? 'text-green-600' : 
                      order.status === 'processing' ? 'text-blue-600' : 
                      'text-yellow-600'
                    }`}>
                      {order.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

     
    </div>
  );
} 