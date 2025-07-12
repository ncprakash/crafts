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

function Navbar1() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { totalItems } = useCart();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [serverCartCount, setServerCartCount] = useState(0);

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
    if (status === 'loading') return; // Don't do anything while loading
    
    if (session) {
      // Check if user is admin
      if (session.user?.role === 'admin') {
        // Admin users go to admin panel
        router.push('/admin');
      } else {
        // Regular users go to dashboard
        router.push('/dashboard');
      }
    } else {
      // User is not authenticated, show modal
      setShowAuthModal(true);
    }
  };

  const handleCartClick = () => {
    if (status === 'loading') return; // Don't do anything while loading
    
    if (session) {
      // User is authenticated, go to cart
      router.push('/cart');
    } else {
      // User is not authenticated, show modal
      setShowAuthModal(true);
    }
  };
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
              GUNNAL CREATION
            </span>
           
          
          </div>
           </Link>
           

          {/* Navigation Links with gold accent */}
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

          {/* Icons with bounce effect */}
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
              {(totalItems > 0 || serverCartCount > 0) && (
                <span className="absolute -top-2 -right-2 bg-[#D6B45C] text-[#0A1D44] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {totalItems > 0 ? totalItems : serverCartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Secondary gold bar */}
       
      </nav>
    </div>

    {/* Auth Modal */}
    <AuthModal 
      isOpen={showAuthModal} 
      onClose={() => setShowAuthModal(false)} 
    />
    </>
  )
}

export default Navbar1
