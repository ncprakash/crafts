import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ProductGalleryProps {
  cloudinaryImages: string[];
  productName: string;
}

export default function ProductGallery({ cloudinaryImages, productName }: ProductGalleryProps) {
  const images = cloudinaryImages || [];
  const [selectedImage, setSelectedImage] = useState(0);

  if (images.length === 0) return <div>No images available</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      
      {/* Main Image */}
      <div className="bg-white rounded-2xl p-8 shadow-xl">
        <Image
          src={images[selectedImage]}
          alt={productName}
          width={500}
          height={500}
          className="w-full h-96 object-contain"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`flex-shrink-0 w-20 h-20 bg-white rounded-lg p-2 shadow-md transition-all ${
                selectedImage === index ? 'ring-2 ring-[#FDC93B]' : 'hover:shadow-lg'
              }`}
            >
              <Image
                src={image}
                alt={`${productName} ${index + 1}`}
                width={80}
                height={80}
                className="w-full h-full object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
