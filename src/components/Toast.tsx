'use client';

import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
}

export default function Toast({ message }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    const enterTimer = setTimeout(() => setVisible(true), 10);
    // Trigger exit animation
    const exitTimer = setTimeout(() => setVisible(false), 4200);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
    };
  }, []);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed bottom-8 right-8 z-[1000] flex items-center gap-[10px] px-[22px] py-[14px] rounded-[var(--radius-md)] border border-[rgba(139,92,246,0.4)] bg-[rgba(10,10,18,0.95)] backdrop-blur-md text-sm text-[var(--text-primary)] transition-transform duration-[400ms]"
      style={{
        boxShadow: 'var(--glow-purple), 0 16px 40px rgba(0,0,0,0.5)',
        transform: visible ? 'translateX(0)' : 'translateX(140%)',
        transitionTimingFunction: visible ? 'cubic-bezier(0.175,0.885,0.32,1.275)' : 'ease-in',
      }}
    >
      <span aria-hidden="true">✦</span>
      <span>{message}</span>
    </div>
  );
}
