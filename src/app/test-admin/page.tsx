'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function TestAdminPage() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkAdminUser = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/debug-user');
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      setUserData({ error: 'Failed to check admin user' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin User Debug</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Check Admin User</h2>
          <Button 
            onClick={checkAdminUser}
            disabled={loading}
            className="mb-4"
          >
            {loading ? 'Checking...' : 'Check Admin User in Database'}
          </Button>
          
          {userData && (
            <div className={`p-4 rounded-lg ${
              userData.status === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              <pre className="text-sm overflow-auto max-h-96">
                {JSON.stringify(userData, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Debugging Steps</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Click "Check Admin User" to see if the user exists in database</li>
            <li>Check the browser console (F12) for authentication logs</li>
            <li>Try signing in with gunnalcreations@gmail.com / gunnal@1212</li>
            <li>Look for the console logs to see where the issue is</li>
          </ol>
        </div>

        <div className="mt-6 flex space-x-4">
          <a 
            href="/sign-in" 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Try Sign In
          </a>
          <a 
            href="/admin" 
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Go to Admin
          </a>
        </div>
      </div>
    </div>
  );
} 