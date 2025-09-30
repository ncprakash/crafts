'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-[#0A1D44] text-white pt-16 pb-8 px-6">
      {/* Newsletter */}
     
      {/* Footer Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h3 className="text-2xl font-serif font-bold mb-4">Gunnal Creations</h3>
          <p className="text-[#D6B45C] italic mb-6">Handcrafted with love, designed for life</p>
          <div className="flex gap-4">
            {['facebook', 'instagram', 'twitter'].map((social) => (
              <Link href="#" key={social} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#D6B45C] transition-colors duration-300">
                <span className="text-white capitalize">{social[0]}</span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h4 className="text-lg font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            {['Home', 'Shop', 'About Us', 'Contact'].map((link) => (
              <li key={link}>
                <Link href={`/${link.toLowerCase().replace(' ', '-')}`} className="text-white/80 hover:text-[#D6B45C] transition-colors duration-300">
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h4 className="text-lg font-bold mb-4">Categories</h4>
          <ul className="space-y-2">
            {['Handmade Crafts', 'Polaroids', 'Phone Cases'].map((cat) => (
              <li key={cat}>
                <Link href={`/shop`} className="text-white/80 hover:text-[#D6B45C] transition-colors duration-300">
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h4 className="text-lg font-bold mb-4">Contact Info</h4>
          <address className="not-italic space-y-2 text-white/80">
            <p>📧 gunnalcreations@gmail.com</p>
            <p>📞 +91 78992 51692</p>
            <p>📍kengeri,banglore </p>
          </address>
        </motion.div>
      </div>

      {/* Copyright */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 text-center text-white/60"
      >
        <p>© 2024 Gunnal Creations. All rights reserved.</p>
        <div className="mt-2 flex flex-col items-center justify-center">
          <span className="text-sm text-white/80 flex items-center gap-2">
            <span>Created by</span>
            <a
              href="https://www.linkedin.com/in/prakash-n-c-b466102ba/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-[#D6B45C] hover:underline hover:text-[#bfa14a] transition-colors duration-200"
            >
              nc prakash
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24" className="ml-1 text-[#0A66C2]">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.271c-.966 0-1.75-.785-1.75-1.75s.784-1.75 1.75-1.75 1.75.785 1.75 1.75-.784 1.75-1.75 1.75zm15.5 10.271h-3v-4.604c0-1.098-.021-2.509-1.529-2.509-1.529 0-1.764 1.195-1.764 2.428v4.685h-3v-9h2.881v1.229h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v4.733z"/>
              </svg>
            </a>
          </span>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
