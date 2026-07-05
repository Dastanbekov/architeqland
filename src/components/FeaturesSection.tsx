import Reveal from '@/components/Reveal';

interface Feature {
  icon: string;
  title: string;
  description: string;
  code: string;
}

const features: Feature[] = [
  {
    icon: '⬡',
    title: 'Diagram-Driven AI',
    description:
      'Draw your data model visually. DDAI translates diagrams into complete, production-ready backend systems — not code snippets.',
    code: 'ddai.generate(diagram)',
  },
  {
    icon: '⧉',
    title: 'Full Isolation',
    description:
      'Every system is containerized and isolated. No monoliths, no shared state nightmares. Pure microservice architecture out of the box.',
    code: 'arch.isolate(service)',
  },
  {
    icon: '◈',
    title: 'Zero Hallucinations',
    description:
      'Architeq generates from schema, not from vibes. Every API endpoint, every DB relation is grounded in your actual data model.',
    code: 'verify(schema → output)',
  },
  {
    icon: '⬡',
    title: 'Enterprise-Grade Security',
    description:
      'Authentication, RBAC, rate limiting, audit logs — the full security stack generated automatically per OWASP ASVS standards.',
    code: 'security.generate(ASVS_L3)',
  },
  {
    icon: '⟁',
    title: 'You Own the Output',
    description:
      'No vendor lock-in. No subscription to run the code. Export clean, readable, documented code and deploy it anywhere.',
    code: 'export --format=clean',
  },
  {
    icon: '⋈',
    title: 'API-First by Design',
    description:
      'OpenAPI spec, type-safe clients, and SDK generation included. Your system is documented before you write the first business line.',
    code: 'openapi.spec → sdk.generate()',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20" aria-labelledby="features-title">
      <div className="max-w-[1120px] mx-auto px-6 relative z-10">

        <Reveal>
          <p className="flex items-center gap-3 font-mono text-[11px] font-semibold tracking-[0.2em] uppercase text-[var(--accent-purple-bright)] mb-4 after:flex-1 after:h-px after:bg-[var(--border-subtle)] after:content-['']">
            // Core capabilities
          </p>
        </Reveal>

        <Reveal delay={80}>
          <h2
            id="features-title"
            className="font-extrabold tracking-tight text-[var(--text-primary)] mb-12"
            style={{ fontSize: 'clamp(28px, 4vw, 42px)' }}
          >
            Architecture, <span className="gradient-text-accent">Not</span> Autocomplete
          </h2>
        </Reveal>

        <Reveal delay={160}>
          <div
            className="grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-px rounded-[var(--radius-lg)] overflow-hidden border border-[var(--border-subtle)]"
            style={{ background: 'var(--border-subtle)' }}
          >
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, description, code }: Feature) {
  return (
    <div
      className="p-9 bg-[var(--bg-card)] relative overflow-hidden group transition-colors duration-300 hover:bg-[rgba(14,14,22,0.98)]"
    >
      {/* top glow bar on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, var(--accent-purple), transparent)' }}
        aria-hidden="true"
      />

      <div
        className="w-11 h-11 rounded-md border border-[var(--border-subtle)] bg-[rgba(139,92,246,0.07)] flex items-center justify-center text-xl mb-5 transition-all duration-300 group-hover:border-[var(--border-glow)]"
        style={{ transition: 'box-shadow 320ms ease, border-color 320ms ease' }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--glow-purple)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
        aria-hidden="true"
      >
        {icon}
      </div>

      <h3 className="text-base font-bold text-[var(--text-primary)] mb-[10px]">{title}</h3>
      <p className="text-sm text-[var(--text-secondary)] leading-[1.65]">{description}</p>

      <span className="inline-block font-mono text-[11px] text-[var(--text-code)] bg-[rgba(139,92,246,0.07)] border border-[rgba(139,92,246,0.15)] px-[7px] py-[2px] rounded mt-[14px]">
        {code}
      </span>
    </div>
  );
}
