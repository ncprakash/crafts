"use client";

import React, { useEffect, useState } from "react";

interface OrderItemData {
  imageUrls?: string[];
  phoneType?: string | null;
  product?: {
    name: string;
    category?: { name: string };
  };
}

interface AdminOrderItemProps {
  orderItemId: string;
}

const AdminOrderItem: React.FC<AdminOrderItemProps> = ({ orderItemId }) => {
  const [data, setData] = useState<OrderItemData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/getImagesOrPhoneType/${orderItemId}`);
        if (!response.ok) {
          console.error(`Order item ${orderItemId} not found or failed to fetch.`);
          setData(null);
          return;
        }

        // Parse the response only once
        const result: OrderItemData[] = await response.json();
        setData(result[0] || null);
      } catch (err) {
        console.warn(`Order item ${orderItemId} fetch failed:`, err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderItemId]);

  if (loading) return <p>Loading...</p>;
  if (!data) return null;

  const { imageUrls, phoneType, product } = data;
  const name = product?.name?.toLowerCase() || "";
  const category = product?.category?.name?.toLowerCase() || "";

  const isCustomizable =
    name.includes("polaroid") ||
    category.includes("polaroid") ||
    name.includes("phone") ||
    category.includes("phone");

  if (!isCustomizable) return null;

  return (
    <div className="border rounded-xl p-4 shadow-sm bg-white hover:shadow-md transition mb-6">
      <h3 className="font-semibold text-gray-800 mb-3">{product?.name}</h3>

      {phoneType && (
        <p className="text-sm text-gray-500 mb-2">Phone Type: {phoneType}</p>
      )}

      {imageUrls && imageUrls.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {imageUrls.map((url, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <img
                src={url}
                alt={`Uploaded ${product?.name}`}
                className="w-full h-32 object-contain rounded-lg"
              />
              <a
                href={url}
                download
                className="mt-2 text-sm text-blue-600 hover:underline"
              >
                Download
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No uploaded images.</p>
      )}
    </div>
  );
};

export default AdminOrderItem;
