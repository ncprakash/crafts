// components/CartItemCard.tsx
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Trash2, Plus, Minus, Sparkles } from 'lucide-react';
import { useState } from 'react';

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

interface CartItemCardProps {
    item: CartItem;
    index: number;
    isPolaroid: boolean; // must be boolean
    minQuantity: number;
    removingItem: string | null;
    onUpdateQuantity: (id: string, quantity: number) => void;
    onRemoveItem: (id: string) => void;
  }
export default function CartItemCard({
  item,
  index,
  isPolaroid,
  minQuantity,
  removingItem,
  onUpdateQuantity,
  onRemoveItem
}: CartItemCardProps) {
  const [imageError, setImageError] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="p-6">
        <div className="flex items-start space-x-4">
          {/* Product Image */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-2 border border-gray-200">
              <Image
                src={imageError || !item.product?.images ? '/logo.svg' : (item.product.images.split(',')[0] || '/logo.svg')}
                alt={item.product?.name || 'Product'}
                width={80}
                height={80}
                className="w-full h-full object-contain rounded-lg"
                onError={() => setImageError(true)}
              />
            </div>
            {isPolaroid && (
              <div className="absolute -top-2 -right-2">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-lg">
                  Pack of 12
                </div>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-2">
                  {item.product?.name || 'Product'}
                </h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {item.product.description}
                </p>
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-bold text-blue-600">
                    {formatCurrency(item.price)}
                  </span>
                  {isPolaroid && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {formatCurrency(item.price / 12)} per piece
                    </span>
                  )}
                </div>
              </div>

              {/* Remove Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onRemoveItem(item.id)}
                disabled={removingItem === item.id}
                className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors p-2 ml-2"
              >
                {removingItem === item.id ? (
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 className="w-5 h-5" />
                )}
              </motion.button>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center space-x-2 bg-gray-50 rounded-xl p-1 border border-gray-200">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onUpdateQuantity(item.id, item.quantity - (isPolaroid ? 12 : 1))}
                    disabled={item.quantity <= minQuantity}
                    className="w-8 h-8 rounded-lg bg-white border border-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-sm"
                  >
                    <Minus className="w-4 h-4" />
                  </motion.button>
                  
                  <div className="flex flex-col items-center min-w-12">
                    <span className="font-semibold text-gray-900 text-lg">{item.quantity}</span>
                    {isPolaroid && (
                      <span className="text-xs text-gray-500">({item.quantity / 12} pack{item.quantity > 12 ? 's' : ''})</span>
                    )}
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onUpdateQuantity(item.id, item.quantity + (isPolaroid ? 12 : 1))}
                    disabled={item.quantity >= item.product.stock}
                    className="w-8 h-8 rounded-lg bg-white border border-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Item Total */}
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">
                  {formatCurrency(item.price * item.quantity)}
                </div>
                {isPolaroid && (
                  <div className="text-xs text-gray-500">
                    {item.quantity} pieces total
                  </div>
                )}
              </div>
            </div>

            {/* Polaroid Notice */}
            {isPolaroid && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-yellow-700 font-medium">
                    Polaroid products are sold in packs of 12. Minimum order: 12 pieces.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}