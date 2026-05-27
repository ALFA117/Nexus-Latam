'use client';

import { useState, useEffect, useRef } from 'react';
import { Navbar } from '../../components/Navbar';
import Link from 'next/link';

/* ── Demo steps ────────────────────────────────────────────────────── */
const STEPS = [
  {
    id: 1,
    agent: 'NexusRouter',
    color: '#00D4FF',
    icon: '⬡',
    title: 'Solicitud recibida',
    subtitle: 'Empresa MX necesita pagar proveedor BR',
    description: 'NexusRouter clasifica la solicitud: Carta de Crédito por $25,000 USDC de México a Brasil via PIX. Verifica SLA y enruta a ComplianceAgent.',
    logs: [
      { t: 0,    c: '#00D4FF', text: '[NexusRouter] Solicitud entrante: LC $25,000 MX→BR PIX' },
      { t: 600,  c: '#ffffff44', text: '[NexusRouter] Clasificando tipo de operación...' },
      { t: 1200, c: '#00FF94', text: '[NexusRouter] ✓ SLA < 60s OK · Enrutando a ComplianceAgent' },
    ],
    nft: null,
  },
  {
    id: 2,
    agent: 'ComplianceAgent',
    color: '#9B30FF',
    icon: '◈',
    title: 'Verificación KYC/AML',
    subtitle: 'Bitso Business API · OFAC/SAT/DIAN check',
    description: 'ComplianceAgent verifica la identidad de comprador y vendedor vía Bitso Business. Cruza contra listas OFAC, SAT y DIAN. Score: 876/1000 → VERIFIED.',
    logs: [
      { t: 0,    c: '#9B30FF', text: '[ComplianceAgent] POST /v3/kyc/verify → buyer 0x1a2b...' },
      { t: 700,  c: '#9B30FF', text: '[ComplianceAgent] Cruzando OFAC/SAT/DIAN listas...' },
      { t: 1400, c: '#9B30FF', text: '[ComplianceAgent] POST /v3/kyc/verify → seller 0xcd34...' },
      { t: 2000, c: '#00FF94', text: '[ComplianceAgent] ✓ Score: 876 · Tier: VERIFIED · Aprobado' },
    ],
    nft: { type: 'ComplianceNFT', id: '#NC-89123', color: '#9B30FF', icon: '◈' },
  },
  {
    id: 3,
    agent: 'NexusRouter',
    color: '#00D4FF',
    icon: '⬡',
    title: 'Ruta óptima calculada',
    subtitle: 'Arbitrum → PIX → BRL',
    description: 'NexusRouter calcula la ruta más eficiente: USDC en Arbitrum → Bitso FX → PIX en Brasil. Quote USDC/BRL confirmado. ETA: < 60 segundos.',
    logs: [
      { t: 0,    c: '#00D4FF', text: '[NexusRouter] GET /v3/fx/quote?from=USDC&to=BRL' },
      { t: 600,  c: '#F7B731', text: '[NexusRouter] Quote: 1 USDC = 5.47 BRL · Fee: 0.3%' },
      { t: 1200, c: '#00FF94', text: '[NexusRouter] ✓ Ruta confirmada: Arbitrum → PIX · ETA < 60s' },
    ],
    nft: null,
  },
  {
    id: 4,
    agent: 'TradeAgent',
    color: '#F7B731',
    icon: '◆',
    title: 'Escrow + LC-NFT creados',
    subtitle: 'TradeEscrow.sol (Rust/Stylus) · Rare Protocol',
    description: 'TradeAgent despliega un escrow en TradeEscrow.sol y acuña la Carta de Crédito como NFT transferible en Arbitrum. Los fondos quedan bloqueados hasta confirmar entrega.',
    logs: [
      { t: 0,    c: '#F7B731', text: '[TradeAgent] TradeEscrow::create_trade(amount=25000_000000)' },
      { t: 900,  c: '#F7B731', text: '[TradeAgent] Escrow 0xa1b2c3... · 25,000 USDC bloqueados' },
      { t: 1600, c: '#F7B731', text: '[TradeAgent] rare mint --name "LC-#8821" --amount_usdc=25000' },
      { t: 2400, c: '#00FF94', text: '[TradeAgent] ✓ LC-NFT #8821 acuñado · Disponible en mercado' },
    ],
    nft: { type: 'LC-NFT', id: '#8821', color: '#F7B731', icon: '◆' },
  },
  {
    id: 5,
    agent: 'YieldAgent',
    color: '#00FF94',
    icon: '⬡',
    title: 'Fondos en Aave V3',
    subtitle: 'NexusVault.sol · APY 4.2%',
    description: 'YieldAgent deposita los 25,000 USDC del escrow en Aave V3 vía NexusVault. Los fondos generan yield mientras dura la operación. Split: 80% al seller, 20% al protocolo.',
    logs: [
      { t: 0,    c: '#00FF94', text: '[YieldAgent] NexusVault::deposit(amount=25000_000000, USDC)' },
      { t: 800,  c: '#00FF94', text: '[YieldAgent] Aave V3 pool confirmado · APY actual: 4.2%' },
      { t: 1500, c: '#00FF94', text: '[YieldAgent] Posición activa · Generando ~$2.88/día' },
      { t: 2000, c: '#00FF94', text: '[YieldAgent] ✓ $25,000 USDC depositados en Aave V3' },
    ],
    nft: null,
  },
  {
    id: 6,
    agent: 'TradeAgent',
    color: '#F7B731',
    icon: '◆',
    title: 'Entrega confirmada · Settlement',
    subtitle: 'Liberación del escrow + yield distribuido',
    description: 'La empresa confirmó la recepción de la mercancía. TradeAgent libera el escrow. YieldAgent distribuye el yield generado. Settlement via PIX en Brasil completado.',
    logs: [
      { t: 0,    c: '#F7B731', text: '[TradeAgent] confirm_delivery(trade=NEXUS-8821) llamado' },
      { t: 700,  c: '#F7B731', text: '[TradeAgent] TradeEscrow::release_funds() ejecutado' },
      { t: 1300, c: '#00FF94', text: '[YieldAgent] yield=+$312 USDC · Split: $250 seller, $62 protocol' },
      { t: 2000, c: '#00D4FF', text: '[NexusRouter] Bitso PIX → BRL transferencia enviada' },
      { t: 2600, c: '#00FF94', text: '[TradeAgent] ✓ SETTLED en 58s · $25,312 USDC liquidados' },
    ],
    nft: { type: 'Settlement-NFT', id: '#SETTLE-2291', color: '#00FF94', icon: '⬡' },
  },
  {
    id: 7,
    agent: 'AuditAgent',
    color: '#FF6B35',
    icon: '◉',
    title: 'Auditoría inmutable',
    subtitle: 'Merkle Tree SHA-256 · IPFS · Arbitrum',
    description: 'AuditAgent agrega la operación al Bundle #42. Al completar 500 transacciones, genera el Merkle root SHA-256 y acuña el Audit-NFT con el hash permanente en Arbitrum.',
    logs: [
      { t: 0,    c: '#FF6B35', text: '[AuditAgent] Operación NEXUS-8821 → Bundle #42 (499/500)' },
      { t: 800,  c: '#FF6B35', text: '[AuditAgent] SHA-256 Merkle root: 0xabc123def456...' },
      { t: 1500, c: '#FF6B35', text: '[AuditAgent] rare mint --name "AUDIT #42" --merkle=0xabc...' },
      { t: 2200, c: '#FF6B35', text: '[AuditAgent] IPFS pin: QmXyz123... · Metadata subida' },
      { t: 2800, c: '#00FF94', text: '[AuditAgent] ✓ Audit-NFT #42 acuñado · Hash permanente' },
    ],
    nft: { type: 'Audit-NFT', id: 'AUDIT #42', color: '#FF6B35', icon: '◉' },
  },
];

const TOTAL_DURATION = 3500; // ms por step en auto-play

/* ── Terminal log ──────────────────────────────────────────────────── */
function TerminalLog({ logs, running }: { logs: { t: number; c: string; text: string }[]; running: boolean }) {
  const [visible, setVisible] = useState<number[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisible([]);
    const timers = logs.map((l, i) =>
      setTimeout(() => setVisible(p => [...p, i]), l.t)
    );
    return () => timers.forEach(clearTimeout);
  }, [logs]);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [visible]);

  return (
    <div className="terminal rounded-lg overflow-hidden h-full">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#00D4FF12]">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF3366]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#F7B731]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#00FF94]" />
        </div>
        <span className="text-white/25 text-xs font-mono ml-2">nexus — agent-trace</span>
        {running && (
          <span className="ml-auto flex items-center gap-1.5 text-xs font-mono text-[#00D4FF]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" />
            RUNNING
          </span>
        )}
      </div>
      <div ref={ref} className="p-4 space-y-1.5 min-h-[160px] max-h-[220px] overflow-y-auto">
        {logs.map((l, i) => (
          <div
            key={i}
            className="text-xs font-mono transition-all duration-300"
            style={{
              opacity: visible.includes(i) ? 1 : 0,
              transform: visible.includes(i) ? 'none' : 'translateX(-8px)',
              color: l.c,
            }}
          >
            {l.text}
          </div>
        ))}
        {running && visible.length < logs.length && (
          <span className="text-[#00D4FF] text-xs font-mono blink">█</span>
        )}
      </div>
    </div>
  );
}

/* ── NFT Badge ─────────────────────────────────────────────────────── */
function NFTBadge({ nft }: { nft: NonNullable<typeof STEPS[0]['nft']> }) {
  return (
    <div
      className="glass clip-corner p-4 text-center float"
      style={{ borderColor: `${nft.color}35`, boxShadow: `0 0 30px ${nft.color}20` }}
    >
      <div
        className="w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center text-2xl"
        style={{ background: `${nft.color}20`, border: `2px solid ${nft.color}50`, color: nft.color }}
      >
        {nft.icon}
      </div>
      <p className="font-orbitron text-xs font-black mb-0.5" style={{ color: nft.color }}>
        {nft.type}
      </p>
      <p className="font-mono text-sm font-bold text-white">{nft.id}</p>
      <p className="text-[#00FF94] text-xs font-mono mt-1">✓ Acuñado</p>
    </div>
  );
}

/* ── Main demo ─────────────────────────────────────────────────────── */
export default function DemoPage() {
  const [current, setCurrent]     = useState(0);
  const [playing, setPlaying]     = useState(false);
  const [logKey, setLogKey]       = useState(0);
  const [mintedNfts, setMintedNfts] = useState<typeof STEPS[0]['nft'][]>([]);
  const [copied, setCopied]       = useState(false);
  const intervalRef               = useRef<ReturnType<typeof setTimeout> | null>(null);

  const step = STEPS[current];

  const goTo = (idx: number) => {
    setCurrent(idx);
    setLogKey(k => k + 1);
    if (STEPS[idx].nft && !mintedNfts.find(n => n?.id === STEPS[idx].nft?.id)) {
      setTimeout(() => {
        setMintedNfts(prev => [...prev, STEPS[idx].nft]);
      }, STEPS[idx].logs[STEPS[idx].logs.length - 1].t + 400);
    }
  };

  const startAutoPlay = () => {
    if (playing) {
      setPlaying(false);
      if (intervalRef.current) clearTimeout(intervalRef.current);
      return;
    }
    setPlaying(true);
    setMintedNfts([]);
    goTo(0);

    let idx = 0;
    const next = () => {
      idx++;
      if (idx >= STEPS.length) {
        setPlaying(false);
        return;
      }
      goTo(idx);
      intervalRef.current = setTimeout(next, TOTAL_DURATION);
    };
    intervalRef.current = setTimeout(next, TOTAL_DURATION);
  };

  useEffect(() => () => { if (intervalRef.current) clearTimeout(intervalRef.current); }, []);

  /* Keyboard navigation */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'l') {
        if (current < STEPS.length - 1) { goTo(current + 1); setPlaying(false); }
      } else if (e.key === 'ArrowLeft' || e.key === 'h') {
        if (current > 0) { goTo(current - 1); setPlaying(false); }
      } else if (e.key === ' ') {
        e.preventDefault();
        startAutoPlay();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, playing]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const progress = ((current + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-[#060D17] text-white grid-bg">
      <Navbar />

      <div className="page-inner px-4 sm:px-6 max-w-7xl mx-auto pb-16">

        {/* Header */}
        <div className="py-8 border-b border-[#00D4FF12]">
          <Link href="/" className="text-white/30 text-xs font-mono hover:text-[#00D4FF] transition-colors">
            ← NEXUS LATAM
          </Link>
          <div className="flex flex-wrap items-end justify-between gap-4 mt-2">
            <div>
              <h1 className="font-orbitron text-2xl sm:text-3xl font-black">
                DEMO <span className="gradient-text-cyan">INTERACTIVO</span>
              </h1>
              <p className="text-white/40 text-xs font-mono mt-1">
                Flujo completo de una Carta de Crédito MX → BR · $25,000 USDC · &lt;60s
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={startAutoPlay}
                className={playing ? 'btn-neon text-xs py-2 px-5' : 'btn-solid-cyan text-xs py-2 px-5'}
              >
                {playing ? '⏸ PAUSAR' : '▶ AUTO-PLAY'}
              </button>
              <button
                onClick={() => { setMintedNfts([]); goTo(0); setPlaying(false); }}
                className="text-white/30 hover:text-white/60 text-xs font-mono transition-colors border border-white/10 hover:border-white/20 px-3 py-2 rounded"
              >
                ↺ RESET
              </button>
              <button
                onClick={copyLink}
                className="flex items-center gap-1.5 text-white/30 hover:text-[#00D4FF] text-xs font-mono transition-colors border border-white/10 hover:border-[#00D4FF30] px-3 py-2 rounded"
              >
                {copied ? '✓ COPIADO' : '⎘ COMPARTIR'}
              </button>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/30 text-xs font-mono">
              Paso {current + 1} de {STEPS.length}
            </span>
            <span className="text-xs font-mono" style={{ color: step.color }}>
              {step.agent}
            </span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, #00D4FF, ${step.color})`,
              }}
            />
          </div>
        </div>

        {/* Step selector */}
        <div className="flex gap-1.5 overflow-x-auto scroll-x pb-3 mb-6">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => { goTo(i); setPlaying(false); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono whitespace-nowrap shrink-0 transition-all"
              style={{
                background:  current === i ? `${s.color}20` : i < current ? `${s.color}08` : 'transparent',
                color:       current === i ? s.color : i < current ? `${s.color}80` : 'rgba(255,255,255,0.25)',
                border:      `1px solid ${current === i ? `${s.color}50` : i < current ? `${s.color}25` : 'rgba(255,255,255,0.06)'}`,
              }}
            >
              <span
                className="w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: i < current ? `${s.color}30` : 'transparent' }}
              >
                {i < current ? '✓' : s.id}
              </span>
              <span className="hidden sm:inline">{s.agent}</span>
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Left: step detail */}
          <div className="lg:col-span-2 space-y-4">

            {/* Step card */}
            <div
              className="glass clip-corner p-6 transition-all duration-500"
              style={{ borderColor: `${step.color}30`, boxShadow: `0 0 50px ${step.color}10` }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
                  style={{ background: `${step.color}18`, border: `2px solid ${step.color}45`, color: step.color }}
                >
                  {step.icon}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h2 className="font-orbitron text-lg font-black text-white">{step.title}</h2>
                    <span className="text-xs font-orbitron font-bold" style={{ color: step.color }}>
                      [{step.agent}]
                    </span>
                  </div>
                  <p className="text-xs font-mono mb-2" style={{ color: `${step.color}99` }}>
                    {step.subtitle}
                  </p>
                  <p className="text-white/60 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            </div>

            {/* Terminal */}
            <TerminalLog
              key={`${current}-${logKey}`}
              logs={step.logs}
              running={playing}
            />

            {/* Navigation */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => { if (current > 0) { goTo(current - 1); setPlaying(false); } }}
                disabled={current === 0}
                className="text-white/40 hover:text-white disabled:opacity-20 text-sm font-mono transition-colors"
              >
                ← Anterior
              </button>
              <span className="text-white/15 text-xs font-mono hidden sm:block">
                ← → teclado · espacio = play
              </span>
              <button
                onClick={() => { if (current < STEPS.length - 1) { goTo(current + 1); setPlaying(false); } }}
                disabled={current === STEPS.length - 1}
                className="text-white/40 hover:text-[#00D4FF] disabled:opacity-20 text-sm font-mono transition-colors"
              >
                Siguiente →
              </button>
            </div>
          </div>

          {/* Right: stats + NFTs */}
          <div className="space-y-4">

            {/* Operation info */}
            <div className="glass clip-corner p-4 border-[#00D4FF15]">
              <p className="font-orbitron text-xs text-white/30 uppercase tracking-widest mb-3">
                Operación Demo
              </p>
              <div className="space-y-2 text-xs font-mono">
                {[
                  { k: 'ID',        v: 'NEXUS-8821',   c: '#00D4FF' },
                  { k: 'Monto',     v: '$25,000 USDC', c: '#F7B731' },
                  { k: 'Ruta',      v: 'MX → BR',      c: '#9B30FF' },
                  { k: 'Rail',      v: 'PIX',           c: '#00FF94' },
                  { k: 'Fee',       v: '0.3% (30bps)',  c: '#FF6B35' },
                  { k: 'Yield APY', v: '4.2%',          c: '#00FF94' },
                ].map(({ k, v, c }) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-white/30">{k}</span>
                    <span className="font-bold" style={{ color: c }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* NFTs minted */}
            <div>
              <p className="font-orbitron text-xs text-white/30 uppercase tracking-widest mb-3">
                NFTs Acuñados
                <span className="ml-2 text-[#00D4FF] text-xs">{mintedNfts.length}/3</span>
              </p>
              {mintedNfts.length === 0 ? (
                <div className="glass clip-corner p-4 text-center text-white/20 text-xs font-mono border-[#ffffff08]">
                  Los NFTs aparecerán aquí al acuñarse
                </div>
              ) : (
                <div className="space-y-3">
                  {mintedNfts.map((n, i) => n && (
                    <NFTBadge key={i} nft={n} />
                  ))}
                </div>
              )}
            </div>

            {/* Tiempo total */}
            {current === STEPS.length - 1 && (
              <div
                className="glass clip-corner p-4 text-center"
                style={{ borderColor: '#00FF9430', boxShadow: '0 0 30px rgba(0,255,148,0.1)' }}
              >
                <p className="text-[#00FF94] font-orbitron text-2xl font-black mb-1">58s</p>
                <p className="text-white/40 text-xs font-mono">Tiempo total E2E</p>
                <p className="text-[#F7B731] font-orbitron text-lg font-black mt-3">+$312</p>
                <p className="text-white/40 text-xs font-mono">Yield generado (Aave V3)</p>
                <p className="text-[#00FF94] text-xs font-mono mt-3">✓ OPERACIÓN COMPLETADA</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom CTAs */}
        <div className="mt-10 glass clip-corner-lg border-[#00D4FF12] p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-orbitron text-sm font-black text-white mb-1">
                ¿Listo para crear una operación real?
              </p>
              <p className="text-white/40 text-xs font-mono">
                Conecta tu wallet en Arbitrum Sepolia y lanza el protocolo
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/trades">
                <button className="btn-solid-cyan text-xs py-2.5 px-6">
                  ABRIR COMMAND CENTER
                </button>
              </Link>
              <Link href="/agents">
                <button className="btn-neon text-xs py-2.5 px-6">
                  VER AGENTES IA
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
