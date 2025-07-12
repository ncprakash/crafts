'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/sign-in');
    }
  }, [status, router]);

  useEffect(() => {
    if (searchParams.get('order') === 'success') {
      setShowOrderSuccess(true);
      // Remove the query parameter from URL
      router.replace('/dashboard');
    }
  }, [searchParams, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Order Success Message */}
          {showOrderSuccess && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-6 relative">
              <button
                onClick={() => setShowOrderSuccess(false)}
                className="absolute top-4 right-4 text-green-600 hover:text-green-800 text-xl font-bold"
              >
                ×
              </button>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-green-800 mb-2">
                    🎉 Order Placed Successfully!
                  </h3>
                  <div className="text-green-700 space-y-2">
                    <p>Your order has been successfully placed and is being processed by our team.</p>
                    <p><strong>What happens next?</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-sm">
                      <li>You'll receive an order confirmation email shortly</li>
                      <li>Our team will review and process your order within 24 hours</li>
                      <li>You'll get shipping updates via email and SMS</li>
                      <li>Your order will be delivered within 3-5 business days</li>
                      <li>For COD orders: Please keep the payment ready for cash on delivery</li>
                    </ul>
                    <p className="mt-3 text-sm">
                      <strong>Need help?</strong> Contact our support team at support@gunnalcrafts.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <Button 
              onClick={() => signOut({ callbackUrl: '/' })}
              variant="outline"
            >
              Sign Out
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">Welcome!</h2>
              <div className="space-y-2">
                <p><strong>Username:</strong> {session.user?.username}</p>
                <p><strong>Email:</strong> {session.user?.email}</p>
                <p><strong>User ID:</strong> {session.user?.id}</p>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-green-900 mb-4">Account Status</h2>
              <div className="space-y-2">
                <p className="text-green-700">✅ Email Verified</p>
                <p className="text-green-700">✅ Account Active</p>
                <p className="text-gray-600">Last login: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="w-full" onClick={() => router.push('/shop')}>
              Browse Shop
            </Button>
            <Button className="w-full" variant="outline" onClick={() => router.push('/cart')}>
              View Cart
            </Button>
            <Button className="w-full" variant="outline" onClick={() => router.push('/order')}>
              My Orders
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 