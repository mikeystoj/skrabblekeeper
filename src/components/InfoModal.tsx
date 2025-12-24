'use client';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InfoModal({ isOpen, onClose }: InfoModalProps) {
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
        {/* Header */}
        <div className="bg-[#1e3a5f] px-5 py-4">
          <h2 className="text-lg font-bold text-[#f5f0e8]">About Skrabble Keeper</h2>
        </div>

        {/* Content */}
        <div className="px-5 py-4 space-y-3">
          <p className="text-sm text-[#1e3a5f]">
            Skrabble Keeper is a <strong>scoring companion app</strong> designed to be used alongside your physical Scrabble® board game.
          </p>
          <p className="text-sm text-[#1e3a5f]">
            This app helps you:
          </p>
          <ul className="text-sm text-[#1e3a5f] space-y-1 ml-4">
            <li>• Track scores for up to 4 players</li>
            <li>• Calculate word scores automatically</li>
            <li>• Keep a history of words played</li>
            <li>• Visualize tile placement on the board</li>
          </ul>

          {/* Board Legend */}
          <div className="pt-3 border-t border-[#e8dfd2]">
            <p className="text-xs font-medium text-[#1e3a5f] mb-2">Board Squares:</p>
            <div className="flex flex-wrap gap-3 text-xs">
              <div className="flex items-center gap-1">
                <span className="w-5 h-5 bg-[#1e3a5f] rounded text-[#f5f0e8] flex items-center justify-center font-bold text-[10px]">TW</span>
                <span className="text-[#1e3a5f]">3×Word</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-5 h-5 bg-[#3d5a80] rounded text-[#f5f0e8] flex items-center justify-center font-bold text-[10px]">DW</span>
                <span className="text-[#1e3a5f]">2×Word</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-5 h-5 bg-[#c4a882] rounded text-[#0f1f36] flex items-center justify-center font-bold text-[10px]">TL</span>
                <span className="text-[#1e3a5f]">3×Letter</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-5 h-5 bg-[#d4c4a8] rounded text-[#0f1f36] flex items-center justify-center font-bold text-[10px]">DL</span>
                <span className="text-[#1e3a5f]">2×Letter</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-5 h-5 bg-stone-100 rounded text-stone-600 flex items-center justify-center font-bold text-[10px] border-2 border-dashed border-stone-400">A</span>
                <span className="text-[#1e3a5f]">Blank tile</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-[#1e3a5f]/60 pt-3 border-t border-[#e8dfd2]">
            Scrabble® is a registered trademark of Hasbro, Inc. This app is not affiliated with or endorsed by Hasbro.
          </p>
        </div>

        {/* Button */}
        <div className="px-5 pb-5">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-[#1e3a5f] hover:bg-[#162d4d] 
              text-[#f5f0e8] font-medium rounded-lg transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

