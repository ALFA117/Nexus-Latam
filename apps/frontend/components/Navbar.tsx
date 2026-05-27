'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ConnectButton } from './ConnectButton';

const NAV_LINKS = [
  { href: '/demo',        label: 'Demo' },
  { href: '/pitch',       label: 'Pitch' },
  { href: '/agents',      label: 'Agentes' },
  { href: '/trades',      label: 'Trades' },
  { href: '/yield',       label: 'Yield' },
  { href: '/compliance',  label: 'KYC' },
  { href: '/audit',       label: 'Audit' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background:    scrolled ? 'rgba(6,13,23,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom:  scrolled ? '1px solid rgba(0,212,255,0.12)' : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <div
            className="w-8 h-8 clip-corner flex items-center justify-center text-xs font-orbitron font-black text-[#060D17]"
            style={{ background: 'linear-gradient(135deg, #00D4FF, #9B30FF)' }}
          >
            NX
          </div>
          <span className="font-orbitron font-black text-base text-white group-hover:text-[#00D4FF] transition-colors tracking-wider hidden sm:block">
            NEXUS <span className="text-[#00D4FF]">LATAM</span>
          </span>
        </Link>

        {/* Desktop nav links — solo visible en lg+ */}
        <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-xs font-mono text-white/50 hover:text-[#00D4FF] transition-colors uppercase tracking-widest relative group whitespace-nowrap"
            >
              {link.label}
              <span className="absolute bottom-1 left-3 right-3 h-px bg-[#00D4FF] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Link>
          ))}
        </div>

        {/* Acciones desktop */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <span className="hidden lg:flex items-center gap-1.5 text-xs font-mono text-[#00FF94] whitespace-nowrap">
            <span className="status-dot status-online" />
            Sepolia
          </span>
          <ConnectButton />
          <Link href="/trades" className="hidden lg:block">
            <button className="btn-solid-cyan text-xs py-2 px-4 whitespace-nowrap">
              LAUNCH APP
            </button>
          </Link>
        </div>

        {/* Mobile: ConnectButton + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <ConnectButton />
          <button
            className="text-white/60 hover:text-white p-2 shrink-0"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <div className={`w-5 h-0.5 bg-current mb-1.5 transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <div className={`w-5 h-0.5 bg-current mb-1.5 transition-all ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <div className={`w-5 h-0.5 bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu desplegable */}
      {menuOpen && (
        <div className="md:hidden glass-dark border-t border-[#00D4FF15] px-4 py-4 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-mono text-white/60 hover:text-[#00D4FF] transition-colors uppercase tracking-widest py-2.5 px-2 border-b border-white/5 last:border-0"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/trades" onClick={() => setMenuOpen(false)} className="mt-3">
            <button className="btn-solid-cyan w-full text-sm">LAUNCH APP</button>
          </Link>
        </div>
      )}
    </nav>
  );
}
