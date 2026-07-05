import DelicateAsciiDots from "@/components/ui/delicate-ascii-dots";

export default function VideoDemo() {
  return (
    <section className="relative w-full overflow-hidden py-xxl border-t border-outline-variant/30">
      
      {/* Background ASCII Dots */}
      <div className="absolute inset-0 z-0">
        <DelicateAsciiDots 
          backgroundColor="#ffffff"
          textColor="0, 0, 0"
          gridSize={60}
          animationSpeed={0.5}
        />
        {/* Subtle white fade at top to blend with previous section if needed */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-margin-desktop px-margin-mobile text-center pointer-events-none">
        <h2 className="font-display-lg text-[48px] tracking-tight text-primary mb-4 font-light">
          Watch an idea turn into an app.
        </h2>
        <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto mb-12">
          See exactly how fast you can go from typing a single sentence to having a live product ready for customers.
        </p>

        <div className="relative w-full max-w-[1000px] mx-auto aspect-video bg-[#0f0f13] rounded-3xl overflow-hidden shadow-2xl group cursor-pointer border border-outline-variant/30 pointer-events-auto">
          {/* Placeholder image/gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a24] to-[#0a0a0f]" />
          
          {/* Play Button */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 z-10">
            <span className="material-symbols-outlined text-[32px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
          </div>

          {/* Bottom Text */}
          <div className="absolute bottom-6 left-8 text-left z-10">
            <h3 className="text-white font-headline-md text-[24px]">Building a marketplace <br/> in 12 minutes.</h3>
            <p className="text-white/60 font-mono text-xs mt-2 uppercase tracking-widest">Runtime: 12:45</p>
          </div>

          {/* Ambient glow */}
          <div className="absolute top-[-50px] right-[-50px] w-[300px] h-[300px] bg-[#6366f1] opacity-20 blur-[100px] pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
