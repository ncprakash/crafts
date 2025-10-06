'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useEffect, useState, Suspense } from 'react';
import { ShoppingBag, ShoppingCart, Package, LogOut, User, Mail, CheckCircle2, Clock, X, Truck, Calendar, CreditCard } from 'lucide-react';
import Image from 'next/image';

interface OrderItem {
  orderItemId: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    images: string;
    slug: string;
  };
}

interface Order {
  orderId: string;
  customerName: string;
  total: number;
  status: string;
  paymentStatus: string;
  orderDate: string;
  trackingNumber: string | null;
  items: OrderItem[];
  userId?: string;
}


function DashboardPageContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/sign-in');
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchOrders() {
      if (!session?.user?.email) {
        console.log("No user email available");
        setLoadingOrders(false);
        return;
      }
  
      try {
        // Send email as query param to API
        const res = await fetch(`/api/get-orders?email=${encodeURIComponent(session.user.email)}`);
  
        if (!res.ok) {
          console.error('Failed to fetch orders, status:', res.status);
          throw new Error('Failed to fetch orders');
        }
  
        const data = await res.json();
        console.log("API Response:", data);
  
        // Assuming API returns { data: [...] }
        const userOrders: Order[] = Array.isArray(data.data) ? data.data : [];
  
        console.log("User orders:", userOrders);
        setOrders(userOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    }
  
    if (session?.user?.email) {
      fetchOrders();
    }
  }, [session?.user?.email]);
  

  useEffect(() => {
    if (searchParams.get('order') === 'success') {
      setShowOrderSuccess(true);
      const timer = setTimeout(() => {
        router.replace('/dashboard');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const quickActions = [
    {
      icon: ShoppingBag,
      label: 'Browse Shop',
      description: 'Explore our products',
      onClick: () => router.push('/shop'),
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      icon: ShoppingCart,
      label: 'My Cart',
      description: 'View items',
      onClick: () => router.push('/cart'),
      gradient: 'from-green-500 to-green-600'
    }
  ];

  const getImageUrl = (images: string) => {
    try {
      const imageArray = JSON.parse(images);
      return imageArray[0] || '/placeholder.png';
    } catch {
      return images || '/placeholder.png';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Order Success Banner */}
        {showOrderSuccess && (
          <div className="mb-8 animate-in fade-in slide-in-from-top duration-500">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-2xl overflow-hidden">
              <div className="relative p-8 text-white">
                <button
                  onClick={() => setShowOrderSuccess(false)}
                  className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center ring-4 ring-white/30">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3">
                      🎉 Order Placed Successfully!
                    </h3>
                    <p className="text-green-50 mb-4 text-lg">
                      Your order has been confirmed and is being processed by our team.
                    </p>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-3">
                      <p className="font-semibold text-lg">What happens next?</p>
                      <ul className="space-y-2.5">
                        {[
                          'Order confirmation email sent to your inbox',
                          'Processing begins within 24 hours',
                          'Real-time shipping updates via email & SMS',
                          'Delivery within 3-5 business days',
                          'COD: Keep payment ready for cash on delivery'
                        ].map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <span className="text-green-50">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <p className="mt-4 text-sm text-green-50">
                      <strong>Need help?</strong> Contact us at{' '}
                      <a href="mailto:support@gunnalcrafts.com" className="underline hover:text-white">
                        support@gunnalcrafts.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                Welcome back, {session.user?.username || session.user?.name || 'User'}!
              </h1>
              <p className="text-gray-600">Manage your account and explore our products</p>
            </div>
            <Button 
              onClick={() => signOut({ callbackUrl: '/' })}
              variant="outline"
              className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Profile Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Info Card */}
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center ring-4 ring-white/30">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="text-white">
                  <h2 className="text-2xl font-bold">{session.user?.username || session.user?.name || 'User'}</h2>
                  <p className="text-blue-100">Account Details</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <Mail className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Email Address</p>
                  <p className="text-gray-900 font-medium">{session.user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <Package className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Total Orders</p>
                  <p className="text-gray-900 font-bold text-lg">{orders.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Status Card */}
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center ring-4 ring-white/30">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <div className="text-white">
                  <h2 className="text-2xl font-bold">All Set!</h2>
                  <p className="text-green-100">Account Status</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-green-900 font-semibold">Email Verified</p>
                  <p className="text-green-600 text-sm">Your email is confirmed</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-green-900 font-semibold">Account Active</p>
                  <p className="text-green-600 text-sm">Ready to shop</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-gray-900 font-semibold">Last Login</p>
                  <p className="text-gray-600 text-sm">{new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
  {/* Header */}
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-2xl font-bold text-gray-900">Your Orders</h2>
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <Package className="w-4 h-4" />
      <span>{orders.length} {orders.length === 1 ? 'Order' : 'Orders'}</span>
    </div>
  </div>

  {/* Loading / Empty / Orders */}
  {loadingOrders ? (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
    </div>
  ) : orders.length === 0 ? (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Package className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Yet</h3>
      <p className="text-gray-600 mb-6">Start shopping to see your orders here!</p>
      <Button onClick={() => router.push('/shop')} className="bg-gradient-to-r from-blue-500 to-blue-600">
        Browse Products
      </Button>
    </div>
  ) : (
    <div className="space-y-6">
      {orders.map((order) => (
        <div
          key={order.orderId}
          className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300"
        >
          {/* Order Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-4 border-b border-gray-100">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-bold text-gray-900">
                  Order #{order.orderId?.slice(0, 8).toUpperCase() || 'N/A'}
                </h3>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  {(order.status || 'pending').toUpperCase()}
                </span>
              </div>
              <div className="mb-3">
                <p className="text-sm text-gray-700 font-medium">
                  Customer: {order.customerName || 'N/A'}
                </p>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{order.orderDate ? new Date(order.orderDate).toLocaleDateString('en-US', { 
                    month: 'short', day: 'numeric', year: 'numeric' 
                  }) : 'N/A'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CreditCard className="w-4 h-4" />
                  <span className="capitalize">{order.paymentStatus || 'Pending'}</span>
                </div>
                {order.trackingNumber && (
                  <div className="flex items-center gap-1">
                    <Truck className="w-4 h-4" />
                    <span>{order.trackingNumber}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{order.total != null ? Number(order.total).toFixed(2) : '0.00'}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            {order.items && order.items.length > 0 ? (
              order.items.map((item) => (
                <div key={`${order.orderId}-${item.orderItemId}`} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="relative w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                    <Image
                      src={getImageUrl(item.product?.images || '')}
                      alt={item.product?.name || 'Product'}
                      fill
                      className="object-cover"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">
                      {item.product?.name || 'Product'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity || 0} × ₹{Number(item.price || 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      ₹{(Number(item.quantity || 0) * Number(item.price || 0)).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No items in this order</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )}
</div>


        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.onClick}
                  className="group relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200 hover:border-transparent"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  
                  <div className="relative z-10">
                    <div className={`w-14 h-14 bg-gradient-to-br ${action.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-white transition-colors mb-1">
                      {action.label}
                    </h3>
                    <p className="text-gray-600 group-hover:text-white/90 transition-colors text-sm">
                      {action.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    }>
      <DashboardPageContent />
    </Suspense>
  );
}