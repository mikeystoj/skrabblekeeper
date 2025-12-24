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
          <p className="text-xs text-[#1e3a5f]/60 mt-4 pt-3 border-t border-[#e8dfd2]">
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

