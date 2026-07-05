import Reveal from '@/components/Reveal';
import WaitlistForm from '@/components/WaitlistForm';

export default function CtaSection() {
  return (
    <section className="py-20 pb-[100px] text-center" aria-labelledby="cta-title">
      <div className="max-w-[1120px] mx-auto px-6 relative z-10">

        <Reveal>
          <h2
            id="cta-title"
            className="gradient-text-cta font-black tracking-tight mb-5"
            style={{ fontSize: 'clamp(30px, 5vw, 52px)' }}
          >
            Ready to Leave the Token Trap?
          </h2>
        </Reveal>

        <Reveal delay={80}>
          <p className="text-base text-[var(--text-secondary)] mb-12">
            500 private beta spots. Already 100+ claimed.
          </p>
        </Reveal>

        <Reveal delay={160}>
          <WaitlistForm formId="cta-form" />
        </Reveal>

      </div>
    </section>
  );
}
