// components/SignInPrompt.tsx
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SignInPrompt() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-white max-w-md w-full p-8 rounded-2xl shadow-xl text-center"
      >
        <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h2>
        <p className="text-gray-600 mb-6">You need to be signed in to view your cart and manage your items.</p>
        
        <Link href="/sign-in">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-8 py-3 rounded-xl transition-all duration-200 w-full"
          >
            Sign In to Continue
          </motion.button>
        </Link>
        
        <p className="text-sm text-gray-500 mt-4">
          New customer?{' '}
          <Link href="/sign-up" className="text-blue-600 hover:text-blue-700 font-semibold">
            Create an account
          </Link>
        </p>
      </motion.div>
    </section>
  );
}