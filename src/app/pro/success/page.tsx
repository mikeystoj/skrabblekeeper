'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

function SuccessContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      // Payment was successful
      setStatus('success');
    } else {
      setStatus('error');
    }
  }, [sessionId]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-[#1e3a5f] border-t-transparent 
            rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-[#1e3a5f]">Processing...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center p-4">
        <div className="bg-[#faf8f5] rounded-xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="text-4xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-[#1e3a5f] mb-2">Something went wrong</h1>
          <p className="text-[#1e3a5f]/70 mb-6">
            We couldn&apos;t verify your payment. Please contact support if you were charged.
          </p>
          <Link
            href="/"
            className="inline-block py-2.5 px-6 bg-[#1e3a5f] hover:bg-[#162d4d] 
              text-[#f5f0e8] font-medium rounded-lg transition-colors"
          >
            Back to App
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center p-4">
      <div className="bg-[#faf8f5] rounded-xl shadow-xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-[#1e3a5f] px-6 py-8 text-center">
          <div className="text-5xl mb-3">🎉</div>
          <h1 className="text-2xl font-bold text-[#f5f0e8]">Thank You!</h1>
          <p className="text-[#f5f0e8]/80 mt-2">Your purchase was successful</p>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <Image
            src="/SkrabbleKeeperLogo.svg"
            alt="Skrabble Keeper"
            width={200}
            height={90}
            className="mx-auto mb-6"
          />

          <div className="bg-[#f5f0e8] rounded-lg p-4 mb-6">
            <p className="text-[#1e3a5f] font-medium mb-2">
              Check your email! 📧
            </p>
            <p className="text-sm text-[#1e3a5f]/70">
              We&apos;ve sent your Pro license key to your email address. 
              It should arrive within a few minutes.
            </p>
          </div>

          <div className="text-sm text-[#1e3a5f]/60 mb-6">
            <p className="mb-2">
              <strong>What&apos;s next?</strong>
            </p>
            <ol className="text-left list-decimal ml-6 space-y-1">
              <li>Open your email and find the license key</li>
              <li>Go back to Skrabble Keeper</li>
              <li>Click &quot;Keeper Pro&quot; and enter your key</li>
              <li>Enjoy all Pro features!</li>
            </ol>
          </div>

          <Link
            href="/"
            className="inline-block w-full py-3 px-6 bg-[#1e3a5f] hover:bg-[#162d4d] 
              text-[#f5f0e8] font-bold rounded-lg transition-colors"
          >
            Back to Skrabble Keeper
          </Link>

          <p className="text-xs text-[#1e3a5f]/40 mt-4">
            Didn&apos;t receive the email? Check your spam folder or contact support.
          </p>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-3 border-[#1e3a5f] border-t-transparent 
          rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-[#1e3a5f]">Loading...</p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SuccessContent />
    </Suspense>
  );
}
