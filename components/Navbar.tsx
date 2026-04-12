'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShieldCheck, Globe } from 'lucide-react';
import ThemeToggle from './ThemeToggle'; 

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Clubs', href: '/clubs' },
    { name: 'Council', href: '/council' },
    { name: 'Service', href: '/service' },
    { name: 'Rotary', href: '/rotary' },
    { name: 'Events', href: '/events' }, 
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'py-3' : 'py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Main Nav Container */}
        <div className={`relative flex items-center justify-between bg-white/80 dark:bg-black/40 border border-neutral-200 dark:border-white/10 backdrop-blur-2xl px-6 sm:px-8 py-3 sm:py-4 rounded-[2rem] transition-all ${scrolled ? 'shadow-2xl shadow-black/5 dark:shadow-black/50 border-neutral-300 dark:border-white/20' : ''}`}>
          
          {/* LOGO SECTION */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 shadow-lg shadow-rose-500/20">
              <span className="font-black text-white text-xs">3080</span>
            </div>
            <div className="hidden sm:block">
              <h2 className="text-sm font-black uppercase tracking-tighter leading-none text-neutral-900 dark:text-white italic">Rotaract 3080</h2>
              <p className="text-[8px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mt-1 leading-none">RID 3080 • India</p>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  pathname === link.href 
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20' 
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* ACTIONS & TOGGLES */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            <ThemeToggle />

            <Link 
              href="/login" 
              className="hidden md:flex items-center gap-2 bg-neutral-900 dark:bg-white text-white dark:text-black border border-neutral-800 dark:border-white/10 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 dark:hover:bg-rose-500 dark:hover:text-white transition-all shadow-sm"
            >
              <ShieldCheck size={14} /> Portal
            </Link>

            {/* MOBILE HAMBURGER */}
            <button 
              className="lg:hidden text-neutral-800 dark:text-white p-2 hover:bg-neutral-100 dark:hover:bg-white/5 rounded-xl transition-all"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        <div className={`lg:hidden absolute left-4 right-4 mt-3 p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-[2.5rem] backdrop-blur-3xl transition-all duration-500 origin-top shadow-2xl ${isOpen ? 'scale-y-100 opacity-100 visible' : 'scale-y-95 opacity-0 invisible'}`}>
          <div className="flex flex-col gap-3 text-center">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-xs font-black uppercase tracking-[0.2em] py-3.5 rounded-2xl transition-all ${
                  pathname === link.href 
                  ? 'text-rose-600 bg-rose-50 dark:bg-rose-500/10' 
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="h-[1px] bg-neutral-100 dark:bg-white/5 my-2"></div>
            <Link 
              href="/login" 
              onClick={() => setIsOpen(false)}
              className="bg-rose-600 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-rose-500/20"
            >
              Access Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}