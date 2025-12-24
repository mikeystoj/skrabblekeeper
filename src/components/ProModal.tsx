'use client';

interface ProModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProModal({ isOpen, onClose }: ProModalProps) {
  if (!isOpen) return null;

  const features = [
    'Dictionary validation with official Scrabble dictionaries',
    'Game history and personal stats tracking',
    'Predictive word helper suggestions',
    'Word lookup and point calculator',
    'Multi-lingual support (EN, ES, FR, DE)',
    'Turn timer for competitive play',
  ];

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
          <h2 className="text-lg font-bold text-[#f5f0e8]">Keeper Pro</h2>
          <p className="text-[#f5f0e8]/70 text-sm">Unlock the full experience</p>
        </div>

        {/* Price */}
        <div className="px-5 py-4 border-b border-[#e8dfd2]">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-[#1e3a5f]">$10</span>
            <span className="text-[#1e3a5f]/50 text-sm">one-time</span>
          </div>
        </div>

        {/* Features */}
        <div className="px-5 py-4">
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-[#1e3a5f]">
                <span className="text-[#3d5a80] mt-0.5">✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Buttons */}
        <div className="px-5 pb-5 space-y-2">
          <button
            disabled
            className="w-full py-2.5 px-4 bg-[#1e3a5f]/50 
              text-[#f5f0e8]/70 font-bold rounded-lg cursor-not-allowed"
          >
            Coming Soon
          </button>
          <button
            onClick={onClose}
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
