'use client'
import React from 'react';
import { motion } from 'framer-motion';

const AboutSection = () => {
  const features = [
    { icon: "🎨", title: "Handcrafted", description: "Every piece is made with love and attention to detail" },
    { icon: "✨", title: "Unique Design", description: "No two items are exactly alike" },
    { icon: "💝", title: "Personal Touch", description: "Customized to match your personality" },
    { icon: "🌟", title: "Quality Assured", description: "Premium materials and craftsmanship" }
  ];

  return (
    <section className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 bg-gradient-to-br from-[#f9f5f0] via-white to-[#f9f5f0] overflow-hidden">
      {/* Enhanced decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <motion.div 
          animate={{ 
            x: [0, 50, 0],
            y: [0, -30, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-10 w-20 sm:w-40 h-20 sm:h-40 rounded-full bg-[#D6B45C] mix-blend-multiply filter blur-xl"
        />
        <motion.div 
          animate={{ 
            x: [0, -50, 0],
            y: [0, 30, 0],
            rotate: [360, 180, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-10 right-10 w-30 sm:w-60 h-30 sm:h-60 rounded-full bg-[#0A1D44] mix-blend-multiply filter blur-xl"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 w-16 sm:w-32 h-16 sm:h-32 rounded-full bg-[#f3d78a] mix-blend-multiply filter blur-lg"
        />
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Enhanced Section Title */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
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
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-[#0A1D44] mb-6 sm:mb-8"
          >
            ABOUT US
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
            className="text-lg sm:text-xl text-[#9C6B3B] italic font-light"
          >
            Crafted With Love Since 2019
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                scale: 1.05,
                y: -10
              }}
              className="text-center p-4 sm:p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-[#D6B45C]/20"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4"
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-lg sm:text-xl font-bold text-[#0A1D44] mb-2">{feature.title}</h3>
              <p className="text-xs sm:text-sm text-[#9C6B3B]">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Main content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="bg-white p-6 sm:p-8 md:p-12 rounded-2xl shadow-2xl border-l-4 border-[#D6B45C] transform transition-all duration-500 hover:shadow-3xl hover:-translate-y-2"
        >
          <div className="space-y-6 sm:space-y-8 text-[#0A1D44]">
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              viewport={{ once: true }}
              className="text-base sm:text-lg leading-relaxed"
            >
              <span className="font-serif text-2xl sm:text-3xl text-[#D6B45C]">G</span>unnal Creations began as a tiny spark of passion in 2019 — just a couple of handmade items, a dream, and a lot of heart. Over time, it evolved into a one-stop destination for all things creative and personal.
            </motion.p>
            
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              viewport={{ once: true }}
              className="text-base sm:text-lg leading-relaxed"
            >
              We specialize in handmade crafts, aesthetic polaroids, and designer phone cases that reflect individuality, emotion, and style. Each product is carefully designed and thoughtfully curated — not just to be used, but to be loved.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              viewport={{ once: true }}
              className="my-8 sm:my-12 border-t border-b border-[#D6B45C]/30 py-6 sm:py-8 bg-gradient-to-r from-[#D6B45C]/10 to-[#f3d78a]/10 rounded-xl"
            >
              <motion.p 
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="text-lg sm:text-xl font-medium italic text-center text-[#9C6B3B]"
              >
                "We don't follow trends, we set them."
              </motion.p>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              viewport={{ once: true }}
              className="text-base sm:text-lg leading-relaxed"
            >
              Every item you find here is a blend of artistry, functionality, and uniqueness. Whether it's a quirky keychain, a customized gift, or a nostalgic polaroid, our goal is to make your everyday feel a little more you.
            </motion.p>

            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.6 }}
              viewport={{ once: true }}
              className="text-base sm:text-lg leading-relaxed"
            >
              As a small independent startup, we take pride in building personal connections with our customers. We believe in slow, meaningful creation, not mass production. Every order supports a journey — a dream that started in a cozy corner and is now shared with the world.
            </motion.p>

            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.8 }}
              viewport={{ once: true }}
              className="text-base sm:text-lg leading-relaxed font-medium bg-gradient-to-r from-[#D6B45C] to-[#f3d78a] bg-clip-text text-transparent"
            >
              Thank you for being a part of our story. We're just getting started — and we're so glad you're here.
            </motion.p>
          </div>
        </motion.div>

        {/* Enhanced "More" button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-12 sm:mt-16"
        >
          <motion.button 
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 25px -5px rgba(214, 180, 92, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center justify-center mx-auto text-[#0A1D44] font-bold hover:text-[#D6B45C] transition-colors duration-300 text-base sm:text-lg"
          >
            More about our journey
            <motion.svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 sm:h-6 sm:w-6 ml-2 sm:ml-3 group-hover:translate-x-2 transition-transform" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </motion.svg>
          </motion.button>
        </motion.div>
      </div>

      {/* Enhanced floating decorative elements */}
      <motion.div 
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="hidden md:block absolute bottom-20 left-10 w-16 h-16 rounded-full bg-[#D6B45C]/20"
      />
      <motion.div 
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="hidden md:block absolute top-1/4 right-10 w-10 h-10 rounded-full bg-[#0A1D44]/10"
      />
    </section>
  );
};

export default AboutSection;