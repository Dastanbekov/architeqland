'use client';

import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { useState } from 'react';

import { RevealWaveImage } from '@/components/ui/reveal-wave-image';

export default function WaitlistSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      try {
        const response = await fetch("https://formspree.io/f/mjgqeybp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email })
        });
        if (response.ok) {
          setSubmitted(true);
        }
      } catch (error) {
        console.error("Form submission error", error);
      }
    }
  };

  return (
    <section id="waitlist" className="w-full relative">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#6366f1]/15 via-transparent to-transparent blur-3xl opacity-60 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative bg-[#0a0a0f] border-t border-outline-variant/20 py-24 md:py-32 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        {/* Background RevealWaveImage */}
        <div className="absolute inset-0 z-0 pointer-events-auto">
          <RevealWaveImage 
            src="https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3" 
            pixelSize={2}
            mouseRadius={0.4}
          />
          {/* Subtle dark overlay to ensure text remains readable */}
          <div className="absolute inset-0 bg-black/60 pointer-events-none" />
        </div>

        {/* Decorative top border line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#6366f1] to-transparent opacity-50 z-10 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row gap-12 items-center justify-between relative z-10 pointer-events-none">
            
            {/* Left: Copy & Benefits */}
            <div className="w-full md:w-1/2 text-left pointer-events-auto">
              <h2 className="font-display-lg text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
                Get early access.
              </h2>
              <p className="text-white/70 text-lg mb-8">
                Join the exclusive beta and start building production-ready business software without writing a single line of code.
              </p>
              
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-white/80">
                  <CheckCircle2 className="w-5 h-5 text-[#6366f1]" />
                  <span>Instant API & Database generation</span>
                </li>
                <li className="flex items-center gap-3 text-white/80">
                  <Zap className="w-5 h-5 text-[#6366f1]" />
                  <span>Autonomous AI coding agents</span>
                </li>
                <li className="flex items-center gap-3 text-white/80">
                  <ShieldCheck className="w-5 h-5 text-[#6366f1]" />
                  <span>Enterprise-grade security & scaling</span>
                </li>
              </ul>
            </div>

            {/* Right: The Form */}
            <div className="w-full md:w-1/2 pointer-events-auto">
              <div className="bg-[#12121a]/80 backdrop-blur-md border border-white/5 rounded-2xl p-6 md:p-8 shadow-2xl relative">
                
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="email" className="text-sm font-medium text-white/70 ml-1">
                        Work Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        placeholder="founder@startup.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] transition-all"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full group bg-white text-black font-semibold rounded-xl px-4 py-4 mt-2 flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
                    >
                      Request Access
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="text-center text-xs text-white/60 mt-3">
                      No credit card required. Free during beta.
                    </p>
                  </form>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-8 gap-4"
                  >
                    <div className="w-16 h-16 bg-[#6366f1]/20 rounded-full flex items-center justify-center mb-2">
                      <CheckCircle2 className="w-8 h-8 text-[#818cf8]" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">You're on the list!</h3>
                    <p className="text-white/60">
                      Keep an eye on your inbox. We'll be in touch soon.
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
    </section>
  );
}
