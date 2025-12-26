'use client';

import { useState } from 'react';
import { usePro } from '@/context/ProContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  CheckIcon,
  ArrowLeftIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

interface ProModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type View = 'main' | 'activate' | 'purchase';

export function ProModal({ isOpen, onClose }: ProModalProps) {
  const { isPro, licenseEmail, activatePro, deactivatePro } = usePro();
  const { t } = useLanguage();
  const [view, setView] = useState<View>('main');
  const [email, setEmail] = useState('');
  const [licenseKey, setLicenseKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const features: { text: string; comingSoon?: boolean }[] = [
    { text: t.proModal.features.dictionary },
    { text: t.proModal.features.gameHistory },
    { text: t.proSettings.savedPlayers },
    { text: t.proModal.features.multiLingual },
    { text: t.proModal.features.turnTimer },
    { text: 'No future ads' },
  ];

  const handlePurchase = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Failed to start checkout');
      }
    } catch {
      setError('Failed to connect. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivate = async () => {
    if (!licenseKey.trim()) {
      setError('Please enter your license key');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/validate-license', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licenseKey: licenseKey.trim() }),
      });

      const data = await response.json();

      if (data.valid) {
        activatePro(licenseKey.trim().toUpperCase(), data.email);
        setView('main');
      } else {
        setError(data.error || 'Invalid license key');
      }
    } catch {
      setError('Failed to validate. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivate = () => {
    deactivatePro();
  };

  const resetAndClose = () => {
    setView('main');
    setEmail('');
    setLicenseKey('');
    setError('');
    onClose();
  };

  // Already Pro view
  if (isPro && view === 'main') {
    return (
      <div 
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
        onClick={resetAndClose}
      >
        <div 
          className="bg-[#faf8f5] rounded-xl shadow-xl max-w-sm w-full overflow-hidden max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          <div className="bg-[#1e3a5f] px-5 py-4 sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <SparklesIcon className="w-5 h-5 text-[#c4a882]" />
              <h2 className="text-lg font-bold text-[#f5f0e8]">{t.proModal.proActive}</h2>
            </div>
            <p className="text-sm text-[#f5f0e8]/60 mt-1">
              {licenseEmail}
            </p>
          </div>

          <div className="p-5">
            {/* Features included */}
            <div className="mb-4">
              <p className="text-xs font-medium text-[#1e3a5f]/50 uppercase tracking-wide mb-3">
                {t.proModal.featuresIncluded}
              </p>
              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-[#1e3a5f]">
                    <CheckIcon className="w-4 h-4 text-[#3d5a80] mt-0.5 flex-shrink-0" />
                    <span className="flex items-center gap-2 flex-wrap">
                      {feature.text}
                      {feature.comingSoon && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-[#c4a882]/30 text-[#1e3a5f]/70 rounded-full font-medium">
                          {t.common.comingSoon}
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#f5f0e8] rounded-lg p-3 mb-4">
              <p className="text-xs text-[#1e3a5f]/70 text-center">
                {t.proModal.proActiveDesc}
              </p>
            </div>

            <button
              onClick={handleDeactivate}
              className="w-full text-sm text-[#1e3a5f]/40 hover:text-[#1e3a5f]/60 
                transition-colors py-2"
            >
              Deactivate on this device
            </button>
          </div>

          <div className="px-5 pb-5">
            <button
              onClick={resetAndClose}
              className="w-full py-2.5 px-4 bg-[#1e3a5f] hover:bg-[#162d4d] 
                text-[#f5f0e8] font-medium rounded-lg transition-colors"
            >
              {t.common.close}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Purchase view
  if (view === 'purchase') {
    return (
      <div 
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
        onClick={resetAndClose}
      >
        <div 
          className="bg-[#faf8f5] rounded-xl shadow-xl max-w-sm w-full overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          <div className="bg-[#1e3a5f] px-5 py-4">
            <h2 className="text-lg font-bold text-[#f5f0e8]">{t.proModal.title}</h2>
            <p className="text-[#f5f0e8]/70 text-sm">$10 {t.proModal.oneTimeFee.toLowerCase()}</p>
          </div>

          <div className="p-5">
            <p className="text-sm text-[#1e3a5f]/70 mb-4">
              Enter your email to receive your license key after purchase.
            </p>

            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-[#e8dfd2] 
                focus:border-[#1e3a5f] focus:outline-none bg-white
                text-[#1e3a5f] placeholder-[#1e3a5f]/40 mb-3"
            />

            {error && (
              <p className="text-red-500 text-sm mb-3">{error}</p>
            )}

            <button
              onClick={handlePurchase}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[#1e3a5f] hover:bg-[#162d4d] 
                text-[#f5f0e8] font-bold rounded-lg transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t.common.loading : t.proModal.buyNow}
            </button>

            <p className="text-xs text-center text-[#1e3a5f]/40 mt-3">
              Secure payment via Stripe
            </p>
          </div>

          <div className="px-5 pb-5">
            <button
              onClick={() => { setView('main'); setError(''); }}
              className="w-full py-2 px-4 text-[#1e3a5f]/50 hover:text-[#1e3a5f] 
                text-sm transition-colors flex items-center justify-center gap-1"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              {t.common.back}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Activate view
  if (view === 'activate') {
    return (
      <div 
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
        onClick={resetAndClose}
      >
        <div 
          className="bg-[#faf8f5] rounded-xl shadow-xl max-w-sm w-full overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          <div className="bg-[#1e3a5f] px-5 py-4">
            <h2 className="text-lg font-bold text-[#f5f0e8]">{t.proModal.activate}</h2>
            <p className="text-[#f5f0e8]/70 text-sm">{t.proModal.enterLicenseKey}</p>
          </div>

          <div className="p-5">
            <p className="text-sm text-[#1e3a5f]/70 mb-4">
              {t.proModal.enterLicenseKey}
            </p>

            <input
              type="text"
              placeholder={t.proModal.licenseKeyPlaceholder}
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 rounded-lg border-2 border-[#e8dfd2] 
                focus:border-[#1e3a5f] focus:outline-none bg-white
                text-[#1e3a5f] placeholder-[#1e3a5f]/40 font-mono text-center
                tracking-wider mb-3"
              maxLength={18}
            />

            {error && (
              <p className="text-red-500 text-sm mb-3">{error}</p>
            )}

            <button
              onClick={handleActivate}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[#1e3a5f] hover:bg-[#162d4d] 
                text-[#f5f0e8] font-bold rounded-lg transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t.proModal.activating : t.proModal.activate}
            </button>
          </div>

          <div className="px-5 pb-5">
            <button
              onClick={() => { setView('main'); setError(''); }}
              className="w-full py-2 px-4 text-[#1e3a5f]/50 hover:text-[#1e3a5f] 
                text-sm transition-colors flex items-center justify-center gap-1"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              {t.common.back}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main view
  return (
    <div 
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={resetAndClose}
    >
      <div 
        className="bg-[#faf8f5] rounded-xl shadow-xl max-w-sm w-full overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#1e3a5f] px-5 py-4">
          <h2 className="text-lg font-bold text-[#f5f0e8]">{t.proModal.title}</h2>
          <p className="text-[#f5f0e8]/70 text-sm">{t.proModal.subtitle}</p>
        </div>

        {/* Price */}
        <div className="px-5 py-4 border-b border-[#e8dfd2]">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-[#1e3a5f]">$10</span>
            <span className="text-[#1e3a5f]/50 text-sm">{t.proModal.oneTimeFee.toLowerCase()}</span>
          </div>
        </div>

        {/* Features */}
        <div className="px-5 py-4">
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-[#1e3a5f]">
                <CheckIcon className="w-4 h-4 text-[#3d5a80] mt-0.5 flex-shrink-0" />
                <span className="flex items-center gap-2 flex-wrap">
                  {feature.text}
                  {feature.comingSoon && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-[#c4a882]/30 text-[#1e3a5f]/70 rounded-full font-medium">
                      {t.common.comingSoon}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Buttons */}
        <div className="px-5 pb-5 space-y-2">
          <button
            onClick={() => setView('purchase')}
            className="w-full py-2.5 px-4 bg-[#1e3a5f] hover:bg-[#162d4d]
              text-[#f5f0e8] font-bold rounded-lg transition-colors"
          >
            {t.proModal.buyNow} - $10
          </button>
          <button
            onClick={() => setView('activate')}
            className="w-full py-2 px-4 bg-[#e8dfd2] hover:bg-[#d4c4a8]
              text-[#1e3a5f] font-medium rounded-lg transition-colors text-sm"
          >
            {t.proModal.activateLicense}
          </button>
          <button
            onClick={resetAndClose}
            className="w-full py-2 px-4 text-[#1e3a5f]/50 hover:text-[#1e3a5f] 
              text-sm transition-colors"
          >
            {t.common.close}
          </button>
        </div>
      </div>
    </div>
  );
}
