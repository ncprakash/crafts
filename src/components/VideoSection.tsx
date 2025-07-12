'use client'
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VideoSection = () => {
  const videos = [
    {
      id: 1,
      title: "Crafting Memories",
      description: "Watch our artisans create beautiful handmade crafts",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", 
      thumbnail: "/video-thumb1.jpg"
    },
    {
      id: 2,
      title: "Behind the Scenes",
      description: "See how we bring your ideas to life",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      thumbnail: "/video-thumb2.jpg"
    },
    {
      id: 3,
      title: "Customer Stories",
      description: "Real people, real experiences with our products",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      thumbnail: "/video-thumb3.jpg"
    }
  ];

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex((prevIndex) => 
        prevIndex === videos.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change video every 5 seconds

    return () => clearInterval(interval);
  }, [videos.length]);

  const currentVideo = videos[currentVideoIndex];

  return (
    <section className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gradient-to-br from-[#0A1D44] via-[#1a365d] to-[#0A1D44] overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
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
          className="absolute bottom-1/3 right-1/4 w-30 sm:w-60 h-30 sm:h-60 rounded-full bg-[#f3d78a] mix-blend-multiply filter blur-xl"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-white mb-4 sm:mb-6">
            WATCH OUR STORY
          </h2>
          <div className="w-16 sm:w-24 h-1 bg-[#D6B45C] mx-auto mb-4 sm:mb-6"></div>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto px-4">
            Discover the passion and creativity behind every handmade piece
          </p>
        </motion.div>

        {/* Video Carousel */}
        <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] w-full max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentVideoIndex}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="relative h-full w-full"
            >
              {/* Video Container */}
              <div className="relative h-full w-full bg-black rounded-2xl overflow-hidden shadow-2xl">
                {/* Video Placeholder - Replace with actual video */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#D6B45C] to-[#f3d78a] flex items-center justify-center">
                  <div className="text-center text-white px-4">
                    <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">🎬</div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">{currentVideo.title}</h3>
                    <p className="text-sm sm:text-base md:text-lg opacity-90">{currentVideo.description}</p>
                  </div>
                </div>
                
                {/* Play Button Overlay */}
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute inset-0 flex items-center justify-center cursor-pointer"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
                    <div className="w-0 h-0 border-l-[16px] sm:border-l-[20px] border-l-white border-t-[10px] sm:border-t-[12px] border-t-transparent border-b-[10px] sm:border-b-[12px] border-b-transparent ml-1"></div>
                  </div>
                </motion.div>
              </div>

              {/* Video Info Overlay */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 sm:p-6 rounded-b-2xl"
              >
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">{currentVideo.title}</h3>
                <p className="text-sm sm:text-base text-gray-300">{currentVideo.description}</p>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 sm:gap-3 mt-4 sm:mt-6">
            {videos.map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                onClick={() => setCurrentVideoIndex(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  currentVideoIndex === index 
                    ? 'bg-[#D6B45C] w-6 sm:w-8' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to video ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-12 sm:mt-16"
        >
          <button className="px-8 sm:px-10 md:px-12 py-3 sm:py-4 bg-gradient-to-r from-[#D6B45C] to-[#f3d78a] text-[#0A1D44] text-base sm:text-lg font-medium rounded-full hover:from-[#f3d78a] hover:to-[#D6B45C] transition-all duration-500 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
            Explore More Videos
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoSection; 