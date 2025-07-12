'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Format currency to Indian Rupees
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Fetch server-side cart items
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
      const data = await response.json();
      
      if (response.ok) {
        setCartItems(data.items);
        setTotal(data.total);
        setItemCount(data.itemCount);
        console.log('Server cart items:', data.items);
        console.log('Server cart total:', data.total);
      } else {
        console.error('Error fetching cart:', data.error);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearServerCart = async () => {
    try {
      const response = await fetch('/api/cart/items', {
        method: 'DELETE'
      });
      if (response.ok) {
        console.log('Server cart cleared successfully');
        window.dispatchEvent(new CustomEvent('cartCleared'));
      }
    } catch (error) {
      console.log('Error clearing server cart:', error);
    }
  };

  const [formData, setFormData] = useState({
    first: '', last: '', email: '', phone: '', address: '',
    city: '', zip: '', state: '', country: '', coupon: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('online');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Input validation based on field type
    let validatedValue = value;
    
    switch (name) {
      case 'first':
      case 'last':
        // Only allow letters, spaces, and hyphens for names
        validatedValue = value.replace(/[^a-zA-Z\s-]/g, '');
        break;
      case 'phone':
        // Only allow numbers, spaces, hyphens, and plus sign for phone
        validatedValue = value.replace(/[^0-9\s\-+]/g, '');
        break;
      case 'zip':
        // Only allow numbers and letters for ZIP code
        validatedValue = value.replace(/[^0-9a-zA-Z]/g, '');
        break;
      case 'city':
      case 'state':
      case 'country':
        // Only allow letters, spaces, and hyphens for location fields
        validatedValue = value.replace(/[^a-zA-Z\s-]/g, '');
        break;
      case 'email':
        // Email validation - allow standard email characters
        validatedValue = value.replace(/[^a-zA-Z0-9@._-]/g, '');
        break;
      default:
        validatedValue = value;
    }
    
    setFormData({ ...formData, [name]: validatedValue });
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

    // Form validation
    const requiredFields = ['first', 'last', 'email', 'phone', 'address', 'city', 'zip', 'state', 'country'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]?.trim());
    
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Phone validation (at least 10 digits)
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      setError('Please enter a valid phone number (at least 10 digits)');
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
        total: total
      };

      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const orderResult = await orderResponse.json();
      console.log('Order creation response:', orderResult);

      if (!orderResponse.ok) {
        console.error('Order creation failed:', orderResult);
        setError(orderResult.error || 'Failed to create order');
        return;
      }

      // Handle payment based on selected method
      if (paymentMethod === 'online') {
        // Create Razorpay order for online payment
        const paymentResponse = await fetch('/api/payment/create-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: total,
            currency: 'INR',
            receipt: orderResult.order.id,
          }),
        });

        const paymentResult = await paymentResponse.json();
        console.log('Payment order response:', paymentResult);

        if (!paymentResponse.ok) {
          setError(paymentResult.error || 'Failed to create payment order');
          return;
        }

        // Initialize Razorpay payment
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: paymentResult.amount,
          currency: paymentResult.currency,
          name: 'Gunnal Crafts',
          description: 'Order Payment',
          order_id: paymentResult.orderId,
          handler: async function (response: any) {
            try {
              // Verify payment
              const verifyResponse = await fetch('/api/payment/verify', {
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

              const verifyResult = await verifyResponse.json();

              if (verifyResponse.ok && verifyResult.verified) {
                // Update order payment status
                try {
                  await fetch(`/api/orders/${orderResult.order.id}/update-payment`, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      paymentId: response.razorpay_payment_id,
                      razorpayOrderId: response.razorpay_order_id,
                      paymentStatus: 'paid',
                    }),
                  });
                } catch (error) {
                  console.log('Error updating payment status:', error);
                }

                              // Payment successful - clear cart and show success
              await clearServerCart();
                
                setOrderSuccess(true);
                setFormData({
                  first: '', last: '', email: '', phone: '', address: '',
                  city: '', zip: '', state: '', country: '', coupon: ''
                });
                setError('');
                
                // Start countdown
                const countdownInterval = setInterval(() => {
                  setCountdown((prev) => {
                    if (prev <= 1) {
                      clearInterval(countdownInterval);
                      return 0;
                    }
                    return prev - 1;
                  });
                }, 1000);
              } else {
                setError('Payment verification failed');
              }
            } catch (error) {
              setError('Payment verification failed');
            }
          },
          prefill: {
            name: `${formData.first} ${formData.last}`,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: '#FDC93B',
          },
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      } else {
        // Cash on Delivery - directly process order
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
          setFormData({
            first: '', last: '', email: '', phone: '', address: '',
            city: '', zip: '', state: '', country: '', coupon: ''
          });
          setError('');
          
          // Start countdown
          const countdownInterval = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(countdownInterval);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
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

  // Handle redirect when countdown reaches 0
  useEffect(() => {
    if (orderSuccess && countdown === 0) {
      router.push('/dashboard?order=success');
    }
  }, [orderSuccess, countdown, router]);

  // Redirect if not signed in
  if (!session) {
    return (
      <div className="min-h-screen bg-[#f9f5f0] px-4 py-8 md:py-12 flex justify-center">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 text-center">
          <h2 className="text-xl font-bold text-[#0A1D44] mb-4">Please Sign In</h2>
          <p className="text-gray-600 mb-4">You need to be signed in to place an order.</p>
          <Link href="/sign-in" className="inline-block bg-[#FDC93B] text-[#0A1D44] font-bold px-6 py-3 rounded-xl">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  // Show success message
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-[#f9f5f0] px-4 py-8 md:py-12 flex justify-center">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
                            <h2 className="text-2xl font-bold text-[#0A1D44] mb-2">🎉 Order Placed Successfully!</h2>
                <p className="text-gray-600 mb-4">
                  {paymentMethod === 'online' 
                    ? 'Your payment has been processed successfully and your order is being processed by our team.'
                    : 'Your order has been placed successfully. Please keep the payment ready for cash on delivery.'
                  }
                </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-700">
                ✅ Your cart has been cleared and items have been added to your order.
              </p>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-800 mb-2">What happens next?</h3>
            <ul className="text-sm text-green-700 space-y-1 text-left">
              <li>• You'll receive an order confirmation email shortly</li>
              <li>• Our team will review and process your order within 24 hours</li>
              <li>• You'll get shipping updates via email and SMS</li>
              <li>• Your order will be delivered within 3-5 business days</li>
            </ul>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>Redirecting to dashboard in {countdown} seconds...</p>
            {paymentMethod === 'cod' && (
              <p className="mt-2 text-orange-600">
                <strong>Note:</strong> Additional COD charges may apply
              </p>
            )}
            <p className="mt-2">
              <strong>Need help?</strong> Contact our support team at support@gunnalcrafts.com
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9f5f0] px-4 py-8 md:py-12 flex justify-center">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A1D44] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#f9f5f0] px-4 py-8 md:py-12 flex justify-center">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 text-center">
          <h2 className="text-xl font-bold text-[#0A1D44] mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-4">Add some items to your cart before checkout.</p>
          <Link href="/shop" className="inline-block bg-[#FDC93B] text-[#0A1D44] font-bold px-6 py-3 rounded-xl">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen relative flex justify-center items-center">
              {/* Background image */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0A1D44] via-[#1e3a8a] to-[#3730a3]">
          {/* Elegant pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }}></div>
          </div>
          
          {/* Animated accent lines */}
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FDC93B] to-transparent opacity-60 animate-pulse"></div>
          <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FDC93B] to-transparent opacity-40 animate-pulse" style={{animationDelay: '1s'}}></div>
          
          {/* Corner accents */}
          <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-[#FDC93B] opacity-60"></div>
          <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-[#FDC93B] opacity-60"></div>
          
          {/* Floating elements */}
          <div className="absolute top-20 left-1/4 w-2 h-2 bg-[#FDC93B] rounded-full animate-ping opacity-75"></div>
          <div className="absolute top-40 right-1/4 w-1 h-1 bg-white rounded-full animate-ping opacity-50" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-[#FDC93B] rounded-full animate-ping opacity-60" style={{animationDelay: '1s'}}></div>
        </div>
      {/* Main content */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-6 text-[#0A1D44]">

        {/* Header */}
        <div className="flex items-center gap-2 font-semibold text-lg">
          <Link href={"/cart"}><span className="text-xl">←</span></Link> Checkout
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Order Summary */}
        <div className="border-b pb-4">
          <h3 className="font-bold text-sm mb-2">Order Summary</h3>
          {cartItems.map((item: any) => (
            <div key={item.id} className="flex justify-between text-sm mb-2">
              <div className="flex-1">
                <p className="font-semibold">{item.product.name}</p>
                <p className="text-gray-500 text-xs">Quantity: {item.quantity}</p>
              </div>
              <p className="font-bold text-right">{formatCurrency(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Coupon Code */}
          <input
            name="coupon"
            placeholder="Add coupon code for discount"
            value={formData.coupon}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-[#f5f5f5] text-sm focus:outline-none focus:ring-2 focus:ring-[#D6B45C]"
          />

          {/* Form Fields */}
          <div className="space-y-4">
          <div className="flex gap-2">
            <input
              name="first"
              type="text"
              placeholder="First name"
              value={formData.first}
              onChange={handleChange}
              maxLength={50}
              required
              className="flex-1 px-4 py-3 rounded-lg bg-[#f5f5f5] text-sm"
            />
            <input
              name="last"
              type="text"
              placeholder="Last name"
              value={formData.last}
              onChange={handleChange}
              maxLength={50}
              required
              className="flex-1 px-4 py-3 rounded-lg bg-[#f5f5f5] text-sm"
            />
          </div>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            maxLength={100}
            required
            className="w-full px-4 py-3 rounded-lg bg-[#f5f5f5] text-sm"
          />
          <input
            name="phone"
            type="tel"
            placeholder="Phone number"
            value={formData.phone}
            onChange={handleChange}
            maxLength={15}
            required
            className="w-full px-4 py-3 rounded-lg bg-[#f5f5f5] text-sm"
          />
          <textarea
            name="address"
            placeholder="Shipping address"
            rows={3}
            value={formData.address}
            onChange={handleChange}
            maxLength={200}
            required
            className="w-full px-4 py-3 rounded-lg bg-[#f5f5f5] text-sm"
          />
          <div className="flex gap-2">
            <input
              name="city"
              type="text"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              maxLength={50}
              required
              className="flex-1 px-4 py-3 rounded-lg bg-[#f5f5f5] text-sm"
            />
            <input
              name="zip"
              type="text"
              placeholder="ZIP code"
              value={formData.zip}
              onChange={handleChange}
              maxLength={10}
              required
              className="w-24 px-4 py-3 rounded-lg bg-[#f5f5f5] text-sm"
            />
          </div>
          <input
            name="state"
            type="text"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            maxLength={50}
            required
            className="w-full px-4 py-3 rounded-lg bg-[#f5f5f5] text-sm"
          />
          <input
            name="country"
            type="text"
            placeholder="Country"
            value={formData.country}
            onChange={handleChange}
            maxLength={50}
            required
            className="w-full px-4 py-3 rounded-lg bg-[#f5f5f5] text-sm"
          />
        </div>

        {/* Payment Method Selection */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center cursor-pointer">
            <span className="font-semibold">Delivery Method</span>
            <span className="text-xl text-gray-500">›</span>
          </div>
          
          <div className="space-y-3">
            <span className="font-semibold">Payment Method</span>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={paymentMethod === 'online'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'cod' | 'online')}
                  className="w-4 h-4 text-[#FDC93B] bg-gray-100 border-gray-300 focus:ring-[#FDC93B] focus:ring-2"
                />
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
                    </svg>
                  </div>
                  <span>Online Payment (Credit/Debit Card, UPI, Net Banking)</span>
                </div>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'cod' | 'online')}
                  className="w-4 h-4 text-[#FDC93B] bg-gray-100 border-gray-300 focus:ring-[#FDC93B] focus:ring-2"
                />
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span>Cash on Delivery (Pay when you receive)</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="border-t pt-4 text-sm">
          <div className="flex justify-between">
            <p>Subtotal</p>
            <p>{formatCurrency(total)}</p>
          </div>
          <div className="flex justify-between">
            <p>Delivery</p>
            <p className="text-green-600">Free</p>
          </div>
          <div className="flex justify-between font-bold text-lg mt-2">
            <p>Total</p>
            <p>{formatCurrency(total)}</p>
          </div>
        </div>

        {/* Order Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-[#FDC93B] text-[#0A1D44] font-bold rounded-xl shadow-lg hover:bg-[#e4b230] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Placing Order...' : 'Place Order'}
        </button>
        </form>
      </div>
    </section>
  );
}
