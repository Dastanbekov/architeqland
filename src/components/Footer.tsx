export default function Footer() {
  return (
    <footer
      className="border-t border-[rgba(255,255,255,0.05)] py-9 relative z-10"
      role="contentinfo"
    >
      <div className="max-w-[1120px] mx-auto px-6 flex items-center justify-between flex-wrap gap-4 max-sm:flex-col max-sm:text-center">
        <span className="text-[13px] text-[var(--text-muted)] font-mono">
          © 2026 Architeq. All rights reserved.
        </span>
        <span
          className="font-mono text-[11px] tracking-[0.12em] uppercase"
          style={{ color: 'rgba(139,92,246,0.5)' }}
        >
          The New Paradigm of Development.
        </span>
      </div>
    </footer>
  );
}
