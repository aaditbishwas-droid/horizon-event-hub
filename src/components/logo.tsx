export function LogoMark({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="9" className="fill-sidebar-primary" />
      <path d="M8 20a8 8 0 0 1 16 0" className="fill-none stroke-sidebar-primary-foreground" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M6 23.5h20" className="stroke-sidebar-primary-foreground" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="16" cy="11" r="1.8" className="fill-sidebar-primary-foreground" />
    </svg>
  );
}
