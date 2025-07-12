'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: "Riya Mehta",
    location: "Pune",
    review: "I ordered custom polaroids for my wall and I'm obsessed! The packaging was adorable and full of love.",
    image: "/customer1.jpg",
  },
  {
    name: "Aarav Sharma",
    location: "Mumbai",
    review: "The phone case I bought is stunning! Quality exceeded my expectations.",
    image: "/customer2.jpg",
  },
  {
    name: "Priya Patel",
    location: "Delhi",
    review: "My polaroid arrived today - even more beautiful in person! Colors are vibrant.",
    image: "/customer3.jpg",
  },
  {
    name: "Neha Gupta",
    location: "Bangalore",
    review: "Absolutely love my custom gift! The attention to detail is remarkable.",
    image: "/customer4.jpg",
  },
  {
    name: "Vikram Joshi",
    location: "Hyderabad",
    review: "The craftsmanship is outstanding. Will definitely order again!",
    image: "/customer5.jpg",
  },
];

// Generate random positions and rotations
const getPolaroidPositions = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    rotation: Math.floor(Math.random() * 30) - 15,
    x: 20 + ((index * 15) % 60),
    y: 10 + ((index * 20) % 70),
  }));

export default function PolaroidTestimonials() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [positions, setPositions] = useState<
    { rotation: number; x: number; y: number }[]
  >([]);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted) {
      setPositions(getPolaroidPositions(testimonials.length));
    }
  }, [hasMounted]);

  if (!hasMounted) return null;

  return (
    <section className="relative py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-[#f9f5f0] min-h-screen overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-20 sm:w-40 h-20 sm:h-40 rounded-full bg-[#D6B45C] mix-blend-multiply filter blur-xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-30 sm:w-60 h-30 sm:h-60 rounded-full bg-[#0A1D44] mix-blend-multiply filter blur-xl"></div>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-12 sm:mb-16 relative z-10"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#0A1D44] mb-4">
          Customer Memories
        </h2>
        <div className="w-16 sm:w-24 h-1 bg-[#D6B45C] mx-auto mb-4 sm:mb-6"></div>
        <p className="text-base sm:text-lg text-[#9C6B3B] max-w-2xl mx-auto px-4">
          Real moments captured with our products
        </p>
      </motion.div>

      {/* Polaroids */}
      <div className="relative max-w-6xl mx-auto h-[400px] sm:h-[500px] md:h-[600px] lg:h-[800px] z-10">
        {positions.length > 0 &&
          testimonials.map((t, index) => {
            const { rotation, x, y } = positions[index];

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  zIndex: 10,
                  scale: 1.05,
                  rotate: 0,
                  y: -20,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                className={`absolute w-48 sm:w-56 md:w-64 h-60 sm:h-70 md:h-80 bg-white p-3 sm:p-4 shadow-lg border-4 sm:border-8 border-white rounded-md ${
                  hoveredIndex === index ? "z-50" : ""
                }`}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: `rotate(${rotation}deg)`,
                }}
              >
                <div className="relative h-36 sm:h-40 md:h-48 w-full bg-black mb-3 sm:mb-4 overflow-hidden border border-gray-700">
                 <div className="text-[#D6B45C] text-sm sm:text-lg mb-1">★★★★★</div>
                <p className="text-xs sm:text-sm text-gray-300 italic mb-2 line-clamp-3 px-2">
                 " {t.review}"
                </p>
                <div className="border-t border-gray-700 pt-2 px-2">
                  <p className="font-medium text-white text-xs sm:text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.location}</p>
                </div>
                </div>
                
                <div className="absolute -top-1 sm:-top-2 left-1/2 w-12 sm:w-16 h-3 sm:h-4 bg-gray-700/80 transform -translate-x-1/2 rotate-6"></div>
              </motion.div>
            );
          })}
      </div>

      {/* Button */}
      <div className="text-center mt-20 sm:mt-24 md:mt-32 z-10 relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 sm:px-8 py-2 sm:py-3 bg-[#0A1D44] text-white rounded-full shadow-lg hover:bg-[#D6B45C] transition-colors text-sm sm:text-base"
        >
          View More Memories
        </motion.button>
      </div>
      
    </section>
  );
}
