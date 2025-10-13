'use client';
import { AnimatePresence } from 'framer-motion';
import CartItemCard from '@/components/CartItemCard';

export interface CartItem {
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

interface CartItemsListProps {
  cartItems: CartItem[];
  removingItem: string | null;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}

const isPolaroid = (item: CartItem) =>
  item.product?.name?.toLowerCase().includes('polaroid') ||
  item.product?.category?.name?.toLowerCase().includes('polaroid');

const getMinQuantity = (item: CartItem) => (isPolaroid(item) ? 12 : 1);

export default function CartItemsList({
  cartItems,
  removingItem,
  onUpdateQuantity,
  onRemoveItem,
}: CartItemsListProps) {
  return (
    <div className="space-y-4">
      <AnimatePresence>
        {cartItems.map((item, index) => (
          <CartItemCard
            key={item.id}
            item={item}
            index={index}
            isPolaroid={isPolaroid(item)}
            minQuantity={getMinQuantity(item)}
            removingItem={removingItem}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveItem={onRemoveItem}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
