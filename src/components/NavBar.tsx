'use client'
import React from "react";
import Image from "next/image";
import Link from "next/link";

const NavSection = () => {
  return (
    <>
      {/* Navigation Bar - Dark Blue */}
      

        {/* Secondary gold bar */}
        <div className="bg-[#D6B45C] py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <p className="text-xs sm:text-sm text-center md:text-left text-[#0A1D44] italic font-medium">
              WITH LOVE, GUARANTY, CERTAINTY
            </p>
          </div>
        </div>
      

      {/* Hero Section - Split Layout */}
      <section className="relative flex flex-col lg:flex-row min-h-screen w-full bg-[#0A1D44] overflow-hidden">
  {/* White gradient overlay */}
  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/10 to-white/20 pointer-events-none"></div>
  
  {/* Content container */}
  <div className="relative z-10 flex flex-col lg:flex-row w-full h-full">
    {/* Envelope - Left Side */}
    <div className="w-full lg:w-[40%] flex items-center justify-center py-8 sm:py-12 px-4 relative group">
      <div className="relative w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] animate-float">
        <Image
          src="/message1.svg"
          alt="Envelope"
          width={560}
          height={560}
          className="object-contain z-10 transform transition-all duration-1000 group-hover:scale-105 group-hover:rotate-2"
        />
        {/* Enhanced glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#D6B45C]/20 via-[#D6B45C]/10 to-[#D6B45C]/5 opacity-0 group-hover:opacity-100 blur-lg transition-all duration-700"></div>
      </div>
    </div>

    {/* Text - Right Side */}
    <div className="w-full lg:w-[60%] flex flex-col justify-center items-start px-4 sm:px-6 lg:px-16 py-8 sm:py-12 text-white space-y-6 sm:space-y-8 backdrop-blur-sm">
      {/* Main heading */}
      <div className="relative">
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight tracking-wide mb-4 sm:mb-6">
          <span className="block bg-clip-text text-transparent bg-gradient-to-r from-white to-[#D6B45C]">
            CRAFTED WITH CARE,
          </span>
          <span className="block bg-clip-text text-transparent bg-gradient-to-r from-[#D6B45C] to-white mt-2">
            SHARED WITH LOVE...
          </span>
        </h1>
        {/* Animated decorative line */}
        <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-[#D6B45C] to-white mb-6 sm:mb-8 transform transition-all duration-500 hover:scale-x-110 origin-left"></div>
      </div>

      {/* Paragraph with animated border */}
      <div className="relative group">
        <p className="text-[#D6B45C]/90 text-base sm:text-lg md:text-xl max-w-lg leading-relaxed font-light italic pl-4 sm:pl-6 py-2">
          "We create handcrafted gifts, polaroids, and designer phone cases with love and detail.
          Each piece is made to celebrate individuality, creativity, and meaningful moments."
        </p>
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#D6B45C] to-transparent group-hover:h-full group-hover:w-1.5 transition-all duration-500"></div>
      </div>

      {/* Enhanced CTA Button */}
      <button className="mt-6 sm:mt-8 px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-gradient-to-r from-[#D6B45C] to-[#f3d78a] text-[#0A1D44] font-medium rounded-full hover:from-white hover:to-white hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center gap-2 group text-sm sm:text-base">
        <span>Explore Collection</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    </div>
  </div>

  {/* Add to your globals.css */}
 
</section>

     <style jsx global>{`
    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(-1deg); }
      50% { transform: translateY(-15px) rotate(1deg); }
    }
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
  `}</style>
    </>
  );
};

export default NavSection;