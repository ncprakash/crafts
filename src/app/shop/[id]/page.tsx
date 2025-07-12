'use client';
import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart, ArrowLeft, Share2, MessageCircle, Package, Truck, Shield } from 'lucide-react';
import Link from 'next/link';
import Toast from '@/components/Toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  images: string;
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
  productId: string;
}

function ProductDetailsContent() {
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' | 'info' });
  const { addToCart } = useCart();

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  useEffect(() => {
    if (product) {
      fetchTestimonials();
    }
  }, [product]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`);
      const data = await response.json();
      if (response.ok) {
        setProduct(data);
      } else {
        console.error('Error fetching product:', data.error);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(`/api/testimonials?productName=${encodeURIComponent(product?.name || '')}`);
      const data = await response.json();
      if (response.ok) {
        setTestimonials(data);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: quantity
        }),
      });

      const data = await response.json();

      if (response.ok) {
        addToCart(product);
        setToast({
          show: true,
          message: `${product.name} added to cart!`,
          type: 'success'
        });
      } else {
        setToast({
          show: true,
          message: data.error || 'Failed to add to cart',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      setToast({
        show: true,
        message: 'Failed to add to cart',
        type: 'error'
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
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

  if (!product) {
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

  const images = product.images ? product.images.split(',') : ['/logo.svg'];
  const discountedPrice = product.discount > 0 
    ? product.price - (product.price * product.discount / 100)
    : product.price;

  return (
    <section className="min-h-screen relative">
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0A1D44] via-[#1e3a8a] to-[#3730a3]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FDC93B] to-transparent opacity-60 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FDC93B] to-transparent opacity-40 animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link href="/shop">
            <button className="flex items-center text-white hover:text-[#FDC93B] transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Shop
            </button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Main Image */}
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <Image
                src={images[selectedImage]}
                alt={product.name}
                width={500}
                height={500}
                className="w-full h-96 object-contain"
              />
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 bg-white rounded-lg p-2 shadow-md transition-all ${
                      selectedImage === index ? 'ring-2 ring-[#FDC93B]' : 'hover:shadow-lg'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-contain"
                    />
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
              <div className="mb-4">
                <span className="bg-[#FDC93B] text-[#0A1D44] px-3 py-1 rounded-full text-sm font-medium">
                  {product.category.name}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-[#0A1D44] mb-4">{product.name}</h1>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-[#0A1D44]">₹{discountedPrice.toFixed(2)}</span>
                  {product.discount > 0 && (
                    <>
                      <span className="text-xl text-gray-500 line-through">₹{product.price.toFixed(2)}</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                        {product.discount}% OFF
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
                  Number(product.stock) > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
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

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-[#0A1D44]">Quantity:</label>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 hover:bg-gray-100 transition-colors"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-2 hover:bg-gray-100 transition-colors"
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="w-full bg-[#FDC93B] hover:bg-[#e4b230] text-[#0A1D44] font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-8">
              <MessageCircle className="w-6 h-6 text-[#FDC93B]" />
              <h2 className="text-2xl font-bold text-[#0A1D44]">Customer Reviews</h2>
            </div>

            {testimonials.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-3">
                      {renderStars(testimonial.rating)}
                    </div>
                    <p className="text-gray-700 mb-4 italic">"{testimonial.comment}"</p>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#0A1D44]">{testimonial.customerName}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(testimonial.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
              </div>
            )}
          </div>
        </motion.div>
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

export default function ProductDetails() {
  return (
    <Suspense fallback={<section className="min-h-screen relative flex justify-center items-center"><div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0A1D44] via-[#1e3a8a] to-[#3730a3]"></div><div className="relative z-10"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FDC93B]"></div></div></section>}>
      <ProductDetailsContent />
    </Suspense>
  );
} 