'use client';

import { motion } from "framer-motion";
import { Lightbulb, Cog, Cloud, Rocket } from "lucide-react";

export default function DeployPipeline() {
  const steps = [
    { icon: Lightbulb, label: "Idea", desc: "Natural language" },
    { icon: Cog, label: "Build", desc: "Agents code it" },
    { icon: Cloud, label: "Deploy", desc: "Edge network" },
    { icon: Rocket, label: "Live", desc: "Global scale" },
  ];

  return (
    <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center relative py-12 overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#6366f1]/10 via-transparent to-transparent blur-3xl opacity-50 pointer-events-none" />

      <div className="flex flex-row items-start justify-between w-full max-w-4xl relative z-10 px-4 md:px-12">
        
        {/* Animated Connecting Horizontal Line */}
        <div className="absolute top-[27px] left-16 right-16 h-[2px] bg-outline-variant/20 rounded-full overflow-hidden z-0 hidden md:block">
          <motion.div 
            className="w-48 h-full bg-gradient-to-r from-transparent via-[#6366f1] to-transparent"
            initial={{ x: -200 }}
            animate={{ x: 1000 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div 
              key={step.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 + 0.3, duration: 0.6, type: "spring", bounce: 0.4 }}
              className="flex flex-col items-center gap-5 relative z-10 w-32 group"
            >
              {/* Node Icon */}
              <div className="w-14 h-14 rounded-2xl bg-surface-container-lowest border border-[#6366f1]/30 flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg bg-white dark:bg-black">
                <Icon className="w-6 h-6 text-[#6366f1] relative z-10" />
                {/* Soft pulse behind icon */}
                <motion.div 
                  className="absolute inset-0 bg-[#6366f1]/10 rounded-2xl"
                  animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ delay: index * 0.3, duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>

              {/* Label */}
              <div className="text-center transition-transform duration-300 group-hover:translate-y-1">
                <h4 className="font-headline-sm text-sm font-bold text-primary mb-1 tracking-wide">{step.label}</h4>
                <p className="font-body-sm text-[11px] text-on-surface-variant uppercase tracking-wider">{step.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
