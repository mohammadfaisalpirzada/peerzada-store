// app/auth/signin/page.tsx
'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';

export default function SignInPageWrapper() {
  return (
    <Suspense>
      <SignIn />
    </Suspense>
  );
}

function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(
    searchParams.get('error') || null
  );
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const handleSocialSignIn = async (provider: 'google' | 'github') => {
    try {
      await signIn(provider, {
        callbackUrl,
      });
    } catch (error) {
      console.error('SignIn error:', error);
      setError('An error occurred during sign in');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          {error && (
            <div className="mt-2 p-2 text-center text-sm text-red-600 bg-red-100 rounded">
              {error === 'Callback' 
                ? 'Sign in was canceled' 
                : 'An error occurred during sign in'}
            </div>
          )}
        </div>
        <div className="mt-8 space-y-4">
          <button
            onClick={() => handleSocialSignIn('google')}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Sign in with Google
          </button>
          <button
            onClick={() => handleSocialSignIn('github')}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Sign in with GitHub
          </button>
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}