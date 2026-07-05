'use client';

import { useState } from 'react';
import Reveal from '@/components/Reveal';
import Toast from '@/components/Toast';

export default function DemoSection() {
  const [toast, setToast] = useState<{ message: string; key: number } | null>(null);

  const handlePlay = () => {
    setToast({ message: "🎬 Demo video dropping soon. You'll be the first to know.", key: Date.now() });
  };

  return (
    <section className="py-20" aria-labelledby="demo-title">
      <div className="max-w-[1120px] mx-auto px-6 relative z-10">

        <Reveal>
          <p className="flex items-center gap-3 font-mono text-[11px] font-semibold tracking-[0.2em] uppercase text-[var(--accent-purple-bright)] mb-4 after:flex-1 after:h-px after:bg-[var(--border-subtle)] after:content-['']">
            // Demo
          </p>
        </Reveal>

        <Reveal delay={80}>
          <h2
            id="demo-title"
            className="font-extrabold tracking-tight text-[var(--text-primary)] mb-12"
            style={{ fontSize: 'clamp(28px, 4vw, 42px)' }}
          >
            Watch <span className="gradient-text-accent">God-Mode</span> in Action
          </h2>
        </Reveal>

        <Reveal delay={160}>
          {/* 16:9 video wrapper */}
          <div
            className="relative w-full border-pulse rounded-[var(--radius-lg)] overflow-hidden border"
            style={{
              paddingTop: '56.25%',
              boxShadow: 'var(--glow-purple), 0 40px 80px rgba(0,0,0,0.6)',
              background: 'var(--bg-card)',
            }}
            role="img"
            aria-label="Demo video placeholder — coming soon"
          >
            <div
              className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #050507 0%, #0a0a18 50%, #050512 100%)' }}
            >
              {/* Grid overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
                aria-hidden="true"
              />

              {/* Scanline */}
              <div className="scanline" aria-hidden="true" />

              {/* Corner tags */}
              <span className="absolute top-4 left-4 z-10 font-mono text-[11px] text-[var(--accent-purple-bright)] bg-[rgba(139,92,246,0.1)] border border-[rgba(139,92,246,0.25)] px-[10px] py-1 rounded">
                architeq_ddai_v1.mp4
              </span>
              <span className="absolute top-4 right-4 z-10 font-mono text-[11px] text-[var(--accent-cyan)] bg-[rgba(6,182,212,0.06)] border border-[rgba(6,182,212,0.2)] px-[10px] py-1 rounded">
                ● REC
              </span>

              {/* Play button */}
              <div className="relative z-10 flex flex-col items-center gap-5 play-float">
                <button
                  onClick={handlePlay}
                  aria-label="Play demo video"
                  className="w-[72px] h-[72px] rounded-full border border-[var(--border-glow)] bg-[rgba(139,92,246,0.15)] flex items-center justify-center cursor-pointer backdrop-blur-md transition-all duration-300 hover:bg-[rgba(139,92,246,0.3)] hover:scale-110"
                  style={{ transition: 'background 320ms ease, box-shadow 320ms ease, transform 180ms ease' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--glow-purple)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                >
                  <span
                    className="ml-1"
                    aria-hidden="true"
                    style={{
                      width: 0, height: 0,
                      borderTop: '12px solid transparent',
                      borderBottom: '12px solid transparent',
                      borderLeft: '20px solid var(--accent-purple-bright)',
                    }}
                  />
                </button>
                <span className="font-mono text-xs text-[var(--text-muted)] tracking-[0.1em]">
                  // DEMO COMING SOON
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {toast && <Toast key={toast.key} message={toast.message} />}
    </section>
  );
}
