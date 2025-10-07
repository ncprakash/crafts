// components/SuccessModal.tsx
import { useEffect } from 'react';

interface SuccessModalProps {
  paymentMethod: string;
  countdown: number;
}

export default function SuccessModal({ paymentMethod, countdown }: SuccessModalProps) {
  useEffect(() => {
    // Add any success animation or tracking here
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center">
          <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Order Confirmed!</h1>
          <p className="text-green-100">
            Thank you for your purchase
          </p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Order Details */}
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">🎉 Order Placed Successfully!</h2>
            <p className="text-gray-600 mb-4">
              {paymentMethod === 'cod' 
                ? 'Your order has been placed successfully. Please keep the payment ready for cash on delivery.'
                : 'Your order has been placed successfully. You will receive a confirmation email shortly.'}
            </p>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="font-semibold text-blue-900 mb-3">What happens next?</h3>
            <div className="space-y-3">
              {[
                "You'll receive an order confirmation email",
                "Our team will review and process your order within 24 hours",
                "You'll get shipping updates via email and SMS",
                "Your order will be delivered within 3-5 business days"
              ].map((step, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-semibold text-blue-600">{index + 1}</span>
                  </div>
                  <span className="text-sm text-blue-800">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Support Info */}
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-4">
              <p>Redirecting to dashboard in {countdown} seconds...</p>
            </div>
            <div className="border-t pt-4">
              <p className="text-sm text-gray-600">
                <strong>Need help?</strong><br />
                Contact us at gunnalcreation@gmail.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}