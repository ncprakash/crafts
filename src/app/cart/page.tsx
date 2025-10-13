'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import CartHeader from '@/components/CartHeader';
import CartItemsList from '@/components/CardItemList';

import EmptyCartState from '@/components/EmptyCartState';
import SignInPrompt from '@/components/SignInPrompt';
import LoadingState from '@/components/LodingState';
import Link from 'next/link';
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react"; 

interface CartItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    description: string;
    images: string;
    cloudinaryImages?: string[]; // Add cloudinaryImages field
    stock: number;
    category: {
      name: string;
    };
  };
}
interface CartItemCardProps {
  item: CartItem;
  index: number;
  isPolaroid: boolean;
  minQuantity: number;
  removingItem: string | null;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}

export default function Cart() {
  const { data: session } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [removingItem, setRemovingItem] = useState<string | null>(null);

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
        setCartItems(data.items || []);
        setTotal(data.total || 0);
        setItemCount(data.itemCount || 0);
      } else {
        console.error('Error fetching cart:', data.error);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check if product is Polaroid
  const isPolaroid = (item: CartItem) => {
    const name = item.product?.name?.toLowerCase() || "";
    const category = item.product?.category?.name?.toLowerCase() || "";
    return name.includes("polaroid") || category.includes("polaroid");
  };

  const getMinQuantity = (item: CartItem) => {
    return isPolaroid(item) ? 12 : 1;
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    const item = cartItems.find(item => item.id === itemId);
    if (!item) return;

    const minQuantity = getMinQuantity(item);
    if (newQuantity < minQuantity) return;

    try {
      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (response.ok) {
        fetchCartItems();
      }
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const removeItem = async (itemId: string) => {
    setRemovingItem(itemId);
    try {
      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchCartItems();
      }
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setRemovingItem(null);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (!session) {
    return <SignInPrompt />;
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-8">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 flex justify-center">
  <div className="w-full">
    <CartHeader itemCount={itemCount} />

    {cartItems.length === 0 ? (
      <EmptyCartState />
    ) : (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <CartItemsList
            cartItems={cartItems}
            removingItem={removingItem}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeItem}
          />
        </div>

        {/* Order Summary */}
        <ActionButtons />
      </div>
    )}
  </div>
</div>
    </section>
  );
}

// Action Buttons Component
function ActionButtons() {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="space-y-3">
        <Link href="/order">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center space-x-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </Link>
        
        <Link href="/shop">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-md"
          >
            Continue Shopping
          </motion.button>
        </Link>
      </div>

      {/* Trust Badges */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { icon: '🔒', text: 'Secure Checkout' },
            { icon: '🚚', text: 'Free Shipping' },
            { icon: '↩️', text: 'Easy Returns' }
          ].map((badge, index) => (
            <div key={index} className="text-center">
              <div className="text-lg mb-1">{badge.icon}</div>
              <div className="text-xs text-gray-600">{badge.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}