import Reveal from '@/components/Reveal';

const stats = [
  { value: '40', unit: 'min', label: 'instead of 4 months' },
  { value: '100', unit: '%',  label: 'isolated systems' },
  { value: '0',   unit: '',   label: 'hallucinated APIs' },
];

export default function StatsStrip() {
  return (
    <section className="py-[60px] relative" aria-label="Key metrics">
      {/* vertical divider line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--border-glow))' }}
        aria-hidden="true"
      />

      <div className="max-w-[1120px] mx-auto px-6 relative z-10">
        <Reveal>
          <div
            className="grid grid-cols-3 gap-px rounded-[var(--radius-lg)] overflow-hidden border border-[var(--border-subtle)]"
            style={{ background: 'var(--border-subtle)' }}
          >
            {stats.map(({ value, unit, label }) => (
              <div
                key={label}
                className="py-9 px-6 text-center bg-[var(--bg-card)] transition-colors duration-200 hover:bg-[rgba(14,14,22,0.98)]"
              >
                <span
                  className="gradient-text-stat font-mono font-bold tracking-tight block mb-2"
                  style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}
                >
                  {value}
                  {unit && (
                    <span className="text-[0.55em] text-[var(--text-muted)]">{unit}</span>
                  )}
                </span>
                <span className="text-[13px] text-[var(--text-muted)] font-medium tracking-[0.04em] uppercase">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
