'use client';

import { Navbar }  from '../../components/Navbar';
import { Footer }  from '../../components/Footer';
import Link        from 'next/link';

const PROBLEM_POINTS = [
  { stat: '40M+',   label: 'PYMEs en LATAM sin acceso a trade finance formal', color: '#FF3366' },
  { stat: '$350B',  label: 'Brecha anual de financiamiento comercial regional', color: '#FF3366' },
  { stat: '30–90d', label: 'Tiempo promedio de liquidación con métodos actuales', color: '#F7B731' },
  { stat: '3–8%',   label: 'Comisiones ocultas en cartas de crédito tradicionales', color: '#F7B731' },
];

const SOLUTION_POINTS = [
  { icon: '⬡', color: '#00D4FF', title: 'NexusRouter',     desc: 'Clasifica solicitudes y orquesta el flujo completo en <1s' },
  { icon: '◈', color: '#9B30FF', title: 'ComplianceAgent', desc: 'KYC/AML vía Bitso Business · ComplianceNFT on-chain' },
  { icon: '◆', color: '#F7B731', title: 'TradeAgent',       desc: 'Escrow en Arbitrum Stylus (Rust) · LC-NFT transferible' },
  { icon: '⬡', color: '#00FF94', title: 'YieldAgent',       desc: 'Fondos en Aave V3 durante escrow · APY 4.2%' },
  { icon: '◉', color: '#FF6B35', title: 'AuditAgent',       desc: 'Merkle bundles de 500 txs · Audit-NFT permanente' },
];

const TECH_STACK = [
  { name: 'Arbitrum Stylus',  desc: 'Smart contracts en Rust — 10× más eficiente que Solidity',  color: '#00D4FF' },
  { name: 'Claude Opus 4.7',  desc: 'AI con adaptive thinking + prompt caching ($0.30/1M tokens)', color: '#9B30FF' },
  { name: 'Bitso Business',   desc: 'HMAC-SHA256 API · SPEI/PIX/PSE/CVU/CCI/TEF multi-rail',     color: '#00FF94' },
  { name: 'Rare Protocol',    desc: 'Mint de NFTs on-chain — LC, Compliance, Settlement, Audit',  color: '#FF6B35' },
  { name: 'Next.js 14',       desc: 'App Router · wagmi v2 · TypeScript · Tailwind CSS',          color: '#F7B731' },
  { name: 'Aave V3',          desc: 'Yield automático sobre fondos en escrow · Arbitrum pool',    color: '#00FF94' },
];

const METRICS = [
  { value: '<60s',  label: 'Settlement E2E',      color: '#00FF94' },
  { value: '0.3%',  label: 'Fee del protocolo',   color: '#00D4FF' },
  { value: '4.2%',  label: 'APY yield (Aave V3)', color: '#F7B731' },
  { value: '3',     label: 'NFTs por operación',  color: '#9B30FF' },
  { value: '500',   label: 'Txs / audit bundle',  color: '#FF6B35' },
  { value: '6',     label: 'Países LATAM',         color: '#00D4FF' },
];

const TIMELINE = [
  { phase: 'Hackathon',     date: 'Mayo 2026',   desc: 'MVP funcional en Arbitrum Sepolia',       done: true  },
  { phase: 'Beta Privada',  date: 'Q3 2026',     desc: 'Primeras empresas piloto MX/BR/CO',       done: false },
  { phase: 'Mainnet',       date: 'Q4 2026',     desc: 'Lanzamiento en Arbitrum One + Bitso B2B', done: false },
  { phase: 'Expansión',     date: 'Q1-Q2 2027',  desc: '6 países + integración bancaria',         done: false },
];

export default function PitchPage() {
  return (
    <div className="min-h-screen bg-[#060D17] text-white grid-bg">
      <Navbar />

      <div className="page-inner px-4 sm:px-6 max-w-5xl mx-auto pb-20">

        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="py-10 border-b border-[#00D4FF12] text-center">
          <div className="inline-flex items-center gap-2 mb-4 glass border-cyan rounded-full px-4 py-1.5 text-xs font-mono text-[#00D4FF] uppercase tracking-widest">
            <span className="status-dot status-online" />
            ETH México 2026 · Arbitrum Track · Hackathon Pitch
          </div>
          <h1 className="font-orbitron text-4xl sm:text-5xl font-black mb-3">
            <span className="text-white">NEXUS </span>
            <span className="gradient-text-cyan">LATAM</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
            El primer protocolo autónomo de financiamiento comercial B2B para América Latina.
            5 agentes IA que liquidan, financian y auditan en{' '}
            <span className="text-[#F7B731] font-semibold">menos de 60 segundos</span>.
          </p>
        </div>

        {/* ── Problema ────────────────────────────────────────────── */}
        <section className="py-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-[#FF3366] rounded-full" />
            <h2 className="font-orbitron text-2xl font-black text-white">EL PROBLEMA</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PROBLEM_POINTS.map((p) => (
              <div
                key={p.stat}
                className="glass clip-corner p-5 flex items-start gap-4"
                style={{ borderColor: `${p.color}25` }}
              >
                <p className="font-orbitron text-3xl font-black shrink-0" style={{ color: p.color }}>
                  {p.stat}
                </p>
                <p className="text-white/60 text-sm leading-relaxed">{p.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Solución ────────────────────────────────────────────── */}
        <section className="py-12 border-t border-[#00D4FF08]">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-[#00D4FF] rounded-full" />
            <h2 className="font-orbitron text-2xl font-black text-white">LA SOLUCIÓN</h2>
          </div>
          <p className="text-white/50 text-sm mb-8 max-w-2xl">
            NEXUS LATAM usa 5 agentes IA coordinados por Claude Opus 4.7 para automatizar
            completamente el flujo de una Carta de Crédito B2B, desde KYC hasta auditoría.
          </p>
          <div className="space-y-3">
            {SOLUTION_POINTS.map((s, i) => (
              <div
                key={s.title}
                className="glass clip-corner p-4 flex items-center gap-4"
                style={{ borderColor: `${s.color}25` }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0"
                  style={{ background: `${s.color}18`, border: `1px solid ${s.color}40`, color: s.color }}
                >
                  {s.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-orbitron text-sm font-black" style={{ color: s.color }}>
                      {s.title}
                    </span>
                    <span className="text-white/20 text-xs font-mono">paso {i + 1}</span>
                  </div>
                  <p className="text-white/50 text-xs font-mono mt-0.5">{s.desc}</p>
                </div>
                {i < SOLUTION_POINTS.length - 1 && (
                  <span className="text-white/15 text-lg">→</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Métricas ────────────────────────────────────────────── */}
        <section className="py-12 border-t border-[#00D4FF08]">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-[#00FF94] rounded-full" />
            <h2 className="font-orbitron text-2xl font-black text-white">MÉTRICAS CLAVE</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {METRICS.map((m) => (
              <div
                key={m.label}
                className="glass clip-corner p-5 text-center"
                style={{ borderColor: `${m.color}25` }}
              >
                <p
                  className="font-orbitron text-3xl font-black mb-1"
                  style={{ color: m.color, textShadow: `0 0 20px ${m.color}50` }}
                >
                  {m.value}
                </p>
                <p className="text-white/45 text-xs font-mono">{m.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Tech Stack ──────────────────────────────────────────── */}
        <section className="py-12 border-t border-[#00D4FF08]">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-[#9B30FF] rounded-full" />
            <h2 className="font-orbitron text-2xl font-black text-white">TECH STACK</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TECH_STACK.map((t) => (
              <div
                key={t.name}
                className="glass clip-corner-sm p-4 flex items-start gap-3"
                style={{ borderColor: `${t.color}25` }}
              >
                <div
                  className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                  style={{ background: t.color, boxShadow: `0 0 6px ${t.color}` }}
                />
                <div>
                  <p className="font-orbitron text-xs font-black" style={{ color: t.color }}>{t.name}</p>
                  <p className="text-white/40 text-xs font-mono mt-0.5">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Roadmap ─────────────────────────────────────────────── */}
        <section className="py-12 border-t border-[#00D4FF08]">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-[#F7B731] rounded-full" />
            <h2 className="font-orbitron text-2xl font-black text-white">ROADMAP</h2>
          </div>
          <div className="space-y-3">
            {TIMELINE.map((t, i) => (
              <div key={i} className="flex items-center gap-4">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{
                    background: t.done ? '#00FF94' : 'transparent',
                    border:     `2px solid ${t.done ? '#00FF94' : 'rgba(255,255,255,0.2)'}`,
                    boxShadow:  t.done ? '0 0 8px rgba(0,255,148,0.6)' : 'none',
                  }}
                />
                <div
                  className="flex-1 glass clip-corner-sm p-3 flex flex-wrap items-center justify-between gap-2"
                  style={{ borderColor: t.done ? '#00FF9425' : 'rgba(255,255,255,0.06)' }}
                >
                  <div>
                    <span
                      className="font-orbitron text-xs font-black"
                      style={{ color: t.done ? '#00FF94' : 'rgba(255,255,255,0.6)' }}
                    >
                      {t.phase}
                    </span>
                    <p className="text-white/35 text-xs font-mono mt-0.5">{t.desc}</p>
                  </div>
                  <span
                    className="text-xs font-mono"
                    style={{ color: t.done ? '#00FF94' : '#F7B731' }}
                  >
                    {t.date}
                    {t.done && ' ✓'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTAs ────────────────────────────────────────────────── */}
        <div
          className="py-10 px-8 clip-corner-lg text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(0,212,255,0.05), rgba(155,48,255,0.05))',
            border: '1px solid rgba(0,212,255,0.2)',
          }}
        >
          <h3 className="font-orbitron text-xl font-black text-white mb-2">
            ¿Listo para verlo en acción?
          </h3>
          <p className="text-white/50 text-sm mb-6">
            Prueba el demo interactivo o explora el código en GitHub
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/demo">
              <button className="btn-solid-cyan px-8 py-3">▶ VER DEMO</button>
            </Link>
            <Link href="/agents">
              <button className="btn-neon px-8 py-3">AGENTES IA</button>
            </Link>
            <a
              href="https://github.com/ALFA117/Nexus-Latam"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white/70 text-sm font-mono transition-colors border border-white/10 hover:border-white/20 px-6 py-3 rounded"
            >
              GitHub →
            </a>
          </div>

          {/* Hackathon badges */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {[
              { l: 'ETH México 2026',  c: '#9B30FF' },
              { l: 'Arbitrum Stylus',  c: '#00D4FF' },
              { l: 'Claude Opus 4.7',  c: '#F7B731' },
              { l: 'Bitso Business',   c: '#00FF94' },
              { l: 'Rare Protocol',    c: '#FF6B35' },
              { l: 'Aave V3',          c: '#00D4FF' },
            ].map(b => (
              <span
                key={b.l}
                className="clip-corner-sm text-xs font-orbitron font-bold px-3 py-1"
                style={{ color: b.c, background: `${b.c}10`, border: `1px solid ${b.c}35` }}
              >
                {b.l}
              </span>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
