// components/CheckoutHeader.tsx
import Link from 'next/link';

interface CheckoutHeaderProps {
  itemCount: number;
  total: number;
}

export default function CheckoutHeader({ itemCount, total }: CheckoutHeaderProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/cart" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Cart
          </Link>
        </div>
        
        <div className="text-right">
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          <p className="text-sm text-gray-600 mt-1">
            {itemCount} item{itemCount !== 1 ? 's' : ''} • {formatCurrency(total)}
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          {['Cart', 'Information', 'Payment', 'Confirmation'].map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                index === 0 
                  ? 'bg-blue-600 text-white' 
                  : index === 1 
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {index < 2 ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                index <= 1 ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {step}
              </span>
              {index < 3 && (
                <div className={`w-12 h-0.5 mx-4 ${
                  index < 1 ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}