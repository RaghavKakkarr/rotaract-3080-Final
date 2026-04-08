'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShieldCheck } from 'lucide-react';

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
    { name: 'Events', href: '/featured' }, // Featured Events Page
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'py-4' : 'py-8'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`relative flex items-center justify-between bg-white/[0.03] border border-white/10 backdrop-blur-2xl px-8 py-4 rounded-[2rem] transition-all ${scrolled ? 'shadow-2xl border-white/20' : ''}`}>
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
              <span className="font-black text-white text-xs">3080</span>
            </div>
            <div className="hidden sm:block">
              <h2 className="text-sm font-black uppercase tracking-tighter leading-none text-white italic">Rotaract 3080</h2>
              <p className="text-[8px] font-bold text-neutral-500 uppercase tracking-widest mt-1 leading-none">RID 3080 • INDIA</p>
            </div>
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  pathname === link.href 
                  ? 'bg-rose-500 text-white' 
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* DASHBOARD ACCESS */}
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all"
            >
              <ShieldCheck size={14} /> Portal
            </Link>

            {/* MOBILE TOGGLE */}
            <button 
              className="lg:hidden text-white p-2 hover:bg-white/5 rounded-xl transition-all"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <div className={`lg:hidden absolute left-6 right-6 mt-4 p-8 bg-neutral-900 border border-white/10 rounded-[2.5rem] backdrop-blur-3xl transition-all duration-500 origin-top shadow-2xl ${isOpen ? 'scale-y-100 opacity-100 visible' : 'scale-y-95 opacity-0 invisible'}`}>
          <div className="flex flex-col gap-4 text-center">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-sm font-black uppercase tracking-[0.2em] py-3 rounded-2xl ${
                  pathname === link.href ? 'text-rose-500 bg-rose-500/10' : 'text-neutral-500'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="h-[1px] bg-white/5 my-2"></div>
            <Link 
              href="/login" 
              onClick={() => setIsOpen(false)}
              className="bg-rose-500 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest"
            >
              Access Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}