'use client';

import { useState } from 'react';
import {
  EnvelopeIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

interface TestEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TestEmailModal({ isOpen, onClose }: TestEmailModalProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleSendTest = async () => {
    if (!email || !email.includes('@')) {
      setResult({ success: false, message: 'Please enter a valid email address' });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({ success: true, message: data.message || 'Test email sent!' });
      } else {
        setResult({ success: false, message: data.error || 'Failed to send email' });
      }
    } catch (error) {
      setResult({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Network error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setResult(null);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div 
        className="bg-[#faf8f5] rounded-xl shadow-xl max-w-sm w-full overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-[#1e3a5f] px-5 py-4">
          <div className="flex items-center gap-2">
            <EnvelopeIcon className="w-5 h-5 text-[#c4a882]" />
            <h2 className="text-lg font-bold text-[#f5f0e8]">Test Email</h2>
          </div>
          <p className="text-[#f5f0e8]/70 text-sm mt-1">Send a test license email</p>
        </div>

        <div className="p-5">
          <p className="text-sm text-[#1e3a5f]/70 mb-4">
            Enter an email address to send a test license key email. 
            This uses a fake license key (SK-TEST-1234-5678).
          </p>

          <input
            type="email"
            placeholder="test@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendTest()}
            className="w-full px-4 py-3 rounded-lg border-2 border-[#e8dfd2] 
              focus:border-[#1e3a5f] focus:outline-none bg-white
              text-[#1e3a5f] placeholder-[#1e3a5f]/40 mb-3"
          />

          {result && (
            <div className={`flex items-center gap-2 p-3 rounded-lg mb-3 ${
              result.success 
                ? 'bg-green-50 text-green-700' 
                : 'bg-red-50 text-red-700'
            }`}>
              {result.success ? (
                <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
              ) : (
                <ExclamationCircleIcon className="w-5 h-5 flex-shrink-0" />
              )}
              <span className="text-sm">{result.message}</span>
            </div>
          )}

          <button
            onClick={handleSendTest}
            disabled={isLoading || !email}
            className="w-full py-3 px-4 bg-[#1e3a5f] hover:bg-[#162d4d] 
              text-[#f5f0e8] font-bold rounded-lg transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending...' : 'Send Test Email'}
          </button>
        </div>

        <div className="px-5 pb-5">
          <button
            onClick={handleClose}
            className="w-full py-2 px-4 text-[#1e3a5f]/50 hover:text-[#1e3a5f] 
              text-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

