'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import CheckoutHeader from '@/components/CheckOutHeader';
import CheckoutForm from '@/components/CheckOutForm';
import OrderSummary from '@/components/OrderSummary';
import PaymentSection from '@/components/PaymentSection';
import SuccessModal from '@/components/SuccesModel';
import LoadingState from '@/components/LayoutContent';
import EmptyState from '@/components/EmptyState';
import LayoutContent from '@/components/LayoutContent';

interface FormData {
  first: string;
  last: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  state: string;
  country: string;
  coupon: string;
}

interface CartItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    description: string;
    images: string;
    stock: number;
    category: { name: string };
  };
}


export interface CustomizationData {
  maxImage?:number
  uploadedImages?: string[];
  phoneType?: string;
}

export default function CheckoutPage() {
  const [customizationData, setCustomizationData] = useState<CustomizationData | null>(null);
  const { data: session } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [formData, setFormData] = useState<FormData>({
    first: '', last: '', email: '', phone: '', address: '',
    city: '', zip: '', state: '', country: '', coupon: ''
  });

  // Fetch cart items
  useEffect(() => {
    if (session) {
      fetchCartItems();
    } else {
      setLoading(false);
    }
  }, [session]);

  const fetchCartItems = async () => {
    try {
      const response = await fetch('/api/cart/items');
      if (!response.ok) throw new Error('Failed to fetch cart items');
      
      const data = await response.json();
      setCartItems(data.items || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setError('Failed to load cart items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearServerCart = async () => {
    try {
      await fetch('/api/cart/items', { method: 'DELETE' });
      window.dispatchEvent(new CustomEvent('cartCleared'));
    } catch (error) {
      console.log('Error clearing server cart:', error);
    }
  };

  const startCountdown = () => {
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const validateForm = (): boolean => {
    const requiredFields = ['first', 'last', 'email', 'phone', 'address', 'city', 'zip', 'state', 'country'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof FormData]?.trim());
    
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      setError('Please enter a valid phone number (at least 10 digits)');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.id) {
      setError('Please sign in to place an order');
      return;
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // First, create the order in our database
      const orderData = {
        customerName: `${formData.first} ${formData.last}`,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: formData.address,
        city: formData.city,
        zip: formData.zip,
        state: formData.state,
        country: formData.country,
        cartItems: cartItems,
        total: total,
        customizationData: customizationData,
        paymentMethod: paymentMethod
      };

      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const orderResult = await orderResponse.json();

      if (!orderResponse.ok) {
        console.error('Order creation failed:', orderResult);
        setError(orderResult.error || 'Failed to create order');
        return;
      }

      // Process order based on payment method
      if (paymentMethod === 'razorpay') {
        // Handle Razorpay payment
        await handleRazorpayPayment(orderResult);
      } else {
        // Handle Cash on Delivery
        try {
          // Update order status for COD
          await fetch(`/api/orders/${orderResult.order.id}/update-payment`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              paymentStatus: 'pending',
              status: 'processing',
            }),
          });

          // Clear cart and show success
          await clearServerCart();
          setOrderSuccess(true);
          setError('');
          startCountdown();
        } catch (error) {
          console.error('Error processing COD order:', error);
          setError('Failed to process COD order');
        }
      }

    } catch (error) {
      console.error('Order processing error:', error);
      setError(`An error occurred while processing your order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRazorpayPayment = async (orderResult: any) => {
    if (!(window as any).Razorpay) {
      setError('Razorpay payment gateway not loaded. Please try again.');
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_RN4opVXKWAkvwp',
      amount: orderResult.razorpayOrder.amount,
      currency: orderResult.razorpayOrder.currency,
      name: 'Gunnal Crafts',
      description: 'Order Payment',
      order_id: orderResult.razorpayOrder.id,
      handler: async function (response: any) {
        try {
          // Verify payment on server
          const verificationResponse = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verificationResult = await verificationResponse.json();

          if (verificationResult.success) {
            // Clear cart and show success
            await clearServerCart();
            setOrderSuccess(true);
            setError('');
            startCountdown();
          } else {
            setError('Payment verification failed. Please contact support.');
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          setError('Payment verification failed. Please contact support.');
        }
      },
      prefill: {
        name: `${formData.first} ${formData.last}`,
        email: formData.email,
        contact: formData.phone,
      },
      notes: {
        address: formData.address,
      },
      theme: {
        color: '#3395ff',
      },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.on('payment.failed', function (response: any) {
      setError(`Payment failed: ${response.error.description}. Please try again.`);
    });
    razorpay.open();
  };

  // Handle redirect when countdown reaches 0
  useEffect(() => {
    if (orderSuccess && countdown === 0) {
      router.push('/dashboard?order=success');
    }
  }, [orderSuccess, countdown, router]);

  // Redirect if not signed in
  if (!session) {
    return (
      <EmptyState
        title="Please Sign In"
        description="You need to be signed in to place an order."
        action={
          <Link href="/sign-in" className="btn-primary">
            Sign In
          </Link>
        }
      />
    );
  }

  // Show success message
  if (orderSuccess) {
    return (
      <SuccessModal
        paymentMethod={paymentMethod}
        countdown={countdown}
      />
    );
  }

  // Show loading state
  if (loading) {
    return
   
      <LoadingState />
   
  }

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    return (
      <EmptyState
        title="Your Cart is Empty"
        description="Add some items to your cart before checkout."
        action={
          <Link href="/shop" className="btn-primary">
            Continue Shopping
          </Link>
        }
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Checkout Form */}
          <div className="space-y-6">
            <CheckoutHeader itemCount={cartItems.length} total={total} />
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <CheckoutForm
                formData={formData}
                setFormData={setFormData}
                cartItems={cartItems}
                customizationData={customizationData}
                setCustomizationData={setCustomizationData}
              />
            </div>
          </div>

          {/* Right Column - Order Summary & Payment */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <OrderSummary cartItems={cartItems} total={total} />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <PaymentSection
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                total={total}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit}
              />
            </div>

            {/* Trust Badges */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="text-center space-y-4">
                <h3 className="text-sm font-semibold text-gray-900">Secure & Trusted</h3>
                <div className="flex justify-center items-center space-x-6 opacity-60">
                  <div className="flex items-center space-x-2">
                    <ShieldCheckIcon className="h-5 w-5 text-green-600" />
                    <span className="text-xs text-gray-600">SSL Secure</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <LockClosedIcon className="h-5 w-5 text-blue-600" />
                    <span className="text-xs text-gray-600">256-bit Encryption</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DevicePhoneMobileIcon className="h-5 w-5 text-purple-600" />
                    <span className="text-xs text-gray-600">PCI Compliant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Icons
function ShieldCheckIcon(props: any) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function LockClosedIcon(props: any) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}

function DevicePhoneMobileIcon(props: any) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );
}