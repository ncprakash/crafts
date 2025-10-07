// components/CartHeader.tsx
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

interface CartHeaderProps {
  itemCount: number;
}

export default function CartHeader({ itemCount }: CartHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-8"
    >
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4 shadow-lg">
        <ShoppingBag className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
        Your Shopping Cart
      </h1>
      <p className="text-gray-600 text-lg">
        {itemCount} item{itemCount !== 1 ? 's' : ''} in your cart
      </p>
    </motion.div>
  );
}