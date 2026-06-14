import Image from "next/image";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

interface CustomizationData {
  uploadedImages?: string[];
  phoneType?: string;
}

interface ProductCustomizerProps {
  productType: "polaroid" | "phoneCase";
  itemId: string; // This is the OrderItem ID
  maxImages: number;
  orderId: string;
  onCustomizationComplete: (data: CustomizationData) => void;
}

const ProductCustomizer: React.FC<ProductCustomizerProps> = ({
  productType,
  itemId, // This should be the orderItemId
  maxImages,
  orderId,
  onCustomizationComplete,
}) => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [phoneType, setPhoneType] = useState<string>("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Update database with image URLs
  const updateOrderItemInDatabase = async (imageUrls: string[], phoneType?: string) => {
    try {
      const response = await fetch("/api/orders/updateOrderItem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderItemId: itemId, // This should match your API expectation
          imageUrls: imageUrls,
          phoneType: phoneType || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update database");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("❌ Database update error:", error);
      throw error;
    }
  };

  // Upload images to Cloudinary and update DB
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const totalAfterUpload = uploadedImages.length + files.length;
    
    if (totalAfterUpload > maxImages) {
      setUploadError(
        `You need to upload exactly ${maxImages} image${maxImages > 1 ? 's' : ''} for this order. ` +
        `You already have ${uploadedImages.length} image${uploadedImages.length !== 1 ? 's' : ''} ` +
        `and tried to add ${files.length} more.`
      );
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const uploadedUrls = await Promise.all(
        Array.from(files).map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append(
            "upload_preset",
            process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
          );

          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            { method: "POST", body: formData }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Cloudinary upload failed");
          }

          const data = await response.json();
          return data.secure_url;
        })
      );

      const updatedImagesList = [...uploadedImages, ...uploadedUrls];
      setUploadedImages(updatedImagesList);

      // Update the database with ALL image URLs
      await updateOrderItemInDatabase(updatedImagesList, phoneType);

      toast.success(`Uploaded ${uploadedUrls.length} image${uploadedUrls.length !== 1 ? 's' : ''}! ${updatedImagesList.length}/${maxImages} total`);
      
      // If reached exact quantity, auto-save
      if (updatedImagesList.length === maxImages) {
        handleSubmit();
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to upload image. Please try again.";
      setUploadError(errorMessage);
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  // Remove image from preview & update DB
  const removeImage = async (index: number) => {
    const updatedImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(updatedImages);

    try {
      await updateOrderItemInDatabase(updatedImages, phoneType);
      toast.success("Image removed");
    } catch (error) {
      console.error("Failed to remove image from database:", error);
      toast.error("Failed to remove image");
    }
  };

  // Submit customization
  const handleSubmit = async () => {
    // Validate exact image count matches quantity
    if (uploadedImages.length !== maxImages) {
      setUploadError(`Please upload exactly ${maxImages} image${maxImages > 1 ? 's' : ''} before saving.`);
      toast.error(`Need exactly ${maxImages} images`);
      return;
    }

    if (productType === "phoneCase" && !phoneType) {
      setUploadError("Please select your phone type");
      toast.error("Please select phone type");
      return;
    }

    try {
      // Final update to ensure everything is saved
      await updateOrderItemInDatabase(uploadedImages, phoneType);

      const customizationData: CustomizationData = {
        uploadedImages: uploadedImages,
        phoneType: productType === "phoneCase" ? phoneType : undefined,
      };

      onCustomizationComplete(customizationData);
      toast.success("Customization saved successfully!");
    } catch (error) {
      console.error("Final save error:", error);
      toast.error("Failed to save customization");
    }
  };

  // Discard all images and clear from database
  const handleDiscardAll = async () => {
    try {
      setUploadedImages([]);
      setPhoneType("");

      await updateOrderItemInDatabase([], undefined);
      toast.success("All customizations discarded");
    } catch (error) {
      console.error("Failed to discard customizations:", error);
      toast.error("Failed to discard");
    }
  };

  const remainingImages = maxImages - uploadedImages.length;
  const canSave = uploadedImages.length === maxImages && (productType !== "phoneCase" || phoneType);

  return (
    <div className="bg-[#faf9f7] rounded-xl p-6 border border-gray-100 space-y-6">
      {/* Debug Info */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <div className="text-xs text-yellow-800 font-mono space-y-1">
          <div><strong>Order ID:</strong> {orderId}</div>
          <div><strong>OrderItem ID:</strong> {itemId}</div>
          <div><strong>Database Status:</strong> {uploadedImages.length} images saved</div>
        </div>
      </div>

      {productType === "polaroid" && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Images ({uploadedImages.length}/{maxImages})
            </label>
            <p className="text-sm text-gray-600 mb-3">
              You need to upload exactly {maxImages} image{maxImages > 1 ? 's' : ''} for your order.
            </p>
            
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading || uploadedImages.length >= maxImages}
              className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100
                        disabled:opacity-50 disabled:cursor-not-allowed"
            />
            
            {uploadError && (
              <p className="text-red-500 text-sm mt-2">{uploadError}</p>
            )}
            
            {isUploading && (
              <p className="text-blue-500 text-sm mt-2">Uploading to Cloudinary...</p>
            )}

            {remainingImages > 0 && !isUploading && (
              <p className="text-green-600 text-sm mt-2">
                {remainingImages} image{remainingImages > 1 ? 's' : ''} remaining
              </p>
            )}

            {uploadedImages.length === maxImages && (
              <p className="text-green-600 text-sm mt-2 font-medium">
                ✓ All {maxImages} images uploaded and saved to database!
              </p>
            )}
          </div>

          {uploadedImages.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-900">Uploaded Images</h4>
                <button
                  type="button"
                  onClick={handleDiscardAll}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Discard All
                </button>
              </div>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {uploadedImages.map((url, idx) => (
                  <div key={idx} className="relative group">
                    <Image
                      src={url}
                      alt={`Uploaded ${idx + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      width={200}
                      height={200}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      &times;
                    </button>
                    <div className="absolute bottom-1 left-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                      {idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {productType === "phoneCase" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Phone Type *
          </label>
          <select
            value={phoneType}
            onChange={(e) => {
              setPhoneType(e.target.value);
              // Update database when phone type changes
              if (uploadedImages.length > 0) {
                updateOrderItemInDatabase(uploadedImages, e.target.value);
              }
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Phone Model</option>
            <option value="iPhone 15 Pro">iPhone 15 Pro</option>
            <option value="iPhone 15">iPhone 15</option>
            <option value="iPhone 14 Pro">iPhone 14 Pro</option>
            <option value="iPhone 14">iPhone 14</option>
            <option value="Samsung S23">Samsung S23</option>
            <option value="Samsung S22">Samsung S22</option>
            <option value="Other">Other Model</option>
          </select>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={handleDiscardAll}
          disabled={uploadedImages.length === 0 && !phoneType}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Discard All
        </button>
        
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSave}
          className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          {uploadedImages.length === maxImages ? 'Save Customization' : `Upload ${remainingImages} More Image${remainingImages !== 1 ? 's' : ''}`}
        </button>
      </div>
    </div>
  );
};

export default ProductCustomizer;