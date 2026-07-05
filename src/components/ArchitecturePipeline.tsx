'use client';

import { motion } from "framer-motion";
import { Brain, Database, Server, Code2 } from "lucide-react";

export default function ArchitecturePipeline() {
  const steps = [
    { icon: Brain, label: "Business Logic", desc: "AI maps your rules" },
    { icon: Database, label: "Data Schema", desc: "Optimal structures" },
    { icon: Server, label: "API Routes", desc: "Secure endpoints" },
    { icon: Code2, label: "Production Code", desc: "Ready to deploy" },
  ];

  return (
    <div className="w-full h-full min-h-[450px] flex items-center justify-center relative py-12">
      {/* Background ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#6366f1]/10 via-transparent to-transparent blur-3xl opacity-50 pointer-events-none" />
      
      <div className="flex flex-col gap-6 relative z-10 w-full max-w-sm ml-4">
        
        {/* Animated Connecting Vertical Line */}
        <div className="absolute left-[27px] top-8 bottom-8 w-[2px] bg-outline-variant/20 rounded-full overflow-hidden">
          <motion.div 
            className="w-full h-32 bg-gradient-to-b from-transparent via-[#6366f1] to-transparent"
            initial={{ y: -150 }}
            animate={{ y: 500 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div 
              key={step.label}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 + 0.3, duration: 0.6, type: "spring", bounce: 0.4 }}
              className="flex items-center gap-6 relative group"
            >
              {/* Node Icon */}
              <div className="w-14 h-14 rounded-2xl bg-surface-container-lowest border border-[#6366f1]/30 flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative z-10 transition-transform duration-300 group-hover:scale-110">
                <Icon className="w-6 h-6 text-[#6366f1] relative z-10" />
                {/* Soft pulse behind icon */}
                <motion.div 
                  className="absolute inset-0 bg-[#6366f1]/10 rounded-2xl"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ delay: index * 0.3, duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>

              {/* Node Label Card */}
              <div className="flex-1 transition-transform duration-300 group-hover:translate-x-2">
                <div className="bg-surface-container-lowest/80 backdrop-blur-md border border-outline-variant/30 px-5 py-3 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="font-headline-sm text-sm font-semibold text-primary mb-0.5">{step.label}</h4>
                  <p className="font-body-sm text-xs text-on-surface-variant">{step.desc}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
