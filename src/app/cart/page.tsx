'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Trash2, Plus, Minus } from 'lucide-react';

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
  };
}

export default function Cart() {
  const { data: session } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);

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
      } else {
        console.error('Error fetching cart:', data.error);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    try {
      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (response.ok) {
        fetchCartItems(); // Refresh cart data
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchCartItems(); // Refresh cart data
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen relative flex justify-center items-center">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0A1D44] via-[#1e3a8a] to-[#3730a3]">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }}></div>
          </div>
        </div>
        <div className="relative z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FDC93B]"></div>
        </div>
      </section>
    );
  }

  if (!session) {
    return (
      <section className="min-h-screen relative flex justify-center items-center">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0A1D44] via-[#1e3a8a] to-[#3730a3]">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }}></div>
          </div>
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FDC93B] to-transparent opacity-60 animate-pulse"></div>
          <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FDC93B] to-transparent opacity-40 animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-[#FDC93B] opacity-60"></div>
          <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-[#FDC93B] opacity-60"></div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative z-10 bg-white max-w-md w-full p-8 rounded-2xl shadow-xl text-center"
        >
          <h2 className="text-2xl font-bold text-[#0A1D44] mb-4">Please Sign In</h2>
          <p className="text-gray-600 mb-6">You need to be signed in to view your cart.</p>
          <Link href="/sign-in">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#FDC93B] hover:bg-[#e4b230] text-[#0A1D44] font-bold px-6 py-3 rounded-lg transition-colors"
            >
              Sign In
            </motion.button>
          </Link>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="min-h-screen relative flex justify-center items-center">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0A1D44] via-[#1e3a8a] to-[#3730a3]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FDC93B] to-transparent opacity-60 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FDC93B] to-transparent opacity-40 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-[#FDC93B] opacity-60"></div>
        <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-[#FDC93B] opacity-60"></div>
        <div className="absolute top-20 left-1/4 w-2 h-2 bg-[#FDC93B] rounded-full animate-ping opacity-75"></div>
        <div className="absolute top-40 right-1/4 w-1 h-1 bg-white rounded-full animate-ping opacity-50" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-[#FDC93B] rounded-full animate-ping opacity-60" style={{animationDelay: '1s'}}></div>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 bg-white max-w-lg w-full p-8 rounded-2xl shadow-xl"
      >
        {/* Header */}
        <h2 className="text-3xl font-extrabold text-center text-[#0A1D44] mb-6 tracking-wide">
          Your Cart ({itemCount} items)
        </h2>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#FDC93B] to-[#e4b230] rounded-full flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#0A1D44] mb-2">Your cart is empty</h3>
              <p className="text-gray-600 mb-6">Add some amazing products to get started!</p>
            </div>
            <Link href="/shop">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#FDC93B] hover:bg-[#e4b230] text-[#0A1D44] font-bold px-8 py-4 rounded-xl transition-colors shadow-lg"
              >
                Start Shopping
              </motion.button>
            </Link>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center bg-gradient-to-r from-white to-gray-50 border border-gray-100 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                >
                  {/* Image */}
                  <div className="relative w-16 h-16 mr-4 bg-white rounded-lg p-2 shadow-sm">
                    <Image
                      src={item.product.images ? item.product.images.split(',')[0] : '/logo.svg'}
                      alt={item.product.name}
                      fill
                      className="object-contain"
                    />
                  </div>

                  {/* Text Content */}
                  <div className="flex-1">
                    <p className="text-[#0A1D44] font-semibold text-sm mb-1">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                      {item.product.description}
                    </p>
                    <p className="text-sm font-bold text-[#0A1D44]">
                      ₹{Number(item.price).toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2 mr-4">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-8 h-8 rounded-full bg-[#FDC93B] hover:bg-[#e4b230] disabled:bg-gray-200 disabled:opacity-50 flex items-center justify-center transition-colors shadow-sm"
                    >
                      <Minus className="w-3 h-3 text-[#0A1D44]" />
                    </button>
                    <span className="text-sm font-medium w-8 text-center text-[#0A1D44]">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                      className="w-8 h-8 rounded-full bg-[#FDC93B] hover:bg-[#e4b230] disabled:bg-gray-200 disabled:opacity-50 flex items-center justify-center transition-colors shadow-sm"
                    >
                      <Plus className="w-3 h-3 text-[#0A1D44]" />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t border-gray-200 pt-6 mb-6">
              <div className="flex justify-between items-center bg-gradient-to-r from-[#FDC93B] to-[#e4b230] p-4 rounded-xl text-white">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-xl font-bold">₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link href="/order">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-[#FDC93B] hover:bg-[#e4b230] text-[#0A1D44] font-extrabold py-4 rounded-xl text-lg shadow-lg transition-all"
                >
                  PROCEED TO ORDER
                </motion.button>
              </Link>
              
              <Link href="/shop">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-white border-2 border-[#FDC93B] text-[#0A1D44] font-semibold py-3 rounded-xl text-base shadow-md transition-all hover:bg-[#FDC93B] hover:text-white"
                >
                  Continue Shopping
                </motion.button>
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </section>
  );
}
