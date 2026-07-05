'use client';

import dynamic from 'next/dynamic';
import { RevealWaveImage } from '@/components/ui/reveal-wave-image';

const AsciiArt = dynamic(() => import('@/components/ui/ascii-art').then(mod => mod.AsciiArt), { ssr: false });

export default function HeroInteractive() {
  return (
    <section className="relative w-full overflow-hidden bg-[#0A0A0B] min-h-screen flex items-center">
      
      {/* Base dark background */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-[#0A0A0B] pointer-events-none" />

      {/* Sisyphus Overlay (Masked on the left so text is readable, Sisyphus on the right) */}
      <div 
        className="absolute inset-0 w-full h-full z-[1] pointer-events-none mix-blend-screen opacity-100 flex items-center justify-center overflow-hidden"
        style={{ 
          maskImage: 'linear-gradient(to right, transparent 0%, transparent 20%, black 50%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, transparent 20%, black 50%, black 100%)'
        }}
      >
        <div 
          className="w-full h-[110%] absolute bottom-[-5%] filter brightness-[1.5] contrast-[1.2]"
          style={{ transform: 'scaleX(-1)' }}
        >
          <AsciiArt />
        </div>
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-margin-desktop px-margin-mobile pt-[140px] pb-xxl z-10 pointer-events-none">
        
        {/* Left Content */}
        <div className="w-full max-w-3xl flex flex-col items-start text-left z-20 pt-10 lg:pt-0">
          <h1 className="font-display-lg text-display-lg md:text-[56px] md:leading-[1.1] font-light tracking-tight text-white/90 mb-md w-full">
            <span>Turn your business idea into&nbsp;a</span>
            <br />
            <span className="font-medium relative inline-block text-white mt-2">
              real painkiller.
              <svg 
                className="absolute w-[110%] h-[20px] -bottom-2 left-1/2 -translate-x-1/2 pointer-events-none" 
                viewBox="0 0 200 20" 
                preserveAspectRatio="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <style>
                  {`
                    @keyframes drawUnderline {
                      to { stroke-dashoffset: 0; }
                    }
                    .animate-draw {
                      stroke-dasharray: 200;
                      stroke-dashoffset: 200;
                      animation: drawUnderline 1s ease-out 0.5s forwards;
                    }
                  `}
                </style>
                <path 
                  d="M 5,12 Q 100,2 195,15" 
                  stroke="#6366f1" 
                  strokeWidth="6" 
                  fill="transparent" 
                  strokeLinecap="round" 
                  className="animate-draw" 
                />
              </svg>
            </span>
          </h1>
          
          <p className="w-full lg:w-[85%] max-w-none font-body-lg text-[16px] md:text-[18px] text-white/70 mb-xl">
            Stop waiting months for developers. Just describe what your business needs, and Architeq will build a complete, ready-to-launch software product in minutes.
          </p>

          {/* Interactive Prompt Box */}
          <div className="w-full max-w-[600px] relative group mt-4 pointer-events-auto">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-[18px] blur opacity-40 group-hover:opacity-80 transition duration-700"></div>
            <div className="relative flex flex-col sm:flex-row items-center bg-black/40 backdrop-blur-xl border border-white/10 rounded-[16px] p-1.5 transition-all">
              
              <input 
                type="text" 
                placeholder="e.g. A marketplace for local dog walkers..."
                className="flex-grow w-full bg-transparent border-none outline-none px-5 py-3 text-[15px] text-white placeholder-white/30 font-body-md"
              />
              
              <button className="w-full sm:w-auto bg-white text-black font-medium text-[14px] px-6 py-2.5 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2 whitespace-nowrap">
                Build My App <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4 text-sm text-white/60 font-body-md">
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">check_circle</span> No coding required</span>
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">check_circle</span> You own the product 100%</span>
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">check_circle</span> Ready for users</span>
          </div>
        </div>

      </div>
    </section>
  );
}
