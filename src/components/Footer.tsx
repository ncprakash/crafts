'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-[#0A1D44] text-white pt-16 pb-8 px-6">
      {/* Newsletter */}
      <div className="max-w-7xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[#D6B45C] rounded-lg p-8 shadow-lg"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-[#0A1D44]">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">
                Get 10% Off Your First Order!
              </h3>
              <p>Subscribe to our newsletter for exclusive offers and new product updates</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-[#0A1D44] text-[#0A1D44] flex-grow"
                suppressHydrationWarning
              />
              <button 
                className="bg-[#0A1D44] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#0A1D44]/90 transition-colors duration-300 shadow-md hover:shadow-lg"
                suppressHydrationWarning
              >
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>
      </div>

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
                <Link href={`/categories/${cat.toLowerCase().replace(' ', '-')}`} className="text-white/80 hover:text-[#D6B45C] transition-colors duration-300">
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
            <p>📧 hello@gunnalcreations.com</p>
            <p>📞 +1 (555) 123-4567</p>
            <p>📍 123 Craft Street, Art City</p>
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
      </motion.div>
    </footer>
  );
};

export default Footer;
