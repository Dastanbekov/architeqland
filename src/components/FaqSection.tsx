'use client';

import { useState } from 'react';

const faqs = [
  { question: "Do I need to know how to code?", answer: "No. You don't need any technical experience. Just tell Architeq what your business does and what features you need (like taking payments, booking appointments, or sending emails)." },
  { question: "Who owns the software that gets built?", answer: "You do. 100%. We build the software and hand it over to you. There are no ongoing fees to use the code, and you are never locked into our platform." },
  { question: "Can I hire developers later to work on it?", answer: "Yes! Because Architeq builds standard, professional software (exactly how a human developer would), any technical team you hire later can easily take over and add new features." },
  { question: "What if my app gets really popular?", answer: "Your app is built on enterprise-grade infrastructure. This means it won't crash when you get featured on the news or experience a huge spike in traffic." },
  { question: "How do I get started?", answer: "We are currently inviting early business partners. Click 'Request Invite' below to join the waitlist." },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-xxl max-w-4xl mx-auto px-margin-desktop px-margin-mobile">
      <div className="text-center mb-16">
        <h2 className="font-display-lg text-[40px] tracking-tight text-primary mb-4 font-light">
          Common Questions
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index} 
              className="border-b border-outline-variant/40 pb-4"
            >
              <button 
                className="w-full flex justify-between items-center text-left py-4 group"
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span className="font-headline-md text-[18px] text-primary group-hover:text-[#6366f1] transition-colors">
                  {faq.question}
                </span>
                <span className={`material-symbols-outlined text-on-surface-variant transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <p className="pb-4 font-body-md text-on-surface-variant text-[16px] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
