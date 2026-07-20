export default function PlayStoreIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0">
      <defs>
        <linearGradient id="fp1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00C6FF"></stop>
          <stop offset="100%" stopColor="#00E5C4"></stop>
        </linearGradient>
        <linearGradient id="fp2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFDA00"></stop>
          <stop offset="100%" stopColor="#FF9500"></stop>
        </linearGradient>
        <linearGradient id="fp3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF3A44"></stop>
          <stop offset="100%" stopColor="#C51162"></stop>
        </linearGradient>
        <linearGradient id="fp4" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#32A071"></stop>
          <stop offset="100%" stopColor="#00E680"></stop>
        </linearGradient>
      </defs>
      <path
        d="M3.18 23.76c.36.2.78.22 1.17.06l11.5-6.64L12.72 14l-9.54 9.76z"
        fill="url(#fp3)"
      ></path>
      <path
        d="M20.32 10.52l-2.79-1.61-3.32 3.32 3.32 3.31 2.82-1.63c.8-.46.8-1.93-.03-2.39z"
        fill="url(#fp2)"
      ></path>
      <path
        d="M3.18.24C2.78.06 2.32.1 1.96.34L12.72 11.1l3.13-3.13L4.35.18c-.38-.22-.79-.14-1.17.06z"
        fill="url(#fp4)"
      ></path>
      <path
        d="M1.96.34C1.6.58 1.4 1 1.4 1.52v21c0 .52.2.94.56 1.18l.04.03L12.72 14 1.96.34z"
        fill="url(#fp1)"
      ></path>
    </svg>
  );
}
