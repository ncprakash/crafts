import React, { useState } from "react";
import { toast } from "react-hot-toast";

interface CustomizationData {
  uploadedImages?: string[];
  phoneType?: string;
}

interface ProductCustomizerProps {
  productType: "polaroid" | "phoneCase";
  itemId: string; // OrderItem ID
  onCustomizationComplete: (data: CustomizationData) => void;
}

const ProductCustomizer: React.FC<ProductCustomizerProps> = ({
  productType,
  itemId,
  onCustomizationComplete,
}) => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [phoneType, setPhoneType] = useState<string>("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Upload images to Cloudinary and update DB
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    itemId: string
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (productType === "polaroid" && uploadedImages.length + files.length > 12) {
      setUploadError(
        `You can only upload up to 12 images for polaroids. You already have ${uploadedImages.length} images.`
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

          if (!response.ok) throw new Error("Upload failed");

          const data = await response.json();
          console.log(data.secure_url);
          return data.secure_url;
        })
      );

      // Create the updated images array FIRST
      const updatedImagesList = [...uploadedImages, ...uploadedUrls];
      
      // Update frontend state
      setUploadedImages(updatedImagesList);
      
      console.log("=== Frontend Debug ===");
      console.log("itemId:", itemId);
      console.log("phoneType:", phoneType);
      console.log("updatedImagesList:", updatedImagesList);
      console.log("updatedImagesList length:", updatedImagesList.length);
      
      // Update backend with the NEW combined array
      const response = await fetch("/api/orders/updateOrderItem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderItemId: itemId,
          imageUrls: updatedImagesList,
          phoneType: phoneType || undefined,
        }),
      });

      console.log("Response status:", response.status);
      console.log("Response Content-Type:", response.headers.get("content-type"));

      // Get the response as text first to see what we're actually getting
      const responseText = await response.text();
      console.log("Raw response:", responseText.substring(0, 500));

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      // Try to parse as JSON
      let result;
      try {
        result = JSON.parse(responseText);
        console.log("API Response:", result);
      } catch (parseError) {
        console.error("Failed to parse JSON. Response was:", responseText);
        throw new Error("Server returned invalid JSON");
      }

      toast.success("Images uploaded and saved successfully!");
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || "Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Remove image from preview & update DB
  const removeImage = async (index: number, itemId: string) => {
    const updatedImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(updatedImages);

    // Update backend
    await fetch("/api/order/updateOrderItem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderItemId: itemId, imageUrls: updatedImages }),
    });
  };

  // Submit customization (images + phoneType)
  const handleSubmit = (itemId: string) => {
    const customizationData: CustomizationData = {};

    if (productType === "phoneCase" && phoneType) {
      customizationData.phoneType = phoneType;
    }

    if (uploadedImages.length > 0) {
      customizationData.uploadedImages = uploadedImages;
    }

    onCustomizationComplete(customizationData);
    toast.success("Customization saved successfully!");
  };

  return (
    <div className="bg-[#faf9f7] rounded-xl p-4 border border-gray-100">
      {productType === "polaroid" && (
        <>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Images
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleImageUpload(e, itemId)}
            className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
          />
          {uploadError && <p className="text-red-500 text-sm mt-2">{uploadError}</p>}
          {isUploading && <p className="text-gray-500 text-sm mt-2">Uploading...</p>}

          {/* Preview uploaded images */}
          {uploadedImages.length > 0 && (
            <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {uploadedImages.map((url, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={url}
                    alt={`Uploaded ${idx + 1}`}
                    className="w-full h-24 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx, itemId)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {productType === "phoneCase" && (
        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Phone Type
          </label>
          <select
            value={phoneType}
            onChange={(e) => setPhoneType(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full"
          >
            <option value="">Select</option>
            <option value="iPhone 14 Pro">iPhone 14 Pro</option>
            <option value="iPhone 14">iPhone 14</option>
            <option value="Samsung S23">Samsung S23</option>
          </select>
        </div>
      )}

      <button
        type="button"
        onClick={() => handleSubmit(itemId)}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Save Customization
      </button>
    </div>
  );
};

export default ProductCustomizer;