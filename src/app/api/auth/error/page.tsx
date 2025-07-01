// app/auth/error/page.tsx
'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function AuthErrorPageWrapper() {
  return (
    <Suspense>
      <AuthError />
    </Suspense>
  );
}

function AuthError() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const handleTryAgain = async () => {
    await signIn('google', { 
      callbackUrl: callbackUrl,
      redirect: true 
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Authentication Error !</h2>
        <div className="bg-red-100 p-4 rounded-md">
          <p className="text-red-700">
            {error === 'Callback'
              ? 'Sign in was canceled. Please try again.'
              : 'An error occurred during authentication.'}
          </p>
        </div>
        <div className="mt-4 space-y-4">
          <button
            onClick={handleTryAgain}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Try Again with Google
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
}