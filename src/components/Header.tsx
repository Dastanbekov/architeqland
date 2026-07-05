'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleJoinClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 py-[18px] border-b transition-all duration-300 backdrop-blur-xl ${
        scrolled
          ? 'border-[rgba(139,92,246,0.12)] bg-[rgba(5,5,7,0.93)]'
          : 'border-[rgba(255,255,255,0.04)] bg-[rgba(5,5,7,0.7)]'
      }`}
      role="banner"
    >
      <div className="max-w-[1120px] mx-auto px-6 flex items-center justify-between relative z-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline group" aria-label="Architeq Home">
          <span
            className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-extrabold text-white"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
              boxShadow: 'var(--glow-purple)',
            }}
            aria-hidden="true"
          >
            A
          </span>
          <span
            className="font-mono text-[18px] font-bold tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent-purple-bright)] transition-colors duration-200"
          >
            Architeq
          </span>
        </Link>

        {/* CTA */}
        <a
          href="#waitlist"
          onClick={handleJoinClick}
          className="text-[13px] font-semibold px-5 py-[9px] rounded-md border border-[var(--border-glow)] bg-[rgba(139,92,246,0.1)] text-[var(--accent-purple-bright)] cursor-pointer transition-all duration-200 hover:bg-[rgba(139,92,246,0.22)] hover:text-white no-underline"
          style={{ transition: 'background 180ms ease, box-shadow 180ms ease, color 180ms ease' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--glow-purple)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
        >
          Join Beta
        </a>
      </div>
    </header>
  );
}
