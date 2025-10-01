'use client'
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
const PolaroidSection = () => {
  const polaroids = [
    {
      id: 1,
      title: "MEMORIES",
      description: "Capture life's precious moments",
      image: "/mem.jpeg",
      bgColor: "from-amber-100 to-amber-200",
 
    },
    {
      id: 2,
      title: "MOMENTS",
      description: "Celebrate every special second",
      image: "/memories.jpg",
      bgColor: "from-rose-100 to-rose-200",

    },
    {
      id: 3,
      title: "STORIES",
      description: "Share your unique journey",
      image: "/me.jpeg",
      bgColor: "from-blue-100 to-blue-200",
    
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % polaroids.length);
    }, 3500);
    
    return () => clearInterval(interval);
  }, [polaroids.length, isAutoPlaying]);

  const goToSlide = (index:number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % polaroids.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + polaroids.length) % polaroids.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  return (
    <section className="relative py-16 md:py-24 lg:py-32 px-4 bg-gradient-to-b from-white via-[#faf8f5] to-white overflow-hidden">
      
      {/* Subtle background decoration */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-0 left-0 w-full h-full" 
             style={{
               backgroundImage: `radial-gradient(circle at 2px 2px, #D6B45C 1px, transparent 1px)`,
               backgroundSize: '40px 40px'
             }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-20"
        >
       
          
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#0A1D44] mb-4 tracking-tight">
            Find Your
            <span className="block mt-2 bg-gradient-to-r from-[#D6B45C] via-[#f3d78a] to-[#D6B45C] bg-clip-text text-transparent">
              Perfect Vibe
            </span>
          </h2>
          
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-[#D6B45C] to-transparent mx-auto my-6" />
          
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Discover unique handmade crafts that tell your story
          </p>
        </motion.div>

        {/* Main Carousel Container */}
        <div className="relative max-w-6xl mx-auto">
          
          {/* Desktop/Tablet: Grid Layout with 3 Cards */}
          <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8 mb-12">
            {polaroids.map((polaroid, index) => (
              <motion.div
                key={polaroid.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true }}
                whileHover={{ y: -12, scale: 1.03 }}
                onClick={() => goToSlide(index)}
          
                onMouseLeave={() => setHoveredIndex(null)}
                className={`cursor-pointer transition-all duration-300 ${
                  currentIndex === index ? 'ring-4 ring-[#D6B45C] ring-offset-4' : ''
                }`}
              >
                <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 h-full border-8 border-white relative overflow-hidden group">
                  
                  {/* Image Container */}
                  <div className="relative w-full h-64 mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    <img 
                      src={polaroid.image}
                      alt={polaroid.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Overlay on hover */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                      className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex items-end justify-center pb-4"
                    >
                      <span className="text-white text-sm font-semibold">Click to explore</span>
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <motion.div
                      animate={{ 
                        rotate: currentIndex === index ? [0, 5, -5, 0] : 0,
                        scale: currentIndex === index ? [1, 1.1, 1] : 1
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-4xl mb-3"
                    >
                   
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {polaroid.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {polaroid.description}
                    </p>
                  </div>

                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#D6B45C]/20 to-transparent rounded-bl-full" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile: Single Card Carousel */}
          <div className="md:hidden relative">
            <div className="relative h-[550px] mb-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotateY: 20 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center px-6"
                >
                  <div className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-sm border-8 border-white">
                    
                    {/* Image */}
                    <div className="relative w-full h-64 mb-6 rounded-2xl overflow-hidden">
                      <img 
                        src={polaroids[currentIndex].image}
                        alt={polaroids[currentIndex].title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <motion.div
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.15, 1]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="text-6xl mb-4 text-center"
                    >
                      {polaroids[currentIndex].image}
                    </motion.div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-3 text-center">
                      {polaroids[currentIndex].title}
                    </h3>
                    <p className="text-base text-gray-600 text-center">
                      {polaroids[currentIndex].description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-[#D6B45C] text-gray-800 hover:text-white p-4 rounded-full shadow-lg transition-all duration-300"
                aria-label="Previous"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-[#D6B45C] text-gray-800 hover:text-white p-4 rounded-full shadow-lg transition-all duration-300"
                aria-label="Next"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center items-center gap-3">
            {polaroids.map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  currentIndex === index 
                    ? 'bg-gradient-to-r from-[#D6B45C] to-[#f3d78a] w-12 h-4' 
                    : 'bg-gray-300 hover:bg-[#D6B45C]/50 w-4 h-4'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Shop Now Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16 md:mt-20"
        >
         <Link href="/shop"> <motion.button 
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px -12px rgba(214, 180, 92, 0.5)"
            }}
            whileTap={{ scale: 0.98 }}
            className="px-10 sm:px-14 py-5 bg-gradient-to-r from-[#D6B45C] to-[#f3d78a] text-[#0A1D44] text-lg font-bold rounded-full hover:from-[#f3d78a] hover:to-[#D6B45C] transition-all duration-500 shadow-xl hover:shadow-2xl inline-flex items-center gap-3 group"
          >
            <span>Start Shopping</span>
            <motion.svg 
              className="h-6 w-6"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </motion.svg>
          </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default PolaroidSection;