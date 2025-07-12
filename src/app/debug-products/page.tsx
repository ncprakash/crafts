'use client';
import { useState, useEffect } from 'react';

export default function DebugProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products');
      const data = await response.json();
      console.log('Products response:', response.status, data);
      if (response.ok) {
        setProducts(data);
      } else {
        setError(data.error || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const testSingleProduct = async (productId: string) => {
    try {
      console.log('Testing single product fetch for ID:', productId);
      const response = await fetch(`/api/admin/products/${productId}`);
      const data = await response.json();
      console.log('Single product response:', response.status, data);
      alert(`Product ${productId}: ${response.status} - ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      console.error('Error testing single product:', error);
      alert('Error testing single product');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Products</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">All Products ({products.length})</h2>
        {products.length === 0 ? (
          <p className="text-gray-600">No products found in database</p>
        ) : (
          <div className="space-y-2">
            {products.map((product: any) => (
              <div key={product.id} className="border p-3 rounded">
                <div className="flex justify-between items-center">
                  <div>
                    <strong>{product.name}</strong> - ID: {product.id}
                  </div>
                  <button
                    onClick={() => testSingleProduct(product.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Test Single Fetch
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Test URL Parameters</h2>
        <p className="text-sm text-gray-600 mb-2">
          Try these URLs to test the view page:
        </p>
        {products.length > 0 && (
          <div className="space-y-2">
            {products.slice(0, 3).map((product: any) => (
              <div key={product.id} className="bg-gray-100 p-2 rounded">
                <a 
                  href={`/view?id=${product.id}`}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                >
                  /view?id={product.id} - {product.name}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 