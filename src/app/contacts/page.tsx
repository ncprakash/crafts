'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Instagram, Send, User, MessageCircle } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', form);
  };

  return (
    <section className="min-h-screen relative flex justify-center items-center">
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
        <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-[#FDC93B] opacity-60"></div>
        <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-[#FDC93B] opacity-60"></div>
        <div className="absolute top-20 left-1/4 w-2 h-2 bg-[#FDC93B] rounded-full animate-ping opacity-75"></div>
        <div className="absolute top-40 right-1/4 w-1 h-1 bg-white rounded-full animate-ping opacity-50" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-[#FDC93B] rounded-full animate-ping opacity-60" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 mx-auto bg-gradient-to-br from-[#FDC93B] to-[#e4b230] rounded-full flex items-center justify-center mb-6"
            >
              <MessageCircle className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0A1D44] mb-4">Let's Connect</h2>
            <p className="text-gray-600 max-w-xl mx-auto text-lg">
              Got questions or custom requests? We'd love to hear from you!
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="relative"
              >
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="name"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FDC93B] focus:border-[#FDC93B] transition-all"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="relative"
              >
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  placeholder="Your Email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FDC93B] focus:border-[#FDC93B] transition-all"
                />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="relative"
            >
              <MessageCircle className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
              <textarea
                name="message"
                placeholder="Your Message"
                rows={5}
                value={form.message}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FDC93B] focus:border-[#FDC93B] transition-all resize-none"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center"
            >
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#FDC93B] hover:bg-[#e4b230] text-[#0A1D44] font-bold py-4 px-8 rounded-xl text-lg shadow-lg transition-all flex items-center justify-center mx-auto"
              >
                <Send className="w-5 h-5 mr-2" />
                Send Message
              </motion.button>
            </motion.div>
          </form>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-12 pt-8 border-t border-gray-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FDC93B] to-[#e4b230] rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-[#0A1D44]">hello@gunnalcreations.com</p>
              </div>

              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FDC93B] to-[#e4b230] rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-semibold text-[#0A1D44]">+91 98765 43210</p>
              </div>

              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FDC93B] to-[#e4b230] rounded-full flex items-center justify-center">
                  <Instagram className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm text-gray-600">Instagram</p>
                <p className="font-semibold text-[#0A1D44]">@gunnalcreations</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
