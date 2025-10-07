'use client'
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useCart } from '@/lib/cart-context';
import Toast from '@/components/Toast';
import Link from 'next/link';
import { Eye } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  cloudinaryImages: string;
  featured: boolean;
  createdAt: string;
  category: {
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
}

export default function HandmadeCollections() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All products');
  const [sortBy, setSortBy] = useState('featured');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' | 'info' });
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products');
      const data = await response.json();
      if (response.ok) {
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      const data = await response.json();
      if (response.ok) {
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filteredProducts = products.filter(product => {
    if (activeCategory === 'All products') return true;
    return product.category.name === activeCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return Number(a.price) - Number(b.price);
      case 'price-high':
        return Number(b.price) - Number(a.price);
      case 'newest':
        return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
      case 'featured':
      default:
        return a.featured ? -1 : 1;
    }
  });

  if (loading) {
    return (
      <section className="bg-[#0A1D44]/90 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#0A1D44]/90 text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold mb-2 tracking-wide">
            OUR HANDMADE Collections
          </h2>
          <p className="text-gray-300 text-sm md:text-base">
            discover unique, premium handmade products crafted with love and attention to detail!
          </p>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveCategory('All products')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === 'All products'
                  ? 'bg-white text-[#0A1D44]'
                  : 'bg-[#0A1D44] border border-white text-white hover:bg-white hover:text-[#0A1D44]'
              }`}
            >
              All products
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category.name
                    ? 'bg-white text-[#0A1D44]'
                    : 'bg-[#0A1D44] border border-white text-white hover:bg-white hover:text-[#0A1D44]'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-white/80">Sort by:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white text-[#0A1D44] px-4 py-2 rounded-md text-sm"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {sortedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white text-[#0A1D44] rounded-xl p-4 shadow-md hover:shadow-xl transition duration-300 relative group cursor-pointer"
            >
              {/* Hover Border Effect */}
              <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-[#0A1D44] transition-all duration-300 pointer-events-none"></div>

              <div className="flex justify-center mb-4">
                <Image
                  src={product.cloudinaryImages ? product.cloudinaryImages[0] : '/logo.svg'}
                  alt={product.name}
                  className="w-24 h-24 object-contain"
                  width={96}
                  height={96}
                />
              </div>

              <h3 className="text-base font-semibold mb-1">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">₹{Number(product.price).toFixed(2)}</p>
                  {Number(product.discount) > 0 && (
                    <p className="text-xs text-green-600">
                      {Number(product.discount)}% off
                    </p>
                  )}
                  <p className={`text-xs ${Number(product.stock) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Number(product.stock) > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </p>
                </div>
                <Link
                  href={`/view?id=${product.id}`}
                  className="bg-[#0A1D44] text-white px-4 py-2 rounded-full font-semibold shadow-md transition hover:bg-[#1e3a8a] flex items-center gap-2 text-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Eye className="w-4 h-4" />
                  View Product
                </Link>
              </div>
            </div>
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-300">No products found in this category.</p>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </section>
  );
}