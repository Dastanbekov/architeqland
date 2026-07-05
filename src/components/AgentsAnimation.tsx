'use client';

import { motion } from "framer-motion";

export default function AgentsAnimation() {
  const nodes = ["Generate", "Self-test", "Auto-deploy", "Monitor", "Remediate"];
  const radius = 120; // Orbit radius

  return (
    <div className="w-full h-full min-h-[300px] flex items-center justify-center relative overflow-visible">
      
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent"></div>
      
      {/* Center text */}
      <div className="absolute z-10 flex flex-col items-center">
        <span className="text-[#818cf8] font-mono text-[10px] tracking-[0.3em] mb-1">ARCHITEQ</span>
        <span className="text-white font-headline-md text-[22px] tracking-widest uppercase">Agents</span>
      </div>

      {/* Network Container */}
      <div className="relative w-[300px] h-[300px] flex items-center justify-center">
        
        {/* Dashed outer orbit ring */}
        <svg className="absolute inset-0 w-full h-full animate-[spin_40s_linear_infinite]" viewBox="0 0 300 300">
          <circle cx="150" cy="150" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 6" />
        </svg>

        {/* Inner network lines connecting all nodes */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 300">
          {nodes.map((_, i) => {
            const angle1 = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
            const x1 = 150 + Math.cos(angle1) * radius;
            const y1 = 150 + Math.sin(angle1) * radius;
            
            return nodes.map((_, j) => {
               if (i >= j) return null; // Avoid drawing duplicate lines
               const angle2 = (j / nodes.length) * Math.PI * 2 - Math.PI / 2;
               const x2 = 150 + Math.cos(angle2) * radius;
               const y2 = 150 + Math.sin(angle2) * radius;

               return (
                 <motion.line
                   key={`${i}-${j}`}
                   x1={x1} y1={y1} x2={x2} y2={y2}
                   stroke="rgba(99, 102, 241, 0.15)"
                   strokeWidth="1"
                   initial={{ pathLength: 0, opacity: 0 }}
                   animate={{ pathLength: 1, opacity: 1 }}
                   transition={{ duration: 2, delay: 0.5 }}
                 />
               );
            });
          })}
        </svg>

        {/* Nodes */}
        {nodes.map((node, i) => {
          const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <motion.div
              key={node}
              className="absolute flex items-center justify-center z-20"
              style={{ x, y }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.15 + 0.5, duration: 0.5, type: "spring" }}
            >
              <div className="bg-[#12121a] border border-[#6366f1]/40 text-white text-[11px] font-mono px-4 py-2 rounded-lg shadow-[0_0_20px_rgba(99,102,241,0.15)] whitespace-nowrap">
                {node}
              </div>
            </motion.div>
          );
        })}

        {/* Moving Particles (Agents running around doing work) */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-0 h-0 flex items-center justify-center z-30"
            initial={{ rotate: i * 60 }}
            animate={{ rotate: i * 60 + 360 }}
            transition={{ 
              duration: 4 + (i % 3), // Varied speeds
              repeat: Infinity, 
              ease: "linear"
            }}
          >
            <div 
              className="w-2.5 h-2.5 bg-[#818cf8] rounded-full shadow-[0_0_12px_#a5b4fc]" 
              style={{ transform: `translateY(-${radius}px)` }} 
            />
          </motion.div>
        ))}

        {/* Inner core pulsing particle */}
        <motion.div 
          className="absolute w-4 h-4 bg-[#6366f1] rounded-full blur-[2px]"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
