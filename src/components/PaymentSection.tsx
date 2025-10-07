// components/PaymentSection.tsx
import { useState } from 'react';

interface PaymentSectionProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  total: number;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function PaymentSection({
  paymentMethod,
  setPaymentMethod,
  total,
  isSubmitting,
  onSubmit
}: PaymentSectionProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const paymentMethods = [
    {
      id: 'razorpay',
      name: 'Online Payment',
      description: 'Credit/Debit Card, UPI, Net Banking',
      icon: '💳',
      popular: true
    }
  ];

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Payment Method</h2>

      {/* Payment Methods */}
      <div className="space-y-4 mb-6">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all ${
              paymentMethod === method.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setPaymentMethod(method.id)}
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-lg">
                {method.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-gray-900">{method.name}</h3>
                  {method.popular && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      Popular
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{method.description}</p>
              </div>
              <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
                paymentMethod === method.id
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300'
              }`}>
                {paymentMethod === method.id && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Security Badge */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-gray-900">Secure Payment</p>
            <p className="text-xs text-gray-600">Your payment information is encrypted</p>
          </div>
        </div>
      </div>

      {/* Place Order Button */}
      <button
        type="submit"
        onClick={onSubmit}
        disabled={isSubmitting}
        className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Processing...</span>
          </div>
        ) : (
          `Place Order - ${formatCurrency(total)}`
        )}
      </button>

      {/* Guarantee */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-600">
          🔒 Your order is secured with 256-bit SSL encryption
        </p>
      </div>
    </div>
  );
}