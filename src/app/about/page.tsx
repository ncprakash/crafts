'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Heart, Star, Users, Award, Sparkles, Target } from 'lucide-react';

export default function AboutPage() {
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
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-12">
        <div className="space-y-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 mx-auto bg-gradient-to-br from-[#FDC93B] to-[#e4b230] rounded-full flex items-center justify-center mb-6"
            >
              <Sparkles className="w-12 h-12 text-white" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">About Gunnal Creations</h2>
            <p className="text-gray-200 max-w-2xl mx-auto text-lg">
              Crafting joy with every handmade creation, made with love and wrapped in care.
            </p>
          </motion.div>

          {/* Story Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12 grid md:grid-cols-2 gap-8"
          >
            <div>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FDC93B] to-[#e4b230] rounded-full flex items-center justify-center mr-4">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-[#0A1D44]">Our Journey</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg mb-4">
                Gunnal Creations began as a passion project rooted in art, memories, and craftsmanship.
                We started with polaroids and gifts crafted at home, but with immense love from our customers,
                we grew into a brand that delivers across the country.
              </p>
              <p className="text-gray-700 text-lg">
                Each product—from personalized gifts to premium hampers—is made by hand with thoughtfulness and care.
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#FDC93B]/10 to-[#e4b230]/10 rounded-xl flex items-center justify-center p-8">
              <div className="w-64 h-64 bg-gradient-to-br from-[#FDC93B] to-[#e4b230] rounded-full flex items-center justify-center">
                <Heart className="w-32 h-32 text-white opacity-20" />
              </div>
            </div>
          </motion.div>

          {/* Core Values */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                title: "Handmade with Love", 
                desc: "Every item is handcrafted to spread warmth and joy.",
                icon: Heart,
                color: "from-red-400 to-pink-500"
              },
              { 
                title: "Premium Quality", 
                desc: "We use the finest materials for long-lasting happiness.",
                icon: Star,
                color: "from-yellow-400 to-orange-500"
              },
              { 
                title: "Customer First", 
                desc: "Your delight is our priority from start to finish.",
                icon: Users,
                color: "from-blue-400 to-purple-500"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center mb-6 mx-auto`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-4 text-center text-[#0A1D44]">{item.title}</h4>
                <p className="text-gray-600 text-center leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
          >
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-[#0A1D44] mb-4">Our Impact</h3>
              <p className="text-gray-600">Spreading joy across the country</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { number: "1000+", label: "Happy Customers", icon: Users },
                { number: "500+", label: "Products Created", icon: Award },
                { number: "50+", label: "Cities Served", icon: Target },
                { number: "100%", label: "Handmade", icon: Heart }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-[#FDC93B] to-[#e4b230] rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-[#0A1D44] mb-2">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
