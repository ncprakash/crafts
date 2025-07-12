'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function DebugDBPage() {
  const [dbData, setDbData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testDatabase = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/test-db');
      const data = await response.json();
      setDbData(data);
    } catch (error) {
      setDbData({ error: 'Failed to test database' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Database Debug</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Database Connection</h2>
          <Button 
            onClick={testDatabase}
            disabled={loading}
            className="mb-4"
          >
            {loading ? 'Testing...' : 'Test Database Connection'}
          </Button>
          
          {dbData && (
            <div className={`p-4 rounded-lg ${
              dbData.status === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              <pre className="text-sm overflow-auto max-h-96">
                {JSON.stringify(dbData, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Debugging Steps</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Click "Test Database Connection" to see all users in database</li>
            <li>Check if gunnalcreations@gmail.com exists in the list</li>
            <li>If user exists, check if isVerified is true</li>
            <li>Try signing in with the exact email and password</li>
            <li>Check browser console (F12) for detailed logs</li>
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
            href="/test-admin" 
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Admin Debug
          </a>
        </div>
      </div>
    </div>
  );
} 