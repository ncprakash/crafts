// src/types/cart.ts
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
      category: {
        name: string;
      };
    };
  }
  