import WaitlistForm from '@/components/WaitlistForm';

export default function HeroSection() {
  return (
    <section className="pt-[180px] pb-[120px] text-center relative" id="hero" aria-labelledby="hero-title">
      <div className="max-w-[1120px] mx-auto px-6 relative z-10">

        {/* Eyebrow badge */}
        <div className="anim-1">
          <span className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold tracking-[0.18em] uppercase text-[var(--accent-purple-bright)] bg-[rgba(139,92,246,0.08)] border border-[rgba(139,92,246,0.25)] px-[14px] py-[6px] rounded-full mb-8">
            <span className="eyebrow-dot" aria-hidden="true" />
            Pro-Tool for Builders
          </span>
        </div>

        {/* Headline */}
        <h1
          id="hero-title"
          className="anim-2 gradient-text font-extrabold leading-[1.05] tracking-[-0.04em] mb-7"
          style={{ fontSize: 'clamp(40px, 7vw, 80px)' }}
        >
          Stop Renting Tokens.<br />
          Start Owning Infrastructure.
        </h1>

        {/* Sub-headline */}
        <p
          className="anim-3 text-[var(--text-secondary)] leading-[1.7] max-w-[640px] mx-auto mb-12"
          style={{ fontSize: 'clamp(16px, 2.2vw, 20px)' }}
        >
          Chatbots give you{' '}
          <strong className="text-[var(--text-primary)] font-semibold">fragmented code</strong>.
          Architeq&apos;s{' '}
          <strong className="text-[var(--text-primary)] font-semibold">Diagram-Driven AI (DDAI)</strong>{' '}
          generates complete, isolated backend systems in seconds. You design the logic. We generate the architecture.
        </p>

        {/* Waitlist Form */}
        <div className="anim-4">
          <WaitlistForm id="waitlist" formId="hero-form" />
        </div>

      </div>
    </section>
  );
}
