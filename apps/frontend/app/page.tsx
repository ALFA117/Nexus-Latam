'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Navbar }            from '../components/Navbar';
import { HeroSection }       from '../components/HeroSection';
import { LiveTicker }        from '../components/LiveTicker';
import { AgentGrid }         from '../components/AgentGrid';
import { NFTShowcase }       from '../components/NFTShowcase';
import { ProtocolFeatures }  from '../components/ProtocolFeatures';
import { Footer }            from '../components/Footer';

/* ── Animated counter ──────────────────────────────────────────── */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const step = Math.ceil(to / 60);
        let current = 0;
        const timer = setInterval(() => {
          current = Math.min(current + step, to);
          setCount(current);
          if (current >= to) clearInterval(timer);
        }, 24);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [to]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ── Terminal trace ─────────────────────────────────────────────── */
const TRACE_LINES = [
  { delay: 0,    color: '#00D4FF', text: '[NexusRouter]    Solicitud recibida — LC $25,000 USDC MX→CO' },
  { delay: 800,  color: '#9B30FF', text: '[ComplianceAgent] KYC score: 876 · Tier: VERIFIED · NFT: NC-RFC123' },
  { delay: 1600, color: '#F7B731', text: '[TradeAgent]     Escrow deployed 0x1a2b... · LC-NFT #8821 minted' },
  { delay: 2400, color: '#00FF94', text: '[YieldAgent]     $25,000 depositados en Aave V3 · APY: 4.2%' },
  { delay: 3200, color: '#00D4FF', text: '[TradeAgent]     Entrega confirmada · Settlement iniciado' },
  { delay: 4000, color: '#00FF94', text: '[YieldAgent]     Yield generado: +$312 USDC distribuido al seller' },
  { delay: 4800, color: '#FF6B35', text: '[AuditAgent]     Audit Bundle #42 · Merkle: 0xabc... · NFT minted' },
  { delay: 5600, color: '#00FF94', text: '[NexusRouter]    ✓ SETTLED en 58s · Fee: 0.3% · SPEI→USDC→PSE' },
];

function TerminalTrace() {
  const [visible, setVisible] = useState<number[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        TRACE_LINES.forEach((line, i) => {
          setTimeout(() => setVisible((prev) => [...prev, i]), line.delay);
        });
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="terminal rounded-lg p-6 scanlines relative overflow-hidden">
      {/* Terminal header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#00D4FF15]">
        <div className="w-3 h-3 rounded-full bg-[#FF3366]" />
        <div className="w-3 h-3 rounded-full bg-[#F7B731]" />
        <div className="w-3 h-3 rounded-full bg-[#00FF94]" />
        <span className="ml-3 text-white/30 text-xs font-mono">nexus-protocol — live-trace</span>
      </div>

      <div className="space-y-1.5">
        {TRACE_LINES.map((line, i) => (
          <div
            key={i}
            className="flex gap-2 text-xs font-mono transition-all duration-300"
            style={{
              opacity: visible.includes(i) ? 1 : 0,
              transform: visible.includes(i) ? 'none' : 'translateX(-8px)',
            }}
          >
            <span className="text-white/20 shrink-0 select-none">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span style={{ color: line.color }}>{line.text}</span>
          </div>
        ))}
        {visible.length > 0 && visible.length < TRACE_LINES.length && (
          <div className="flex gap-2 text-xs font-mono">
            <span className="text-white/20">··</span>
            <span className="text-[#00D4FF] blink">_</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Main landing page ──────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#060D17] text-white overflow-x-hidden">
      <Navbar />

      {/* ── 1. HERO ─────────────────────────────────────────────── */}
      <HeroSection />

      {/* ── 2. LIVE TICKER ──────────────────────────────────────── */}
      <LiveTicker />

      {/* ── 3. PROTOCOL STATS ───────────────────────────────────── */}
      <section className="py-20 px-6 relative">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(0,212,255,0.04) 0%, transparent 70%)' }}
        />
        <div className="max-w-7xl mx-auto">
          {/* Divider label */}
          <div className="flex items-center gap-4 mb-14 justify-center">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#00D4FF33]" />
            <span className="font-orbitron text-xs text-white/30 uppercase tracking-widest px-4">
              Métricas del Protocolo
            </span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#00D4FF33]" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                value: 1200000, suffix: '',   prefix: '$',
                label: 'Volumen Total USDC',
                sub: 'en operaciones procesadas',
                color: '#00D4FF',
                icon: '📊',
              },
              {
                value: 48, suffix: '',        prefix: '',
                label: 'Operaciones Hoy',
                sub: 'liquidadas en <60s',
                color: '#F7B731',
                icon: '⚡',
              },
              {
                value: 144, suffix: '',       prefix: '',
                label: 'NFTs Acuñados',
                sub: 'en Arbitrum Sepolia',
                color: '#9B30FF',
                icon: '◈',
              },
              {
                value: 32104, suffix: '',     prefix: '$',
                label: 'Yield Generado',
                sub: 'via Aave V3',
                color: '#00FF94',
                icon: '📈',
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="glass clip-corner p-6 text-center card-hover"
                style={{ borderColor: `${stat.color}22` }}
              >
                <div
                  className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center text-xl"
                  style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}30` }}
                >
                  {stat.icon}
                </div>
                <p
                  className="font-orbitron text-3xl font-black mb-1"
                  style={{ color: stat.color, textShadow: `0 0 20px ${stat.color}50` }}
                >
                  {stat.prefix}<Counter to={stat.value} />
                </p>
                <p className="text-white font-semibold text-sm mb-1">{stat.label}</p>
                <p className="text-white/35 text-xs font-mono">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. AGENTS ───────────────────────────────────────────── */}
      <AgentGrid />

      {/* ── 5. LIVE TERMINAL ────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-4 text-xs font-mono text-[#00D4FF] uppercase tracking-widest">
              <span className="w-8 h-px bg-[#00D4FF]" />
              PROTOCOL TRACE
              <span className="w-8 h-px bg-[#00D4FF]" />
            </div>
            <h2 className="font-orbitron text-3xl md:text-4xl font-black mb-3">
              <span className="text-white">VE EL PROTOCOLO </span>
              <span className="gradient-text-cyan">EN ACCIÓN</span>
            </h2>
            <p className="text-white/40 text-sm font-mono">
              Flujo completo de una Carta de Crédito MX→CO procesada en tiempo real
            </p>
          </div>
          <TerminalTrace />
        </div>
      </section>

      {/* ── 6. NFT SHOWCASE ─────────────────────────────────────── */}
      <NFTShowcase />

      {/* ── 7. PROTOCOL FEATURES & STACK ────────────────────────── */}
      <ProtocolFeatures />

      {/* ── 8. CTA FINAL ────────────────────────────────────────── */}
      <section className="py-28 px-6 relative overflow-hidden">
        {/* Bg rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full border border-[#00D4FF08] spin-slow" />
          <div className="absolute w-[400px] h-[400px] rounded-full border border-[#9B30FF08]"
            style={{ animation: 'spin-slow 30s linear infinite reverse' }}
          />
          <div className="absolute w-[200px] h-[200px] rounded-full border border-[#F7B73108] spin-slow" />
        </div>

        {/* Glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 50% 60% at 50% 50%, rgba(0,212,255,0.06) 0%, transparent 70%)' }}
        />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <p className="font-mono text-xs text-[#00D4FF] uppercase tracking-widest mb-4">
            ETH México 2026 · Arbitrum Track
          </p>
          <h2 className="font-orbitron text-4xl md:text-6xl font-black leading-none mb-6">
            <span className="text-white">EL FUTURO DEL</span>
            <br />
            <span className="gradient-text-full">COMERCIO LATAM</span>
            <br />
            <span className="text-white">ES AHORA</span>
          </h2>
          <p className="text-white/50 text-base leading-relaxed mb-10 max-w-xl mx-auto">
            NEXUS LATAM demuestra que el trade finance puede ser autónomo, transparente
            y accessible para las 40M+ PYMEs de América Latina.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/trades">
              <button className="btn-solid-cyan text-sm px-10 py-4">
                ABRIR DASHBOARD
              </button>
            </Link>
            <a
              href="https://github.com/ALFA117/Nexus-Latam"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="btn-neon text-sm px-10 py-4">
                VER CÓDIGO
              </button>
            </a>
          </div>

          {/* Hackathon badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-10">
            {[
              { label: 'ETH México 2026', color: '#9B30FF' },
              { label: 'Arbitrum Stylus', color: '#00D4FF' },
              { label: 'Claude AI',       color: '#F7B731' },
              { label: 'Bitso Business',  color: '#00FF94' },
              { label: 'Rare Protocol',   color: '#FF6B35' },
            ].map((b) => (
              <span
                key={b.label}
                className="clip-corner-sm text-xs font-orbitron font-bold px-3 py-1.5"
                style={{
                  color: b.color,
                  background: `${b.color}10`,
                  border: `1px solid ${b.color}35`,
                }}
              >
                {b.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
