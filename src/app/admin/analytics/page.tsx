'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Star,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

interface AnalyticsData {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  averageOrderValue: number;
  conversionRate: number;
  topProducts: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
  salesByMonth: Array<{
    month: string;
    sales: number;
    orders: number;
  }>;
  customerGrowth: Array<{
    month: string;
    newCustomers: number;
    totalCustomers: number;
  }>;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      // Mock data - replace with actual API call
      const mockAnalytics: AnalyticsData = {
        totalSales: 15420,
        totalOrders: 156,
        totalCustomers: 89,
        totalProducts: 45,
        averageOrderValue: 98.85,
        conversionRate: 3.2,
        topProducts: [
          { name: 'Custom Polaroid Set', sales: 23, revenue: 689.77 },
          { name: 'Vintage Phone Case', sales: 18, revenue: 359.82 },
          { name: 'Handmade Gift Box', sales: 15, revenue: 599.85 },
          { name: 'Personalized Mug', sales: 12, revenue: 239.88 },
          { name: 'Photo Frame Set', sales: 10, revenue: 199.90 }
        ],
        salesByMonth: [
          { month: 'Jan', sales: 12000, orders: 120 },
          { month: 'Feb', sales: 13500, orders: 135 },
          { month: 'Mar', sales: 14200, orders: 142 },
          { month: 'Apr', sales: 15420, orders: 156 }
        ],
        customerGrowth: [
          { month: 'Jan', newCustomers: 25, totalCustomers: 25 },
          { month: 'Feb', newCustomers: 18, totalCustomers: 43 },
          { month: 'Mar', newCustomers: 22, totalCustomers: 65 },
          { month: 'Apr', newCustomers: 24, totalCustomers: 89 }
        ]
      };
      setAnalytics(mockAnalytics);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return <div>No analytics data available</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Business insights and performance metrics</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900">${analytics.totalSales.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+12.5%</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalOrders}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+8.2%</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Customers</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalCustomers}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+15.3%</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900">${analytics.averageOrderValue}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+5.7%</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-orange-100">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend</h3>
          <div className="space-y-4">
            {analytics.salesByMonth.map((month, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">{month.month}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-900">${month.sales.toLocaleString()}</span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(month.sales / Math.max(...analytics.salesByMonth.map(m => m.sales))) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Growth */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Growth</h3>
          <div className="space-y-4">
            {analytics.customerGrowth.map((month, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">{month.month}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-900">+{month.newCustomers}</span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(month.newCustomers / Math.max(...analytics.customerGrowth.map(m => m.newCustomers))) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Top Selling Products</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {analytics.topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{product.name}</h4>
                    <p className="text-sm text-gray-500">{product.sales} units sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${product.revenue.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Rate</h3>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{analytics.conversionRate}%</p>
            <p className="text-sm text-gray-500 mt-2">Website visitors to customers</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Products</span>
              <span className="font-medium text-gray-900">{analytics.totalProducts}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Low Stock Items</span>
              <span className="font-medium text-red-600">3</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Out of Stock</span>
              <span className="font-medium text-red-600">1</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Satisfaction</h3>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-6 h-6 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-2xl font-bold text-gray-900">4.8/5</p>
            <p className="text-sm text-gray-500 mt-2">Average Rating</p>
          </div>
        </div>
      </div>
    </div>
  );
} 