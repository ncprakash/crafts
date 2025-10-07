// components/ProductCustomizer.tsx
import React, { useState, useCallback } from 'react';
import { Upload, X, AlertCircle, CheckCircle } from 'lucide-react';

interface ProductCustomizerProps {
  productType: "polaroid" | "phoneCase";
  itemId: string;
  maxImages: number; // Add this prop
  onCustomizationComplete: (data: { uploadedImages: string[]; phoneType?: string }) => void;
}

export default function ProductCustomizer({ 
  productType, 
  itemId, 
  maxImages,
  onCustomizationComplete 
}: ProductCustomizerProps) {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [phoneType, setPhoneType] = useState('');

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages: string[] = [];
    const remainingSlots = maxImages - uploadedImages.length;

    // Only process up to the remaining available slots
    for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
      const file = files[i];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const result = e.target?.result as string;
        newImages.push(result);
        
        // When all new images are processed, update state
        if (newImages.length === Math.min(files.length, remainingSlots)) {
          setUploadedImages(prev => [...prev, ...newImages]);
        }
      };
      
      reader.readAsDataURL(file);
    }

    event.target.value = ''; // Reset input
  }, [maxImages, uploadedImages.length]);

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (uploadedImages.length === 0) {
      alert('Please upload at least one image');
      return;
    }

    if (productType === 'phoneCase' && !phoneType) {
      alert('Please select your phone type');
      return;
    }

    onCustomizationComplete({
      uploadedImages,
      phoneType: productType === 'phoneCase' ? phoneType : undefined
    });
  };

  const remainingUploads = maxImages - uploadedImages.length;
  const isMaxReached = uploadedImages.length >= maxImages;

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
        {!isMaxReached ? (
          <>
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Upload your images
            </p>
            <p className="text-sm text-gray-600 mb-4">
              You can upload up to {maxImages} image{maxImages > 1 ? 's' : ''} ({remainingUploads} remaining)
            </p>
            <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
              <Upload className="w-4 h-4 mr-2" />
              Choose Images
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={isMaxReached}
              />
            </label>
          </>
        ) : (
          <>
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-green-900 mb-2">
              Maximum images reached
            </p>
            <p className="text-sm text-green-700">
              You've uploaded all {maxImages} images. You can remove some if you want to change.
            </p>
          </>
        )}
      </div>

      {/* Phone Type Selection (for phone cases) */}
      {productType === 'phoneCase' && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Select Your Phone Model *
          </label>
          <select
            value={phoneType}
            onChange={(e) => setPhoneType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Choose your phone</option>
            <option value="iphone-15">iPhone 15</option>
            <option value="iphone-15-pro">iPhone 15 Pro</option>
            <option value="iphone-14">iPhone 14</option>
            <option value="iphone-14-pro">iPhone 14 Pro</option>
            <option value="samsung-s23">Samsung S23</option>
            <option value="samsung-s22">Samsung S22</option>
            <option value="other">Other Model</option>
          </select>
        </div>
      )}

      {/* Uploaded Images Preview */}
      {uploadedImages.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">
            Uploaded Images ({uploadedImages.length}/{maxImages})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {uploadedImages.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border border-gray-200"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
                <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Indicator */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600">Upload Progress</span>
          <span className="font-medium">
            {uploadedImages.length} / {maxImages}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(uploadedImages.length / maxImages) * 100}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {remainingUploads > 0 
            ? `${remainingUploads} image${remainingUploads > 1 ? 's' : ''} remaining`
            : 'All images uploaded!'
          }
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={handleSubmit}
          disabled={uploadedImages.length === 0 || (productType === 'phoneCase' && !phoneType)}
          className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Save Customizations
        </button>
      </div>
    </div>
  );
}