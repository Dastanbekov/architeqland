'use client';

import { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import AgentsAnimation from "@/components/AgentsAnimation";
import ArchitecturePipeline from "@/components/ArchitecturePipeline";
import DeployPipeline from "@/components/DeployPipeline";

const features = [
  {
    id: "blueprint",
    layout: "left-pipeline",
    badge: "Speed & Structure",
    title: "Fast, production-grade architecture.",
    description: "We don't just generate messy code snippets. Architeq instantly designs robust databases, clear APIs, and scalable infrastructure based on your business needs, saving you months of development time.",
  },
  {
    id: "agents",
    layout: "right-agents",
    badge: "Autonomous Agents",
    title: "A team of expert AI developers.",
    description: "Our agents work together in a seamless network. They autonomously write the logic, self-test for bugs, review the security, and remediate errors 24/7.",
  },
  {
    id: "deploy",
    layout: "top-pipeline",
    badge: "Instant Launch",
    title: "From idea to live product.",
    description: "No need to configure servers or understand complex hosting. Architeq automatically deploys your finished application so you can start serving customers immediately.",
  }
];

export default function FeatureBento() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const index = Math.min(
      features.length - 1,
      Math.floor(latest * features.length)
    );
    setActiveIndex(index);
  });

  const activeFeature = features[activeIndex];

  return (
    <section ref={containerRef} className="relative h-[300vh]">
      
      {/* Sticky container */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden max-w-7xl mx-auto px-margin-desktop px-margin-mobile">
        
        {/* Header */}
        <div className="text-center mb-12 relative z-20">
          <h2 className="font-display-lg text-display-lg md:text-[48px] tracking-tight text-primary mb-4">
            Everything you need to run a business online.
          </h2>
          <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto text-lg">
            We handle the technical heavy lifting, so you can focus on your customers and growing your revenue.
          </p>
          
          <div className="flex justify-center gap-2 mt-8">
            {features.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeIndex ? 'w-8 bg-primary' : 'w-2 bg-outline-variant/30'}`} 
              />
            ))}
          </div>
        </div>

        {/* Feature Display Area */}
        <div className="w-full max-w-5xl mx-auto flex items-center justify-center min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeature.id}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full"
            >
              
              {/* Layout Branching */}
              
              {activeFeature.layout === "left-pipeline" && (
                <div className="flex flex-col-reverse lg:flex-row gap-10 lg:items-center w-full">
                  <div className="w-full lg:w-1/2 aspect-video relative flex items-center justify-center">
                    <ArchitecturePipeline />
                  </div>
                  <div className="w-full lg:w-1/2 flex flex-col gap-3 pl-0 lg:px-8">
                      <h3 className="text-3xl md:text-4xl tracking-tight font-light text-primary">{activeFeature.title}</h3>
                      <p className="text-base leading-relaxed text-on-surface-variant">{activeFeature.description}</p>
                  </div>
                </div>
              )}

              {activeFeature.layout === "right-agents" && (
                <div className="flex flex-col lg:flex-row gap-10 lg:items-center w-full">
                  <div className="w-full lg:w-1/2 flex flex-col gap-3 pl-0 lg:px-8 order-2 lg:order-1">
                      <h3 className="text-3xl md:text-4xl tracking-tight font-light text-primary">{activeFeature.title}</h3>
                      <p className="text-base leading-relaxed text-on-surface-variant">{activeFeature.description}</p>
                  </div>
                  <div className="w-full lg:w-1/2 aspect-video relative flex items-center justify-center order-1 lg:order-2">
                    <AgentsAnimation />
                  </div>
                </div>
              )}

              {activeFeature.layout === "top-pipeline" && (
                <div className="flex flex-col gap-10 items-center justify-center w-full">
                  <div className="w-full h-auto relative flex items-center justify-center">
                    <DeployPipeline />
                  </div>
                  <div className="w-full max-w-2xl flex flex-col gap-3 text-center items-center">
                      <h3 className="text-3xl md:text-4xl tracking-tight font-light text-primary">{activeFeature.title}</h3>
                      <p className="text-base leading-relaxed text-on-surface-variant">{activeFeature.description}</p>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
