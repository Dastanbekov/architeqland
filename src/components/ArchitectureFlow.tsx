export default function ArchitectureFlow() {
  return (
    <section className="py-xxl max-w-7xl mx-auto px-margin-desktop px-margin-mobile text-center">
      <h2 className="font-display-lg text-[48px] tracking-tight text-primary mb-4 font-light">
        How it works
      </h2>
      <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto mb-16">
        We took the complex process of building software and made it as simple as having a conversation.
      </p>

      {/* Diagram container */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-12 max-w-5xl mx-auto">
        
        {/* Step 1 */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-full border-2 border-dashed border-primary/20 flex flex-col items-center justify-center p-4 relative bg-surface-container-lowest">
            <span className="material-symbols-outlined text-[32px] text-primary mb-2">chat</span>
            <span className="font-label-sm uppercase tracking-widest text-xs">Your Idea</span>
            <div className="absolute -right-16 top-1/2 -translate-y-1/2 w-12 h-px bg-primary/20 hidden md:block"></div>
          </div>
          <p className="text-sm text-on-surface-variant mt-4 w-40">Tell us what you want in plain English.</p>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col items-center">
          <div className="w-48 h-48 rounded-full border border-primary/10 bg-gradient-to-br from-[#f4f6ff] to-[#fff5eb] flex items-center justify-center relative p-6 shadow-sm">
            <div className="grid grid-cols-2 gap-2 w-full h-full">
               <div className="border border-outline-variant rounded-lg bg-white flex flex-col items-center justify-center text-xs text-primary shadow-sm">
                 <span className="material-symbols-outlined text-[20px] mb-1 text-blue-500">person</span> Users
               </div>
               <div className="border border-outline-variant rounded-lg bg-white flex flex-col items-center justify-center text-xs text-primary shadow-sm">
                 <span className="material-symbols-outlined text-[20px] mb-1 text-green-500">payments</span> Payments
               </div>
               <div className="border border-outline-variant rounded-lg bg-white flex flex-col items-center justify-center text-xs text-primary shadow-sm">
                 <span className="material-symbols-outlined text-[20px] mb-1 text-orange-500">mail</span> Emails
               </div>
               <div className="border border-outline-variant rounded-lg bg-white flex flex-col items-center justify-center text-xs text-primary shadow-sm">
                 <span className="material-symbols-outlined text-[20px] mb-1 text-purple-500">lock</span> Security
               </div>
            </div>
            <div className="absolute -right-16 top-1/2 -translate-y-1/2 w-12 h-px bg-primary/20 hidden md:block"></div>
          </div>
          <p className="font-label-sm uppercase tracking-widest text-xs mt-6 text-on-surface-variant">The Blueprint</p>
          <p className="text-sm text-on-surface-variant mt-1 w-48">We map out the exact features needed.</p>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-full bg-primary flex flex-col items-center justify-center p-4 text-white shadow-xl shadow-[#6366f1]/20">
            <span className="material-symbols-outlined text-[32px] mb-2 text-white">devices</span>
            <span className="font-label-sm uppercase tracking-widest text-xs text-white">Live App</span>
          </div>
          <p className="text-sm text-on-surface-variant mt-4 w-40">Your fully working product is ready.</p>
        </div>

      </div>
    </section>
  );
}
