// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { key: 'home', label: 'Home' },
    { key: 'live', label: 'Product' },
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'about', label: 'About' },
    { key: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (key) => {
    setActiveTab(key);
    setMobileOpen(false);
  };

  return (
    <>
      <header className="w-full max-w-[740px] flex items-center justify-between md:justify-center gap-3 sm:gap-4 md:gap-6 shrink-0 z-20 animate-slideDown">
        {/* Logo Button - Dark Circular Disc with White Rim */}
        <button 
          onClick={() => handleNavClick('home')}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black border border-white/30 shadow-[0_0_12px_rgba(255,255,255,0.15)] grid place-items-center hover:scale-105 transition-transform cursor-pointer p-1 shrink-0"
          title="VoiceGuard Defense"
        >
          <img 
            src="/assets/logo.webp" 
            alt="VoiceGuard Logo" 
            className="w-full h-full object-contain rounded-full" 
          />
        </button>

        {/* Desktop Nav Pill */}
        <nav className="hidden md:flex h-11 md:h-12 max-w-[490px] flex-1 bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.3)] items-center justify-around px-3">
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => handleNavClick(item.key)}
              className={`relative font-medium text-xs md:text-sm transition-all px-3 py-2 cursor-pointer ${
                activeTab === item.key 
                  ? 'text-black font-semibold' 
                  : 'text-[#444444] hover:text-black opacity-80 hover:opacity-100'
              }`}
            >
              {item.label}
              {activeTab === item.key && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-black"></span>
              )}
            </button>
          ))}
        </nav>

        {/* Desktop Sign In Button */}
        <button 
          onClick={() => handleNavClick('signin')}
          className="hidden md:block h-11 md:h-12 px-6 rounded-full bg-[#1e1e20] text-[#e4e4e7] border border-white/10 font-medium text-xs md:text-sm shadow-md hover:bg-[#2a2a2d] hover:text-white transition-all hover:scale-105 cursor-pointer shrink-0"
        >
          Sign In
        </button>

        {/* Mobile Burger Button */}
        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden w-10 h-10 rounded-full bg-[#1e1e20] border border-white/15 text-white flex items-center justify-center cursor-pointer"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          <div onClick={() => setMobileOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"></div>
          <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-sm bg-white rounded-3xl p-5 shadow-2xl z-50 flex flex-col items-center gap-3">
            {navItems.map(item => (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.key)}
                className={`font-medium text-base text-[#2e2e2e] cursor-pointer ${activeTab === item.key ? 'opacity-100 font-semibold' : 'opacity-60'}`}
              >
                {item.label}
              </button>
            ))}
            <button 
              onClick={() => handleNavClick('signin')}
              className="w-full h-12 rounded-full bg-[#28282a] text-white font-semibold text-sm mt-2 cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </>
      )}
    </>
  );
}
