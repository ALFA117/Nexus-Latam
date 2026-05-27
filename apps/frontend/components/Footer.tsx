'use client';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="relative border-t border-[#00D4FF12] py-16 px-6 overflow-hidden">
      {/* Glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-32 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(0,212,255,0.06) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-9 h-9 clip-corner flex items-center justify-center text-xs font-orbitron font-black text-[#060D17]"
                style={{ background: 'linear-gradient(135deg, #00D4FF, #9B30FF)' }}
              >
                NX
              </div>
              <span className="font-orbitron font-black text-lg text-white tracking-wider">
                NEXUS <span className="text-[#00D4FF]">LATAM</span>
              </span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-sm mb-6">
              El primer protocolo autónomo de financiamiento comercial B2B para Latinoamérica.
              Powered by Arbitrum Stylus, Claude AI y Bitso Business.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/ALFA117/Nexus-Latam"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 glass border-cyan rounded flex items-center justify-center text-white/40 hover:text-[#00D4FF] transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </a>
              <span className="flex items-center gap-2 text-xs font-mono text-[#00FF94]">
                <span className="status-dot status-online" />
                ETH México 2026
              </span>
            </div>
          </div>

          {/* Protocol links */}
          <div>
            <p className="font-orbitron text-xs text-[#00D4FF] uppercase tracking-widest mb-4">Protocolo</p>
            <ul className="space-y-2">
              {[
                { label: 'Demo Interactivo', href: '/demo' },
                { label: 'Pitch Deck',       href: '/pitch' },
                { label: 'Agentes IA',       href: '/agents' },
                { label: 'Operaciones',      href: '/trades' },
                { label: 'Yield Vault',      href: '/yield' },
                { label: 'Compliance KYC',   href: '/compliance' },
                { label: 'Audit Trail',      href: '/audit' },
              ].map(item => (
                <li key={item.label}>
                  <Link href={item.href} className="text-white/40 hover:text-[#00D4FF] text-sm font-mono transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Chain info */}
          <div>
            <p className="font-orbitron text-xs text-[#F7B731] uppercase tracking-widest mb-4">On-Chain</p>
            <div className="space-y-3">
              {[
                { l: 'Network',   v: 'Arbitrum Sepolia', c: '#00D4FF' },
                { l: 'Chain ID',  v: '421614',           c: '#00D4FF' },
                { l: 'Currency',  v: 'USDC + ETH',       c: '#F7B731' },
                { l: 'Contracts', v: '4 deployed',       c: '#00FF94' },
                { l: 'NFTs',      v: '4 collections',    c: '#9B30FF' },
              ].map((r) => (
                <div key={r.l} className="flex justify-between items-center">
                  <span className="text-white/30 text-xs font-mono">{r.l}</span>
                  <span className="text-xs font-mono font-semibold" style={{ color: r.c }}>{r.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="divider-neon mb-6" />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-white/25 text-xs font-mono">
            © 2026 NEXUS LATAM · ETH México Hackathon · MIT License
          </p>
          <div className="flex items-center gap-6">
            <span className="text-white/25 text-xs font-mono">Built on Arbitrum</span>
            <span className="text-white/25 text-xs font-mono">Powered by Claude AI</span>
            <span className="text-white/25 text-xs font-mono">Payments by Bitso</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
