'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ConnectButton } from './ConnectButton';

const NAV_LINKS = [
  { href: '#agents',   label: 'Agentes' },
  { href: '#nfts',     label: 'NFTs' },
  { href: '/trades',   label: 'Trades' },
  { href: '/yield',    label: 'Yield' },
  { href: '/compliance', label: 'KYC' },
  { href: '/audit',    label: 'Audit' },
];

export function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(6,13,23,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,212,255,0.12)' : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8">
            <div
              className="w-8 h-8 clip-corner flex items-center justify-center text-xs font-orbitron font-black text-[#060D17]"
              style={{ background: 'linear-gradient(135deg, #00D4FF, #9B30FF)' }}
            >
              NX
            </div>
          </div>
          <div>
            <span className="font-orbitron font-black text-base text-white group-hover:text-[#00D4FF] transition-colors tracking-wider">
              NEXUS
            </span>
            <span className="font-orbitron font-black text-base text-[#00D4FF] ml-1 tracking-wider">
              LATAM
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm font-mono text-white/50 hover:text-[#00D4FF] transition-colors uppercase tracking-widest relative group"
            >
              {link.label}
              <span className="absolute bottom-1 left-4 right-4 h-px bg-[#00D4FF] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Link>
          ))}
        </div>

        {/* CTA + wallet */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[#00FF94]">
            <span className="status-dot status-online" />
            <span>Sepolia Live</span>
          </div>
          <ConnectButton />
          <Link href="/trades">
            <button className="btn-solid-cyan text-xs py-2 px-5">
              LAUNCH APP
            </button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white/60 hover:text-white p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <div className={`w-5 h-0.5 bg-current mb-1 transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
          <div className={`w-5 h-0.5 bg-current mb-1 transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <div className={`w-5 h-0.5 bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass-dark border-t border-[#00D4FF15] px-6 py-4 flex flex-col gap-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-mono text-white/60 hover:text-[#00D4FF] transition-colors uppercase tracking-widest py-2"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/trades" onClick={() => setMenuOpen(false)}>
            <button className="btn-solid-cyan w-full mt-2">LAUNCH APP</button>
          </Link>
        </div>
      )}
    </nav>
  );
}
