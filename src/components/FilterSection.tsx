import Reveal from '@/components/Reveal';

const yesItems = [
  '✓ Software Architects',
  '✓ Senior Backend Engineers',
  '✓ Tech Founders',
  '✓ Indie Hackers who ship',
];

const noItems = [
  '✗ "Just vibe coding" crowd',
  '✗ Prompt engineers only',
];

export default function FilterSection() {
  return (
    <section className="py-20" aria-labelledby="filter-title">
      <div className="max-w-[1120px] mx-auto px-6 relative z-10">
        <Reveal>
          <div
            className="rounded-[var(--radius-lg)] px-14 py-16 max-sm:px-7 max-sm:py-10 relative overflow-hidden border border-[rgba(139,92,246,0.2)]"
            style={{ background: 'var(--bg-filter)' }}
          >
            {/* Top glow line */}
            <div
              className="absolute top-[-1px] left-1/2 -translate-x-1/2 w-[60%] h-px pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent, var(--accent-purple), transparent)' }}
              aria-hidden="true"
            />
            {/* Bottom-right radial glow */}
            <div
              className="absolute bottom-0 right-0 w-[300px] h-[300px] pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)' }}
              aria-hidden="true"
            />

            <p className="font-mono text-[11px] font-semibold tracking-[0.2em] uppercase text-[var(--accent-purple-bright)] mb-4">
              // Access control
            </p>

            <h2
              id="filter-title"
              className="gradient-text-purple font-black tracking-tight mb-7"
              style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}
            >
              Not for Beginners.
            </h2>

            <p
              className="text-[var(--text-secondary)] leading-[1.75] max-w-[680px]"
              style={{ fontSize: 'clamp(16px, 2vw, 18px)' }}
            >
              If you don&apos;t know what a{' '}
              <strong className="text-[var(--text-primary)] font-semibold">database schema</strong>{' '}
              is, Architeq isn&apos;t for you. This is an engine for those who understand{' '}
              <strong className="text-[var(--text-primary)] font-semibold">software architecture</strong>.
              It doesn&apos;t replace you — it gives you{' '}
              <span className="text-[var(--accent-purple-bright)] font-mono font-semibold">God-Mode</span>{' '}
              to build enterprise-grade backends in{' '}
              <strong className="text-[var(--text-primary)] font-semibold">40 minutes instead of 4 months</strong>.
            </p>

            <div className="flex flex-wrap gap-[10px] mt-8" aria-label="Who Architeq is and isn't for">
              {yesItems.map((item) => (
                <span
                  key={item}
                  className="font-mono text-xs px-4 py-2 rounded-full border border-[rgba(139,92,246,0.3)] text-[var(--accent-purple-bright)] bg-[rgba(139,92,246,0.06)] flex items-center gap-[6px]"
                >
                  {item}
                </span>
              ))}
              {noItems.map((item) => (
                <span
                  key={item}
                  className="font-mono text-xs px-4 py-2 rounded-full border border-[rgba(239,68,68,0.2)] text-[#f87171] bg-[rgba(239,68,68,0.04)] flex items-center gap-[6px]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
