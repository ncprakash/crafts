'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Mail } from 'lucide-react';

function VerifyPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error' | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setVerificationStatus('error');
      setMessage('No verification token found. Please check your email for the verification link. If you haven\'t received an email, please try signing up again.');
      return;
    }

    const verifyEmail = async () => {
      try {
        setVerificationStatus('loading');
        const response = await fetch(`/api/verify?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setVerificationStatus('success');
          setMessage(data.message);
        } else {
          setVerificationStatus('error');
          setMessage(data.message || 'Verification failed');
        }
      } catch (error) {
        setVerificationStatus('error');
        setMessage('An error occurred during verification');
      }
    };

    verifyEmail();
  }, [searchParams]);

  const handleRedirect = () => {
    router.push('/sign-in');
  };

  if (verificationStatus === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Verifying your email...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        {verificationStatus === 'success' ? (
          <div className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <Button 
              onClick={handleRedirect}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Continue to Sign In
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <XCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-2">
              <Button 
                onClick={handleRedirect}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Go to Sign In
              </Button>
              <Button 
                onClick={() => router.push('/sign-up')}
                variant="outline"
                className="w-full"
              >
                Try Sign Up Again
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Verifying your email...</p>
      </div>
    }>
      <VerifyPageContent />
    </Suspense>
  );
}
