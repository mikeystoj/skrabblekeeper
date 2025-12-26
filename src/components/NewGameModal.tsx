'use client';

import { useLanguage } from '@/context/LanguageContext';

interface NewGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestartSamePlayers: () => void;
  onNewGameNewPlayers: () => void;
}

export function NewGameModal({ 
  isOpen, 
  onClose, 
  onRestartSamePlayers, 
  onNewGameNewPlayers 
}: NewGameModalProps) {
  const { t } = useLanguage();
  
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[#faf8f5] rounded-xl shadow-xl max-w-sm w-full overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-[#1e3a5f] px-5 py-4">
          <h2 className="text-lg font-bold text-[#f5f0e8]">{t.newGameModal.title}</h2>
        </div>

        <div className="p-4 space-y-2">
          <button
            onClick={onRestartSamePlayers}
            className="w-full py-3 px-4 bg-[#e8dfd2] hover:bg-[#d4c4a8] 
              text-[#1e3a5f] font-medium rounded-lg transition-colors text-left"
          >
            <div className="font-semibold">{t.newGameModal.restartSamePlayers}</div>
            <div className="text-sm opacity-70">{t.newGameModal.keepScoresReset}</div>
          </button>

          <button
            onClick={onNewGameNewPlayers}
            className="w-full py-3 px-4 bg-[#e8dfd2] hover:bg-[#d4c4a8] 
              text-[#1e3a5f] font-medium rounded-lg transition-colors text-left"
          >
            <div className="font-semibold">{t.newGameModal.newPlayers}</div>
            <div className="text-sm opacity-70">{t.newGameModal.startFresh}</div>
          </button>
        </div>

        <div className="px-4 pb-4">
          <button
            onClick={onClose}
            className="w-full py-2 px-4 bg-[#1e3a5f] hover:bg-[#162d4d] 
              text-[#f5f0e8] font-medium rounded-lg transition-colors"
          >
            {t.common.cancel}
          </button>
        </div>
      </div>
    </div>
  );
}

