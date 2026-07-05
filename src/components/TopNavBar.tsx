'use client';

import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';

export default function TopNavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ease-in-out ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
        
        {/* Left Side: Logo & Links */}
        <div className="flex items-center gap-10">
          <a href="#" className="hover:opacity-80 transition-opacity flex items-center">
            <span className={`text-[28px] font-bold tracking-tighter font-sans transition-colors duration-300 ${scrolled ? 'text-[#222222]' : 'text-white'}`}>
              Architeq
            </span>
          </a>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className={`text-sm font-medium transition-colors ${scrolled ? 'text-gray-600 hover:text-black' : 'text-white/80 hover:text-white'}`}>
              Platform
            </a>
            <a href="#" className={`text-sm font-medium transition-colors ${scrolled ? 'text-gray-600 hover:text-black' : 'text-white/80 hover:text-white'}`}>
              Solutions
            </a>
            <a href="#" className={`text-sm font-medium transition-colors ${scrolled ? 'text-gray-600 hover:text-black' : 'text-white/80 hover:text-white'}`}>
              Pricing
            </a>
          </div>
        </div>

        {/* Right Side: CTA & Mobile Menu */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6">
            <a href="#waitlist" className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors shadow-sm ${scrolled ? 'bg-black text-white hover:bg-gray-800' : 'bg-white text-black hover:bg-gray-200'}`}>
              Request Access
            </a>
          </div>
          
          <button className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-black hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}>
            <Menu className="w-5 h-5" />
          </button>
        </div>
        
      </div>
    </nav>
  );
}
