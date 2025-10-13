'use client';

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { IoCartSharp } from "react-icons/io5";
import { MdPerson } from "react-icons/md";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import AuthModal from './AuthModal';
import { FiMenu, FiX } from 'react-icons/fi';

function Navbar1() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { totalItems } = useCart();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [serverCartCount, setServerCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch server-side cart count for authenticated users
  useEffect(() => {
    if (session) {
      fetchServerCartCount();
    } else {
      setServerCartCount(0);
    }
  }, [session]);

  const fetchServerCartCount = async () => {
    try {
      const response = await fetch('/api/cart/items');
      const data = await response.json();
      if (response.ok) {
        setServerCartCount(data.itemCount || 0);
        console.log('Navbar: Server cart count updated to:', data.itemCount);
      }
    } catch (error) {
      console.error('Error fetching server cart count:', error);
    }
  };

  // Debug cart counts
  useEffect(() => {
    console.log('Navbar: Client cart items:', totalItems);
    console.log('Navbar: Server cart count:', serverCartCount);
  }, [totalItems, serverCartCount]);

  // Listen for cart cleared events
  useEffect(() => {
    const handleCartCleared = () => {
      console.log('Navbar: Cart cleared event received, refreshing server cart count');
      fetchServerCartCount();
    };

    window.addEventListener('cartCleared', handleCartCleared);
    return () => {
      window.removeEventListener('cartCleared', handleCartCleared);
    };
  }, []);

  const handleUserClick = () => {
    if (status === 'loading') return; 
    if (session) {
      if (session.user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } else {
      setShowAuthModal(true);
    }
  };

  const handleCartClick = () => {
    if (status === 'loading') return;
    if (session) {
      router.push('/cart');
    } else {
      setShowAuthModal(true);
    }
  };

  // Correct cart count display logic
  const displayCartCount = session ? serverCartCount : totalItems;

  return (
    <>
      <div>
        <nav className="bg-[#0A1D44] text-white sticky top-0 z-50 font-sans shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            {/* Logo with glow effect */}
            <Link href={"/"}>
              <div className="flex items-center gap-2 group">
                <Image
                  src="/logo.svg"
                  alt="Logo"
                  width={48}
                  height={48}
                  className="transition-all duration-300 group-hover:rotate-12 group-hover:drop-shadow-gold"
                />
                <span className="font-bold text-xl tracking-tight text-white group-hover:text-[#D6B45C] transition-colors duration-300">
                  GUNNAL CREATIONS
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <ul className="hidden md:flex gap-10 text-sm font-medium tracking-wider">
              {['ABOUT', 'SHOP', 'CONTACTS'].map((item) => (
                <li key={item} className="relative group">
                  <Link 
                    href={`/${item.toLowerCase()}`} 
                    className="text-white hover:text-[#D6B45C] transition-colors duration-300 py-2 px-1"
                  >
                    {item}
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#D6B45C] transition-all duration-500 group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Desktop Icons */}
            <div className="hidden md:flex gap-8 text-xl">
              <button 
                onClick={handleUserClick}
                className="text-white hover:text-[#D6B45C] transition-all duration-300 hover:scale-110"
              >
                <MdPerson />
              </button>
              <button 
                onClick={handleCartClick}
                className="text-white hover:text-[#D6B45C] transition-all duration-300 hover:scale-110 relative"
              >
                <IoCartSharp />
                {displayCartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#D6B45C] text-[#0A1D44] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {displayCartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Hamburger menu for mobile */}
            <button
              className="md:hidden text-2xl focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-[#0A1D44] px-6 pb-6 pt-2 flex flex-col gap-4 shadow-lg animate-fade-in-down">
              <ul className="flex flex-col gap-4 text-base font-medium">
                {['ABOUT', 'SHOP', 'CONTACTS'].map((item) => (
                  <li key={item}>
                    <Link
                      href={`/${item.toLowerCase()}`}
                      className="block text-white hover:text-[#D6B45C] py-2 px-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="flex gap-6 text-2xl mt-2">
                <button
                  onClick={() => {
                    handleUserClick();
                    setMobileMenuOpen(false);
                  }}
                  className="text-white hover:text-[#D6B45C] transition-all duration-300 hover:scale-110"
                >
                  <MdPerson />
                </button>
                <button
                  onClick={() => {
                    handleCartClick();
                    setMobileMenuOpen(false);
                  }}
                  className="text-white hover:text-[#D6B45C] transition-all duration-300 hover:scale-110 relative"
                >
                  <IoCartSharp />
                 
                    <span className="absolute -top-2 -right-2 bg-[#D6B45C] text-[#0A1D44] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {totalItems}
                    </span>
             
                </button>
              </div>
            </div>
          )}
        </nav>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
      <style jsx global>{`
        @keyframes fade-in-down {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.3s ease-out;
        }
      `}</style>
    </>
  )
}

export default Navbar1;
