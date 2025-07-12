'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';

const PolaroidSection = () => {
  const polaroids = [
    {
      id: 1,
      title: "MEMORIES",
      hoverImage: "/polaroid1.jpg",
      bgColor: "bg-amber-50",
      icon: "📸"
    },
    {
      id: 2,
      title: "MOMENTS",
      hoverImage: "/polaroid2.jpg",
      bgColor: "bg-rose-50",
      icon: "✨"
    },
    {
      id: 3,
      title: "STORIES",
      hoverImage: "/polaroid3.jpg",
      bgColor: "bg-blue-50",
      icon: "📖"
    },
    {
      id: 4,
      title: "ADVENTURES",
      hoverImage: "/polaroid4.jpg",
      bgColor: "bg-purple-50",
      icon: "🌟"
    },
    {
      id: 5,
      title: "SMILES",
      hoverImage: "/polaroid5.jpg",
      bgColor: "bg-green-50",
      icon: "😊"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === polaroids.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);
    
    return () => clearInterval(interval);
  }, [polaroids.length]);

  const visiblePolaroids = [
    polaroids[(currentIndex) % polaroids.length],
    polaroids[(currentIndex + 1) % polaroids.length],
    polaroids[(currentIndex + 2) % polaroids.length]
  ];

  return (
    <section className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 bg-gradient-to-br from-[#f9f5f0] via-white to-[#f9f5f0] overflow-hidden min-h-screen">
      {/* Enhanced decorative elements */}
      <div className="absolute inset-0 opacity-15">
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-20 sm:w-40 h-20 sm:h-40 rounded-full bg-[#D6B45C] mix-blend-multiply filter blur-xl"
        />
        <motion.div 
          animate={{ 
            x: [0, -100, 0],
            y: [0, 50, 0],
            rotate: [360, 180, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/3 right-1/4 w-30 sm:w-60 h-30 sm:h-60 rounded-full bg-[#0A1D44] mix-blend-multiply filter blur-xl"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 w-16 sm:w-32 h-16 sm:h-32 rounded-full bg-[#f3d78a] mix-blend-multiply filter blur-lg"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced Section Title */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16 md:mb-24"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-block mb-4 sm:mb-6"
          >
           
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-bold text-[#0A1D44] mb-6 sm:mb-8 leading-tight"
          >
            FIND YOUR
            <span className="block bg-gradient-to-r from-[#D6B45C] to-[#f3d78a] bg-clip-text text-transparent">
              VIBE
            </span>
          </motion.h2>
          
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "4rem sm:6rem" }}
            transition={{ duration: 1, delay: 0.5 }}
            viewport={{ once: true }}
            className="h-1 bg-gradient-to-r from-[#D6B45C] to-[#f3d78a] mx-auto mb-6 sm:mb-8"
          />
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-lg sm:text-xl md:text-2xl text-[#9C6B3B] max-w-2xl sm:max-w-3xl mx-auto leading-relaxed px-4"
          >
            Discover unique handmade crafts that tell your story
          </motion.p>
        </motion.div>

        {/* Enhanced Polaroids Carousel */}
        <div 
          className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] w-full"
        >
          {visiblePolaroids.map((polaroid, index) => (
            <motion.div
              key={polaroid.id}
              initial={{ opacity: 0, x: index === 1 ? 100 : -100, scale: 0.8 }}
              animate={{ 
                opacity: 1,
                x: 0,
                zIndex: index === 1 ? 10 : 5,
                scale: index === 1 ? 1.1 : 0.9,
                y: index === 1 ? 0 : index === 0 ? -20 : 20
              }}
              transition={{ 
                type: "spring", 
                stiffness: 300,
                damping: 20,
                delay: index * 0.2
              }}
              className={`absolute top-1/2 left-1/2 w-full max-w-sm sm:max-w-md md:max-w-lg h-[300px] sm:h-[350px] md:h-[450px] ${
                index === 0 ? '-translate-x-[120%] sm:-translate-x-[130%]' : 
                index === 2 ? 'translate-x-[20%] sm:translate-x-[30%]' : ''
              }`}
            >
              <div className="relative h-full w-full group">
                {/* Enhanced Polaroid Frame */}
                <motion.div
                  whileHover={{ 
                    scale: 1.08,
                    rotateY: 5,
                    rotateX: 5
                  }}
                  className={`absolute inset-0 ${polaroid.bgColor} shadow-2xl p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center rounded-2xl border-4 sm:border-8 border-white`}
                >
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-4"
                  >
                    {polaroid.icon}
                  </motion.div>
                  
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 text-center leading-tight">
                    {polaroid.title}
                  </h3>
                </motion.div>

                {/* Enhanced Hover Effects */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 overflow-hidden rounded-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-200 via-amber-300 to-amber-400 opacity-90 group-hover:opacity-100 transition-all duration-700"></div>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all duration-700"></div>
                  
                  {/* Floating particles effect */}
                  <motion.div
                    animate={{ 
                      y: [0, -20, 0],
                      opacity: [0.3, 0.8, 0.3]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full"
                  />
                  <motion.div
                    animate={{ 
                      y: [0, 20, 0],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-6 left-6 w-1 h-1 bg-white rounded-full"
                  />
                </motion.div>

                {/* Enhanced Border */}
                <div className="absolute inset-0 border-4 sm:border-8 border-white group-hover:border-[#D6B45C] transition-all duration-700 rounded-2xl shadow-2xl"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Carousel Controls */}
        <div className="flex justify-center gap-2 sm:gap-4 mt-8 sm:mt-12">
          {polaroids.map((_, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${
                currentIndex === index 
                  ? 'bg-gradient-to-r from-[#D6B45C] to-[#f3d78a] w-8 sm:w-12' 
                  : 'bg-gray-300 hover:bg-[#D6B45C]/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Enhanced Shop Now Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16 sm:mt-20 md:mt-24"
        >
          <Link href={"/shop"}>
            <motion.button 
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 25px 50px -12px rgba(214, 180, 92, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              className="px-8 sm:px-12 md:px-16 py-4 sm:py-6 bg-gradient-to-r from-[#D6B45C] to-[#f3d78a] text-[#0A1D44] text-lg sm:text-xl font-bold rounded-full hover:from-[#f3d78a] hover:to-[#D6B45C] transition-all duration-500 shadow-2xl hover:shadow-3xl flex items-center gap-2 sm:gap-3 mx-auto group"
            >
              <span>Start Shopping</span>
              <motion.svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 sm:h-6 sm:w-6"
                animate={{ x: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </motion.svg>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default PolaroidSection;