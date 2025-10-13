'use client';
import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { motion } from 'framer-motion';
import {ShoppingCart, ArrowLeft,  Package, Truck, Shield } from 'lucide-react';
import Link from 'next/link';
import Toast from '@/components/Toast';

import ProductGallery from '@/components/viewImage';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  cloudinaryImages: string; // stored as comma-separated string from backend
  featured: boolean;
  createdAt: string;
  category: {
    name: string;
  };
}

interface Testimonial {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  productName: string;
}

function ViewPageContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');
  const [product, setProduct] = useState<Product | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' | 'info' });
  const { addToCart } = useCart();

  useEffect(() => {
    if (productId) fetchProduct();
  }, [productId]);

  useEffect(() => {
    if (product) fetchTestimonials();
  }, [product]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`);
      const data = await response.json();
      console.log("product-category-name", data.category?.name);
      if (response.ok) setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check if product is Polaroid
  const isPolaroid = () => {
    if (!product || !product.name) return false;
    return (
      product.name.toLowerCase().includes("polaroid") || 
      product.category?.name?.toLowerCase().includes("polaroid")
    );
  };

  const defaultQuantity = isPolaroid() ? 12 : 1;
  const [quantity, setQuantity] = useState<number>(1); // Initialize with 1, will update after product loads

  // Update quantity when product loads
  useEffect(() => {
    if (product) {
      setQuantity(isPolaroid() ? 12 : 1);
    }
  }, [product]);

  const fetchTestimonials = async () => {
    if (!product || !product.name) return;
    try {
      const response = await fetch(`/api/testimonials?productName=${encodeURIComponent(product.name)}`);
      const data = await response.json();
      if (response.ok) setTestimonials(data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  }
  
  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product || addingToCart) return;
    setAddingToCart(true);
  
    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          productId: product.id, 
          quantity,
        }),
      });
  
      const data = await response.json();
      console.log(response);
      console.log(data);
      if (response.ok) {
        addToCart(product);
        setToast({
          show: true,
          message: `${product?.name || 'Product'} added to cart!`,
          type: "success",
        });
      } else {
        // Handle specific error cases
        if (response.status === 401) {
          setToast({
            show: true,
            message: "Please sign in to add items to cart",
            type: "error",
          });
        } else if (response.status === 404 && data.error?.includes('User account')) {
          setToast({
            show: true,
            message: "Please complete your profile setup",
            type: "error",
          });
        } else {
          setToast({
            show: true,
            message: data.error || "Failed to add to cart",
            type: "error",
          });
        }
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      setToast({
        show: true,
        message: "Network error. Please try again.",
        type: "error",
      });
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return <LoadingState />;
  if (!product || !product.name) return <ProductNotFound />;

  // Split images string into array
  const images: string[] = Array.isArray(product.cloudinaryImages)
  ? product.cloudinaryImages
  : typeof product.cloudinaryImages === 'string'
  ? product.cloudinaryImages.split(',')
  : [];

  const price = Number(product.price);
  const discount = Number(product.discount);
  const discountedPrice = discount > 0 ? price - (price * discount) / 100 : price;

  return (
    <section className="min-h-screen relative">
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0A1D44] via-[#1e3a8a] to-[#3730a3]">
        <div className="absolute inset-0 opacity-10">
          <ProductGallery cloudinaryImages={images} productName={product?.name || 'Product'} />
        </div>
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FDC93B] to-transparent opacity-60 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FDC93B] to-transparent opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Back Button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <Link href="/shop">
            <button className="flex items-center text-white hover:text-[#FDC93B] transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" /> Back to Shop
            </button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Images */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Main Image */}
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <Image src={images[selectedImage]} alt={product?.name || 'Product'} width={500} height={500} className="w-full h-96 object-contain" />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto">
                {images.map((image: string, index: number) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 bg-white rounded-lg p-2 shadow-md transition-all ${selectedImage === index ? 'ring-2 ring-[#FDC93B]' : 'hover:shadow-lg'}`}
                  >
                    <Image src={image} alt={`${product?.name || 'Product'} ${index + 1}`} width={80} height={80} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              {/* Category */}
              <h1 className="text-3xl font-bold text-[#0A1D44] mb-4">{product?.name || 'Product'}</h1>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-[#0A1D44]">₹{discountedPrice.toFixed(2)}</span>
                  {discount > 0 && (
                    <>
                      <span className="text-xl text-gray-500 line-through">₹{price.toFixed(2)}</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                        {discount}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

              {/* Stock Status */}
              <div className="mb-6">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  Number(product.stock) > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {Number(product.stock) > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Package className="w-4 h-4 text-[#FDC93B]" />
                  <span>Handmade</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Truck className="w-4 h-4 text-[#FDC93B]" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4 text-[#FDC93B]" />
                  <span>Quality Assured</span>
                </div>
              </div>
            </div>

            {/* Customization Section */}
            <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.6 }}
  className="bg-white rounded-2xl p-6 shadow-xl"
>
  <div className="flex flex-col gap-6">
    {/* Quantity and Total Price Section */}
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4 w-full md:w-auto">
        <label className="text-sm font-medium text-[#0A1D44] whitespace-nowrap">Quantity:</label>
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(defaultQuantity, quantity - 1))}
            className="px-4 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
            disabled={quantity <= defaultQuantity}
          >
            -
          </button>
          <span className="px-4 py-2 border-x border-gray-300 min-w-12 text-center">
            {quantity}
            {isPolaroid() && <span className="block text-xs text-gray-500">(pack of 12)</span>}
          </span>
          <button
            type="button"
            onClick={() => setQuantity(Math.min(Number(product.stock), quantity + 1))}
            className="px-4 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
            disabled={quantity >= Number(product.stock)}
          >
            +
          </button>
        </div>
        {isPolaroid() && (
          <span className="text-xs text-gray-500 whitespace-nowrap">Sold in packs of 12</span>
        )}
      </div>

      {/* Total Price - Always visible */}
      <div className="text-center md:text-right w-full md:w-auto">
        <p className="text-sm text-gray-600">Total Price:</p>
        <p className="text-2xl font-bold text-[#0A1D44]">
          ₹{(discountedPrice * quantity).toFixed(2)}
        </p>
      </div>
    </div>

    <button
      type="button"
      onClick={handleAddToCart}
      disabled={Number(product.stock) === 0 || addingToCart}
      className={`${
        addingToCart
          ? "bg-gray-400 text-white cursor-not-allowed"
          : "bg-[#FDC93B] hover:bg-[#e4b230] text-[#0A1D44]"
      } font-bold py-4 px-6 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center md:w-auto md:px-8`}
    >
      <ShoppingCart className="w-5 h-5" />
      {Number(product.stock) === 0
        ? "Out of Stock"
        : addingToCart
        ? "Adding..."
        : "Add to Cart"}
    </button>
  </div>
</motion.div>
</motion.div>
        </div>

        <Toast 
          message={toast.message} 
          type={toast.type} 
          isVisible={toast.show} 
          onClose={() => setToast({ ...toast, show: false })} 
        />
      </div>
    </section>
  );
}

// Extracted loading and not-found components
function LoadingState() {
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

function ProductNotFound() {
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
      <div className="relative z-10 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Product Not Found</h2>
        <Link href="/shop">
          <button className="bg-[#FDC93B] hover:bg-[#e4b230] text-[#0A1D44] font-bold px-6 py-3 rounded-xl transition-colors">
            Back to Shop
          </button>
        </Link>
      </div>
    </section>
  );
}

export default function ViewPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ViewPageContent />
    </Suspense>
  );
}