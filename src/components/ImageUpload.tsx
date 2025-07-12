'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  onImageRemove?: (imageUrl: string) => void;
  multiple?: boolean;
  maxFiles?: number;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
  className?: string;
  placeholder?: string;
  currentImages?: string[];
}

export default function ImageUpload({
  onImageUpload,
  onImageRemove,
  multiple = false,
  maxFiles = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  maxSize = 5, // 5MB default
  className = '',
  placeholder = 'Upload images',
  currentImages = []
}: ImageUploadProps) {
  const [uploadedImages, setUploadedImages] = useState<string[]>(currentImages);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (files: FileList) => {
    setIsUploading(true);
    
    try {
      const fileArray = Array.from(files);
      
      // Validate file count
      if (uploadedImages.length + fileArray.length > maxFiles) {
        alert(`You can only upload up to ${maxFiles} images`);
        return;
      }

      // Validate file types and sizes
      for (const file of fileArray) {
        if (!acceptedTypes.includes(file.type)) {
          alert(`File type ${file.type} is not supported`);
          return;
        }
        
        if (file.size > maxSize * 1024 * 1024) {
          alert(`File ${file.name} is too large. Maximum size is ${maxSize}MB`);
          return;
        }
      }

      // Simulate file upload - replace with actual upload logic
      for (const file of fileArray) {
        // In a real application, you would upload to a cloud service like AWS S3, Cloudinary, etc.
        const imageUrl = await simulateFileUpload(file);
        
        const newImages = [...uploadedImages, imageUrl];
        setUploadedImages(newImages);
        onImageUpload(imageUrl);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Error uploading files. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const simulateFileUpload = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        // For demo purposes, we'll use the data URL
        // In production, upload to your server or cloud service
        const imageUrl = e.target?.result as string;
        resolve(imageUrl);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files);
    }
  };

  const removeImage = (imageUrl: string) => {
    const newImages = uploadedImages.filter(img => img !== imageUrl);
    setUploadedImages(newImages);
    onImageRemove?.(imageUrl);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="hidden"
        />
        
        <div className="space-y-2">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-900">
              {isUploading ? 'Uploading...' : placeholder}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {multiple ? 'Drag and drop multiple images here, or click to select' : 'Drag and drop an image here, or click to select'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Supported formats: {acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')} • Max size: {maxSize}MB
            </p>
          </div>
        </div>
        
        <button
          type="button"
          onClick={openFileDialog}
          disabled={isUploading}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? 'Uploading...' : 'Choose Files'}
        </button>
      </div>

      {/* Uploaded Images */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {uploadedImages.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {imageUrl.startsWith('data:') ? (
                  <img
                    src={imageUrl}
                    alt={`Uploaded image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={imageUrl}
                    alt={`Uploaded image ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              
              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeImage(imageUrl)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span>Uploading images...</span>
        </div>
      )}
    </div>
  );
} 