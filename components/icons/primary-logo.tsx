export default function PrimaryLogo() {
  return (
    <svg viewBox="0 0 28 32" fill="none" className="w-6 h-6" aria-hidden="true">
      <path
        d="M14 2L3 7.5v9C3 23.4 7.8 29.2 14 31c6.2-1.8 11-7.6 11-14.5v-9L14 2z"
        fill="var(--primary)"
        stroke="var(--primary)"
        strokeWidth="1"
      ></path>
      <path
        d="M9.5 16.5l2.8 2.8 6-6"
        stroke="var(--accent)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
}
