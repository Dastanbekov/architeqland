import { EtheralShadow } from '@/components/ui/etheral-shadow';

export default function DarkCta() {
  return (
    <section className="mt-xxl rounded-t-[40px] relative w-full overflow-hidden">
      <EtheralShadow
        color="rgba(10, 10, 15, 1)"
        animation={{ scale: 0, speed: 0 }}
        noise={{ opacity: 1, scale: 1.2 }}
        sizing="fill"
        className="w-full"
      >
        <div className="bg-[#0a0a0f]/70 text-white pt-xxl pb-xl relative z-10 w-full h-full">
          {/* Background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-[#6366f1] opacity-[0.05] blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-margin-desktop px-margin-mobile text-center relative z-10">
        <h2 className="font-display-lg text-[48px] md:text-[64px] tracking-tight mb-8 font-light leading-tight">
          Start building your app today. <br /> No coding required.
        </h2>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-24">
          <button className="bg-white text-black font-label-sm font-semibold uppercase tracking-widest px-8 py-4 rounded-full hover:scale-105 transition-transform">
            Request Invite
          </button>
          <button className="bg-transparent text-white border border-white/20 font-label-sm font-semibold uppercase tracking-widest px-8 py-4 rounded-full hover:bg-white/10 transition-colors">
            See Examples
          </button>
        </div>

        {/* Dark Footer */}
        <footer className="border-t border-white/10 pt-16 flex flex-col md:flex-row justify-between items-start text-left">
          <div className="mb-8 md:mb-0">
            <a href="#" className="block mb-6">
              <span className="text-[32px] font-bold tracking-tighter font-sans text-white">
                Architeq
              </span>
            </a>
            <p className="font-body-md text-white/50 text-[14px]">
              © 2026 Architeq Inc. <br/> Your business, automated.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 font-body-md text-[14px]">
            <div className="flex flex-col gap-3">
              <h4 className="text-white/40 font-label-sm uppercase tracking-widest mb-2">Platform</h4>
              <a href="#" className="text-white/70 hover:text-white transition-colors">How it works</a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">Examples</a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">Pricing</a>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-white/40 font-label-sm uppercase tracking-widest mb-2">Use Cases</h4>
              <a href="#" className="text-white/70 hover:text-white transition-colors">Marketplaces</a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">Internal Tools</a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">Client Portals</a>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-white/40 font-label-sm uppercase tracking-widest mb-2">Company</h4>
              <a href="#" className="text-white/70 hover:text-white transition-colors">About Us</a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">Careers</a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </footer>
      </div>
        </div>
      </EtheralShadow>
    </section>
  );
}
