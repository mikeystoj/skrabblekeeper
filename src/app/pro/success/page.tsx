'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { usePro } from '@/context/ProContext';

type LicenseState =
  | { status: 'loading' }
  | { status: 'ready'; licenseKey: string; email: string }
  | { status: 'pending' } // Paid, but the license hasn't been created yet
  | { status: 'error' };

const POLL_INTERVAL_MS = 2000;
const MAX_POLLS = 10;

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { activatePro } = usePro();
  const [license, setLicense] = useState<LicenseState>({ status: 'loading' });
  const [copied, setCopied] = useState(false);
  const status = sessionId ? license.status : 'error';

  // Fetch the license key for this checkout, retrying while the webhook runs
  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;
    let polls = 0;

    const poll = async () => {
      polls++;
      try {
        const response = await fetch(`/api/license-from-session?session_id=${encodeURIComponent(sessionId)}`);
        const data = await response.json();
        if (cancelled) return;

        if (data.status === 'ready') {
          setLicense({ status: 'ready', licenseKey: data.licenseKey, email: data.email });
          activatePro(data.licenseKey, data.email);
          return;
        }
        if (data.status === 'unpaid' || data.status === 'invalid') {
          setLicense({ status: 'error' });
          return;
        }
      } catch (error) {
        console.error('Failed to fetch license:', error);
      }

      if (cancelled) return;
      if (polls < MAX_POLLS) {
        setTimeout(poll, POLL_INTERVAL_MS);
      } else {
        setLicense({ status: 'pending' });
      }
    };

    poll();
    return () => {
      cancelled = true;
    };
    // activatePro is recreated each render; only re-run for a new session
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const copyKey = async () => {
    if (license.status !== 'ready') return;
    try {
      await navigator.clipboard.writeText(license.licenseKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable; the key is still visible to copy manually
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-[#1e3a5f] border-t-transparent 
            rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-[#1e3a5f]">Getting your license key...</p>
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

          {license.status === 'ready' ? (
            <>
              <div className="bg-[#f5f0e8] border-2 border-dashed border-[#1e3a5f] rounded-lg p-4 mb-3">
                <p className="text-xs uppercase tracking-wider text-[#1e3a5f]/70 mb-2">Your License Key</p>
                <p className="text-2xl font-bold font-mono tracking-wider text-[#1e3a5f] select-all">
                  {license.licenseKey}
                </p>
                <button
                  onClick={copyKey}
                  className="mt-3 text-sm font-medium text-[#1e3a5f] underline underline-offset-2"
                >
                  {copied ? 'Copied!' : 'Copy key'}
                </button>
              </div>
              <p className="text-sm text-[#1e3a5f]/70 mb-6">
                ✅ Pro is now active on this device. We&apos;ve also emailed the key to{' '}
                <strong>{license.email}</strong> so you can use it on your other devices.
              </p>
            </>
          ) : (
            <>
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
            </>
          )}

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
