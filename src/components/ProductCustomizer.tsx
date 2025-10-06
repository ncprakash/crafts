'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

interface ProductCustomizerProps {
  productType: string; // "polaroid" or "phoneCase"
  onCustomizationComplete: (customizationData: CustomizationData) => void;
}

export interface CustomizationData {
  phoneType?: string;
  uploadedImages?: string[];
}

const PHONE_TYPES = [
  // iPhone Models
  "iPhone 11",
  "iPhone 11 Pro",
  "iPhone 11 Pro Max",
  "iPhone 12",
  "iPhone 12 Mini",
  "iPhone 12 Pro",
  "iPhone 12 Pro Max",
  "iPhone 13",
  "iPhone 13 Mini",
  "iPhone 13 Pro",
  "iPhone 13 Pro Max",
  "iPhone 14",
  "iPhone 14 Plus",
  "iPhone 14 Pro",
  "iPhone 14 Pro Max",
  "iPhone 15",
  "iPhone 15 Plus",
  "iPhone 15 Pro",
  "iPhone 15 Pro Max",
  "iPhone 16",
  "iPhone 16 Plus",
  "iPhone 16 Pro",
  "iPhone 16 Pro Max",
  
  // Samsung Galaxy S Series
  "Samsung Galaxy S20",
  "Samsung Galaxy S20 Plus",
  "Samsung Galaxy S20 Ultra",
  "Samsung Galaxy S21",
  "Samsung Galaxy S21 Plus",
  "Samsung Galaxy S21 Ultra",
  "Samsung Galaxy S22",
  "Samsung Galaxy S22 Plus",
  "Samsung Galaxy S22 Ultra",
  "Samsung Galaxy S23",
  "Samsung Galaxy S23 Plus",
  "Samsung Galaxy S23 Ultra",
  "Samsung Galaxy S24",
  "Samsung Galaxy S24 Plus",
  "Samsung Galaxy S24 Ultra",
  
  // Samsung Galaxy A Series (Popular Models)
  "Samsung Galaxy A52",
  "Samsung Galaxy A53",
  "Samsung Galaxy A54",
  "Samsung Galaxy A72",
  "Samsung Galaxy A73",
  
  // Google Pixel
  "Google Pixel 6",
  "Google Pixel 6 Pro",
  "Google Pixel 7",
  "Google Pixel 7 Pro",
  "Google Pixel 8",
  "Google Pixel 8 Pro",
  
  // OnePlus
  "OnePlus 9",
  "OnePlus 9 Pro",
  "OnePlus 10 Pro",
  "OnePlus 11",
  "OnePlus 12",
  
  // Xiaomi
  "Xiaomi Mi 11",
  "Xiaomi 12",
  "Xiaomi 13",
  "Xiaomi 14",
  
  // Others
  "Nothing Phone 1",
  "Nothing Phone 2",
];

export default function ProductCustomizer({ productType, onCustomizationComplete }: ProductCustomizerProps) {
  const [phoneType, setPhoneType] = useState<string>("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Check if adding these files would exceed the 12 image limit for polaroids
    if (productType === 'polaroid' && uploadedImages.length + files.length > 12) {
      setUploadError(`You can only upload up to 12 images for polaroids. You already have ${uploadedImages.length} images.`);
      return;
    }
    
    setIsUploading(true);
    setUploadError(null);
    
    try {
      const uploadedUrls = await Promise.all(
        Array.from(files).map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');
          
          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
              method: 'POST',
              body: formData,
            }
          );
          
          if (!response.ok) {
            throw new Error('Upload failed');
          }
          
          const data = await response.json();
          return data.secure_url;
        })
      );
      
      setUploadedImages((prev) => [...prev, ...uploadedUrls]);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const customizationData: CustomizationData = {};
    
    if (productType === 'phoneCase' && phoneType) {
      customizationData.phoneType = phoneType;
    }
    
    if (uploadedImages.length > 0) {
      customizationData.uploadedImages = uploadedImages;
    }
    
    onCustomizationComplete(customizationData);
  };

  return (
    <div className="space-y-6 p-4 border rounded-lg">
      <h3 className="text-lg font-medium">Customize Your Product</h3>
      
      {productType === 'phoneCase' && (
        <div className="space-y-2">
          <Label htmlFor="phoneType">Select Phone Model</Label>
          <Select value={phoneType} onValueChange={setPhoneType}>
            <SelectTrigger>
              <SelectValue placeholder="Select phone model" />
            </SelectTrigger>
            <SelectContent>
              {PHONE_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      {productType === 'polaroid' && (
        <div className="space-y-2">
          <Label htmlFor="imageUpload">
            Upload Images for Polaroid (Max 12)
          </Label>
          <Input
            id="imageUpload"
            type="file"
            accept="image/*"
            multiple={true}
            onChange={handleImageUpload}
            disabled={isUploading || uploadedImages.length >= 12}
          />
          {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}
          
          {isUploading && (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Uploading...</span>
            </div>
          )}
          
          {uploadedImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {uploadedImages.map((url, index) => (
                <div key={index} className="relative">
                  <Image
                    src={url}
                    alt={`Uploaded image ${index + 1}`}
                    width={150}
                    height={150}
                    className="object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <p className="text-sm text-gray-500">
            {uploadedImages.length}/12 images uploaded
          </p>
        </div>
      )}
      
      <Button 
        onClick={handleSubmit}
        disabled={
          (productType === 'phoneCase' && !phoneType) || 
          (productType === 'polaroid' && uploadedImages.length === 0) ||
          isUploading
        }
      >
        Apply Customization
      </Button>
    </div>
  );
}