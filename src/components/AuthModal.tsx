'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleSignIn = () => {
    router.push('/sign-in');
    onClose();
  };

  const handleSignUp = () => {
    router.push('/sign-up');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Modal content */}
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Sign In Required
          </h2>
          
          <p className="text-gray-600 mb-6">
            Please sign in to your account to continue. Don't have an account? Sign up to get started.
          </p>

          <div className="space-y-3">
            <Button 
              onClick={handleSignIn}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Sign In
            </Button>
            
            <Button 
              onClick={handleSignUp}
              variant="outline"
              className="w-full"
            >
              Create Account
            </Button>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
} 