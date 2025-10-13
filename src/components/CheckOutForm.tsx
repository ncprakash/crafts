// components/CheckoutForm.tsx
import { useState } from 'react';
import ProductCustomizer from "@/components/ProductCustomizer";

interface FormData {
  first: string;
  last: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  state: string;
  country: string;
  coupon: string;
}

interface CartItem {
  id: string;
  product: {
    id: string;
    name: string;
    description?: string;
    images?: string;
    cloudinaryImages?: string[]; // Add image fields
    category?: {
      name: string;
    };
  };
  quantity: number;
}

interface CustomizationData {
  uploadedImages?: string[];
  phoneType?: string;
}

interface CheckoutFormProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  cartItems: CartItem[];
  customizationData: CustomizationData | null;
  setCustomizationData: (data: CustomizationData) => void;
  orderId?: string;
}

export default function CheckoutForm({
  formData,
  setFormData,
  cartItems,
  customizationData,
  setCustomizationData,
  orderId
}: CheckoutFormProps) {
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [currentCustomizingItem, setCurrentCustomizingItem] = useState<CartItem | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    let validatedValue = value;
    switch (name) {
      case 'first':
      case 'last':
        validatedValue = value.replace(/[^a-zA-Z\s-]/g, '');
        break;
      case 'phone':
        validatedValue = value.replace(/[^0-9\s\-+]/g, '');
        break;
      case 'zip':
        validatedValue = value.replace(/[^0-9a-zA-Z]/g, '');
        break;
      case 'city':
      case 'state':
      case 'country':
        validatedValue = value.replace(/[^a-zA-Z\s-]/g, '');
        break;
      case 'email':
        validatedValue = value.replace(/[^a-zA-Z0-9@._-]/g, '');
        break;
      default:
        validatedValue = value;
    }
    
    setFormData({ ...formData, [name]: validatedValue });
  };

  const handleCustomize = (item: CartItem) => {
    setCurrentCustomizingItem(item);
    setShowCustomizer(true);
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Shipping Information</h2>
      
      <div className="space-y-6">
        {/* Coupon Section */}
      

        {/* Personalization Section */}
        {cartItems.map((item) => {
          const name = item.product?.name?.toLowerCase() || "";
          const category = item.product?.category?.name?.toLowerCase() || "";
          const description = item.product?.description?.toLowerCase() || "";
          
          // More comprehensive customization detection
          const isCustomizable = 
            name.includes("polaroid") || 
            name.includes("phone") || 
            name.includes("custom") ||
            category.includes("polaroid") || 
            category.includes("phone") ||
            category.includes("custom") ||
            description.includes("custom") ||
            description.includes("personalize");

          // Debug logging
          console.log("🔍 Checking item for customization:", {
            itemId: item.id,
            productName: item.product?.name,
            categoryName: item.product?.category?.name,
            productDescription: item.product?.description,
            name: name,
            category: category,
            description: description,
            isCustomizable: isCustomizable
          });

          if (!isCustomizable) return null;

          return (
            <div key={`customizer-${item.id}`} className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-blue-900">
                    Personalize Your {name.includes("phone") ? "Phone Case" : "Polaroid"}
                  </h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Make it uniquely yours with custom images
                  </p>
                </div>
                <button
                  onClick={() => handleCustomize(item)}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Customize
                </button>
              </div>
            </div>
          );
        })}

        {/* Debug Section - Show all cart items */}
        {cartItems.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Debug: All Cart Items</h3>
            <div className="space-y-2">
              {cartItems.map((item) => (
                <div key={`debug-${item.id}`} className="text-sm text-gray-600">
                  <strong>Product:</strong> {item.product?.name || 'Unknown'} | 
                  <strong> Category:</strong> {item.product?.category?.name || 'Unknown'} |
                  <strong> Quantity:</strong> {item.quantity}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <input
              name="first"
              type="text"
              value={formData.first}
              onChange={handleChange}
              maxLength={50}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="John"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            <input
              name="last"
              type="text"
              value={formData.last}
              onChange={handleChange}
              maxLength={50}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Doe"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            maxLength={100}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            maxLength={15}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="+91 98765 43210"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shipping Address *
          </label>
          <textarea
            name="address"
            rows={3}
            value={formData.address}
            onChange={handleChange}
            maxLength={200}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Enter your complete address"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <input
              name="city"
              type="text"
              value={formData.city}
              onChange={handleChange}
              maxLength={50}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Mumbai"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ZIP Code *
            </label>
            <input
              name="zip"
              type="text"
              value={formData.zip}
              onChange={handleChange}
              maxLength={10}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="400001"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State *
            </label>
            <input
              name="state"
              type="text"
              value={formData.state}
              onChange={handleChange}
              maxLength={50}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Maharashtra"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country *
            </label>
            <input
              name="country"
              type="text"
              value={formData.country}
              onChange={handleChange}
              maxLength={50}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="India"
            />
          </div>
        </div>
      </div>

      {/* Customizer Modal */}
{showCustomizer && currentCustomizingItem && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Customize Your Product</h3>
          <button
            onClick={() => setShowCustomizer(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <ProductCustomizer
          itemId={currentCustomizingItem.id}
          productType={
            currentCustomizingItem.product?.name?.toLowerCase().includes("phone") ? 
            "phoneCase" : "polaroid"
          }
          maxImages={currentCustomizingItem.quantity} // Quantity determines max images
          orderId={orderId || ""} // Pass the order ID here
          onCustomizationComplete={(data) => {
            setCustomizationData(data);
            setShowCustomizer(false);
          }}
        />
      </div>
    </div>
  </div>
)}
    </div>
  );
}