'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'about' | 'faq';

export function InfoModal({ isOpen, onClose }: InfoModalProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>('about');

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[#faf8f5] rounded-xl shadow-xl max-w-md w-full overflow-hidden max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#1e3a5f] px-5 py-4">
          <h2 className="text-lg font-bold text-[#f5f0e8]">{t.infoModal.title}</h2>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#e8dfd2]">
          <button
            onClick={() => setActiveTab('about')}
            className={`flex-1 py-3 text-sm font-medium transition-colors
              ${activeTab === 'about' 
                ? 'text-[#1e3a5f] border-b-2 border-[#1e3a5f]' 
                : 'text-[#1e3a5f]/50 hover:text-[#1e3a5f]/70'
              }`}
          >
            {t.infoModal.aboutTab}
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`flex-1 py-3 text-sm font-medium transition-colors
              ${activeTab === 'faq' 
                ? 'text-[#1e3a5f] border-b-2 border-[#1e3a5f]' 
                : 'text-[#1e3a5f]/50 hover:text-[#1e3a5f]/70'
              }`}
          >
            {t.infoModal.faqTab}
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-4 space-y-3 overflow-y-auto flex-1">
          {activeTab === 'about' ? (
            <>
              <p className="text-sm text-[#1e3a5f]">
                {t.infoModal.aboutDescription}
              </p>
              <ul className="text-sm text-[#1e3a5f] space-y-1 ml-4">
                <li>• {t.infoModal.features.trackScores}</li>
                <li>• {t.infoModal.features.calculateScores}</li>
                <li>• {t.infoModal.features.keepHistory}</li>
                <li>• {t.infoModal.features.visualizeTiles}</li>
              </ul>

              {/* Board Legend */}
              <div className="pt-3 border-t border-[#e8dfd2]">
                <p className="text-xs font-medium text-[#1e3a5f] mb-2">{t.infoModal.boardSquares}</p>
                <div className="flex flex-wrap gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="w-5 h-5 bg-[#1e3a5f] rounded text-[#f5f0e8] flex items-center justify-center font-bold text-[10px]">TW</span>
                    <span className="text-[#1e3a5f]">{t.infoModal.tripleWord}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-5 h-5 bg-[#3d5a80] rounded text-[#f5f0e8] flex items-center justify-center font-bold text-[10px]">DW</span>
                    <span className="text-[#1e3a5f]">{t.infoModal.doubleWord}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-5 h-5 bg-[#c4a882] rounded text-[#0f1f36] flex items-center justify-center font-bold text-[10px]">TL</span>
                    <span className="text-[#1e3a5f]">{t.infoModal.tripleLetter}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-5 h-5 bg-[#d4c4a8] rounded text-[#0f1f36] flex items-center justify-center font-bold text-[10px]">DL</span>
                    <span className="text-[#1e3a5f]">{t.infoModal.doubleLetter}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-5 h-5 bg-stone-100 rounded text-stone-600 flex items-center justify-center font-bold text-[10px] border-2 border-dashed border-stone-400">A</span>
                    <span className="text-[#1e3a5f]">{t.infoModal.blankTile}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#e8dfd2] space-y-2">
                <p className="text-xs text-[#1e3a5f]/60">
                  Word validation powered by{' '}
                  <a 
                    href="https://rapidapi.com/xview0/api/english-word-finder-anagram-api-poocoo-app" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#1e3a5f]/80 underline hover:text-[#1e3a5f]"
                  >
                    English Word Finder API
                  </a>
                  {' '}(Poocoo.App via RapidAPI)
                </p>
                <p className="text-xs text-[#1e3a5f]/60">
                  {t.infoModal.trademark}
                </p>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              {/* FAQ Items */}
              <FAQItem 
                question={t.infoModal.faq.refundQ} 
                answer={t.infoModal.faq.refundA}
              />
              <FAQItem 
                question={t.infoModal.faq.licenseQ} 
                answer={t.infoModal.faq.licenseA}
              />
              <FAQItem 
                question={t.infoModal.faq.dataQ} 
                answer={t.infoModal.faq.dataA}
              />
              <FAQItem 
                question={t.infoModal.faq.devicesQ} 
                answer={t.infoModal.faq.devicesA}
              />
              <FAQItem 
                question={t.infoModal.faq.mobileAppQ} 
                answer={t.infoModal.faq.mobileAppA}
              />
              <FAQItem 
                question={t.infoModal.faq.whyKQ} 
                answer={t.infoModal.faq.whyKA}
              />
              <div className="border-b border-[#e8dfd2] pb-3 last:border-0">
                <h4 className="text-sm font-semibold text-[#1e3a5f] mb-1">{t.infoModal.faq.bugQ}</h4>
                <p className="text-sm text-[#1e3a5f]/70">
                  {t.infoModal.faq.bugA.split('@skrabblekeeper')[0]}
                  <a 
                    href="https://x.com/skrabblekeeper" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#1e3a5f] font-medium underline hover:text-[#3d5a80]"
                  >
                    @skrabblekeeper
                  </a>
                  {t.infoModal.faq.bugA.split('@skrabblekeeper')[1]}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Button */}
        <div className="px-5 py-4 border-t border-[#e8dfd2]">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-[#1e3a5f] hover:bg-[#162d4d] 
              text-[#f5f0e8] font-medium rounded-lg transition-colors"
          >
            {t.common.gotIt}
          </button>
        </div>
      </div>
    </div>
  );
}

// FAQ Item Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-b border-[#e8dfd2] pb-3 last:border-0">
      <h4 className="text-sm font-semibold text-[#1e3a5f] mb-1">{question}</h4>
      <p className="text-sm text-[#1e3a5f]/70">{answer}</p>
    </div>
  );
}

