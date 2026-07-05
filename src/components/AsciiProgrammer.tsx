'use client';

import React, { useEffect, useState } from 'react';

export default function AsciiProgrammer() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % 4); // 4 animation frames
    }, 400); // changes every 400ms
    return () => clearInterval(interval);
  }, []);

  const getHackerArt = () => {
    // A cute ASCII nerd programming at a laptop
    const base = [
      "       .---.",
      "      /     \\",
      "      \\.@-@./",
      "      /`\\_/`\\",
    ];

    // Arms typing animation
    const arms = [
      "     //  _  \\\\",
      "    | \\     / |",
      "   /`\\_`>  <_/`\\",
      "   \\__/'---'\\__/",
    ];
    const armsFrame2 = [
      "     //  _  \\\\",
      "    | /     \\ |",
      "   /`\\_`>  <_/`\\",
      "   \\__/'---'\\__/",
    ];
    const armsFrame3 = [
      "     //  _  \\\\",
      "    | |     | |",
      "   /`\\_`>  <_/`\\",
      "   \\__/'---'\\__/",
    ];

    const currentArms = frame === 0 ? arms : frame === 1 ? armsFrame2 : frame === 2 ? armsFrame3 : armsFrame2;

    const desk = [
      "  ________________",
      " /    <code/>     \\",
      "/__________________\\",
      " \\__\\__\\__\\__\\__\\__/"
    ];

    return [...base, ...currentArms, ...desk].join('\n');
  };

  return (
    <div className="relative group perspective-1000">
      <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
      <pre className="relative z-10 font-mono text-[14px] md:text-[16px] leading-[1.1] text-primary bg-surface-container-lowest border border-outline-variant/30 p-8 rounded-2xl shadow-2xl overflow-hidden group-hover:border-primary/50 transition-colors">
        <code className="block animate-pulse-slow">
          {getHackerArt()}
        </code>
      </pre>
      
      {/* Floating particles/code snippets */}
      <div className="absolute -top-4 -right-4 font-mono text-xs text-primary/60 opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-500">
        git commit -m "fix"
      </div>
      <div className="absolute top-1/2 -left-8 font-mono text-xs text-primary/60 opacity-0 group-hover:opacity-100 group-hover:-translate-x-2 transition-all duration-500 delay-100">
        npm run build
      </div>
    </div>
  );
}
