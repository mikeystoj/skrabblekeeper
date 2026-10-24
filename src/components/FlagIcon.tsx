// Flat SVG flags for the supported languages. Used instead of emoji flags,
// which render differently on each platform (and not at all on Windows).

const FLAGS: Record<string, React.ReactNode> = {
  en: (
    // Union Jack (2:1), cropped to the 3:2 frame
    <svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="2" />
      <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  ),
  de: (
    <svg viewBox="0 0 3 2" className="w-full h-full">
      <rect width="3" height="2" fill="#FFCE00" />
      <rect width="3" height="1.333" fill="#DD0000" />
      <rect width="3" height="0.667" fill="#000" />
    </svg>
  ),
  fr: (
    <svg viewBox="0 0 3 2" className="w-full h-full">
      <rect width="3" height="2" fill="#ED2939" />
      <rect width="2" height="2" fill="#fff" />
      <rect width="1" height="2" fill="#002654" />
    </svg>
  ),
  es: (
    <svg viewBox="0 0 3 2" className="w-full h-full">
      <rect width="3" height="2" fill="#AA151B" />
      <rect y="0.5" width="3" height="1" fill="#F1BF00" />
    </svg>
  ),
  it: (
    <svg viewBox="0 0 3 2" className="w-full h-full">
      <rect width="3" height="2" fill="#CE2B37" />
      <rect width="2" height="2" fill="#fff" />
      <rect width="1" height="2" fill="#009246" />
    </svg>
  ),
};

export function FlagIcon({ code, className = 'w-[18px] h-3' }: { code: string; className?: string }) {
  const flag = FLAGS[code];
  if (!flag) return null;

  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 overflow-hidden rounded-[3px] ring-1 ring-black/10 shadow-[0_1px_1px_rgba(30,58,95,0.15)] align-[-1px] ${className}`}
    >
      {flag}
    </span>
  );
}
