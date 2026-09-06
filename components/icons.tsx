type IconProps = { className?: string; style?: React.CSSProperties };

export function IconChevronRight({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none">
      <path d="M10 6l5.5 6-5.5 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconSearch({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <line x1="16.2" y1="16.2" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconHeart({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none">
      <path
        d="M12 20.8 4.2 13.4a4.7 4.7 0 0 1 6.6-6.7l1.2 1.2 1.2-1.2a4.7 4.7 0 1 1 6.6 6.7z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconBag({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none">
      <path d="M5.6 8h12.8l1 12H4.6z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 8V6.2a3 3 0 0 1 6 0V8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconUser({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none">
      <circle cx="12" cy="8.5" r="3.6" stroke="currentColor" strokeWidth="1.9" />
      <path d="M4.8 20a7.2 7.2 0 0 1 14.4 0" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconPhone({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none">
      <path
        d="M6 3h4l1.6 4-2.3 1.6a11 11 0 0 0 5.6 5.6L16.5 12l4 1.6v4a2 2 0 0 1-2.2 2C10.6 19 5 13.4 4 5.2A2 2 0 0 1 6 3z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconTruck({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none">
      <path d="M2 7h11v9H2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 10h4.5l3 3.2V16H13z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="7" cy="18.5" r="2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17" cy="18.5" r="2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function IconArrowRight({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none">
      <path d="M4 12h15" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconArrowLeft({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none">
      <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconArrowRightSlim({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none">
      <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconGrid({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none">
      <rect x="4" y="4" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <rect x="13" y="4" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <rect x="4" y="13" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <rect x="13" y="13" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function IconReturn({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none">
      <path d="M4 12a8 8 0 1 0 2.6-5.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 4v4h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconShield({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none">
      <path d="M12 3l7 3v6c0 4.2-3 7.4-7 9-4-1.6-7-4.8-7-9V6z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 12l2.2 2.2L15.4 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconCard({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none">
      <rect x="3" y="6" width="18" height="12" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <line x1="3" y1="10.5" x2="21" y2="10.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="6.5" y1="14.5" x2="10" y2="14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconMail({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none">
      <rect x="3" y="6" width="18" height="12" rx="3" stroke="currentColor" strokeWidth="1.9" />
      <path d="M3.6 7.4 12 13l8.4-5.6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconPin({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none">
      <path d="M12 21s6.5-6.1 6.5-10.5a6.5 6.5 0 0 0-13 0C5.5 14.9 12 21 12 21z" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="10.4" r="2.4" stroke="currentColor" strokeWidth="1.9" />
    </svg>
  );
}

export function IconSpark({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
      <path d="M12 3l2.2 5.6L20 11l-5.8 2.4L12 19l-2.2-5.6L4 11l5.8-2.4z" />
    </svg>
  );
}

export function IconHome({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none">
      <path d="M4 11.5 12 4l8 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10v9a1 1 0 0 0 1 1h3v-5a2 2 0 0 1 4 0v5h3a1 1 0 0 0 1-1v-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconStore({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none">
      <path d="M4 9.5 5 4h14l1 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 9.5a2.2 2.2 0 0 0 4.4 0 2.2 2.2 0 0 0 4.4 0 2.2 2.2 0 0 0 4.4 0 2.2 2.2 0 0 0 4.4 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 11v8a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 20v-4a2 2 0 0 1 4 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconMenu({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none">
      <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconClose({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconStar({ className, filled = true }: IconProps & { filled?: boolean }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill={filled ? "#FFC93C" : "#E3DEF2"}>
      <polygon points="10,2 11.9,6.5 16.7,6.9 13,10 14.2,14.7 10,12.1 5.8,14.7 7,10 3.3,6.9 8.1,6.5" />
    </svg>
  );
}
