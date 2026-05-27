'use client';

import { useState, useEffect, useCallback } from 'react';
import { Navbar }  from '../../components/Navbar';
import Link        from 'next/link';

/* ── Mock positions ──────────────────────────────────────────────── */
const POSITIONS = [
  { tradeId: 'NEXUS-8821', amount: 25000, apy: 4.2,  earned: 312,  state: 'SETTLED',  days: 12, protocol: 'Aave V3' },
  { tradeId: 'NEXUS-8820', amount: 12500, apy: 4.1,  earned: 89,   state: 'FUNDED',   days: 7,  protocol: 'Aave V3' },
  { tradeId: 'NEXUS-8818', amount: 50000, apy: 4.3,  earned: 1180, state: 'SETTLED',  days: 31, protocol: 'Aave V3' },
  { tradeId: 'NEXUS-8816', amount: 18750, apy: 4.0,  earned: 208,  state: 'DELIVERED',days: 10, protocol: 'Aave V3' },
];

const HISTORY = [
  { date: '2026-05-26', event: 'Yield distribuido',   trade: 'NEXUS-8821', amount: '+$312',  color: '#00FF94' },
  { date: '2026-05-25', event: 'Depósito Aave V3',    trade: 'NEXUS-8820', amount: '$12,500', color: '#00D4FF' },
  { date: '2026-05-24', event: 'Yield distribuido',   trade: 'NEXUS-8818', amount: '+$1,180', color: '#00FF94' },
  { date: '2026-05-23', event: 'Rebalanceo posición', trade: 'NEXUS-8820', amount: 'APY 4.1%',color: '#F7B731' },
  { date: '2026-05-22', event: 'Yield distribuido',   trade: 'NEXUS-8816', amount: '+$208',   color: '#00FF94' },
];

function AnimatedValue({ value, prefix = '' }: { value: number; prefix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const step = value / 50;
    let cur = 0;
    const t = setInterval(() => {
      cur = Math.min(cur + step, value);
      setDisplay(Math.round(cur));
      if (cur >= value) clearInterval(t);
    }, 20);
    return () => clearInterval(t);
  }, [value]);
  return <>{prefix}{display.toLocaleString()}</>;
}

const totalTVL       = POSITIONS.reduce((s, p) => s + p.amount, 0);
const totalEarned    = POSITIONS.reduce((s, p) => s + p.earned, 0);
const avgAPY         = POSITIONS.reduce((s, p) => s + p.apy, 0) / POSITIONS.length;
const activePositions = POSITIONS.filter(p => p.state !== 'SETTLED').length;

function YieldSimulator() {
  const DURATIONS = [
    { label: '7d',  days: 7 },
    { label: '30d', days: 30 },
    { label: '90d', days: 90 },
    { label: '1y',  days: 365 },
  ];
  const [amount, setAmount]   = useState('10000');
  const [durIdx, setDurIdx]   = useState(1);
  const apy                   = 4.2;
  const principal             = parseFloat(amount.replace(/,/g, '')) || 0;
  const days                  = DURATIONS[durIdx].days;
  const yieldAmt              = principal * (apy / 100) * (days / 365);
  const sellerYield           = yieldAmt * 0.8;
  const protocolYield         = yieldAmt * 0.2;
  const effectiveRate         = principal > 0 ? (yieldAmt / principal) * 100 : 0;

  return (
    <div className="glass clip-corner border-[#00FF9420] p-5">
      <p className="font-orbitron text-xs text-[#00FF94] uppercase tracking-widest mb-4">
        Simulador de Rendimiento
      </p>

      {/* Amount */}
      <label className="text-white/40 text-xs font-mono block mb-1.5">
        Principal (USDC)
      </label>
      <input
        type="number"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        placeholder="10000"
        className="w-full bg-[#060D17] border border-[#00FF9422] focus:border-[#00FF9466] rounded-lg px-3 py-2.5 text-[#00FF94] text-sm placeholder-white/15 focus:outline-none font-mono transition-colors mb-4"
      />

      {/* Duration tabs */}
      <label className="text-white/40 text-xs font-mono block mb-2">Duración</label>
      <div className="flex gap-2 mb-5">
        {DURATIONS.map((d, i) => (
          <button
            key={d.label}
            onClick={() => setDurIdx(i)}
            className="flex-1 py-1.5 text-xs font-orbitron font-bold rounded transition-all"
            style={{
              background: durIdx === i ? '#00FF9420' : 'transparent',
              color:      durIdx === i ? '#00FF94' : 'rgba(255,255,255,0.3)',
              border:     `1px solid ${durIdx === i ? '#00FF9440' : 'rgba(255,255,255,0.08)'}`,
            }}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Result */}
      <div
        className="clip-corner-sm p-4 space-y-2"
        style={{ background: 'rgba(0,255,148,0.05)', border: '1px solid rgba(0,255,148,0.2)' }}
      >
        <div className="flex justify-between text-xs font-mono">
          <span className="text-white/40">APY</span>
          <span className="text-[#00D4FF] font-bold">{apy}%</span>
        </div>
        <div className="flex justify-between text-xs font-mono">
          <span className="text-white/40">Yield total</span>
          <span className="text-[#00FF94] font-bold">+${yieldAmt.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xs font-mono">
          <span className="text-white/40">Tu parte (80%)</span>
          <span className="text-[#00FF94] font-bold">+${sellerYield.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xs font-mono">
          <span className="text-white/40">Protocolo (20%)</span>
          <span className="text-[#9B30FF]">${protocolYield.toFixed(2)}</span>
        </div>
        <div className="pt-2 border-t border-[#00FF9420]">
          <div className="flex justify-between">
            <span className="text-white/40 text-xs font-mono">Return efectivo</span>
            <span className="font-orbitron text-sm font-black text-[#00FF94]">
              {effectiveRate.toFixed(3)}%
            </span>
          </div>
        </div>
      </div>

      <p className="text-white/20 text-xs font-mono mt-3 text-center">
        Tasas indicativas · Aave V3 · Arbitrum
      </p>
    </div>
  );
}

export default function YieldPage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#060D17] text-white grid-bg">
      <Navbar />

      <div className="page-inner px-4 sm:px-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="py-8 border-b border-[#00FF9420]">
          <Link href="/" className="text-white/30 text-xs font-mono hover:text-[#00FF94] transition-colors">
            ← NEXUS LATAM
          </Link>
          <div className="flex flex-wrap items-end justify-between gap-3 mt-1">
            <div>
              <h1 className="font-orbitron text-2xl font-black">
                YIELD <span className="text-[#00FF94]">VAULT</span>
              </h1>
              <p className="text-white/40 text-xs font-mono mt-1">
                Aave V3 · Arbitrum · NexusVault.sol
              </p>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-mono text-[#00FF94]">
              <span className="status-dot status-online" />
              YieldAgent online
            </span>
          </div>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-6">
          {[
            { label: 'TVL en Escrow',    icon: '⬡', value: totalTVL,    prefix: '$', suffix: ' USDC', color: '#00FF94' },
            { label: 'Yield Total',      icon: '📈', value: totalEarned, prefix: '$', suffix: ' USDC', color: '#F7B731' },
            { label: 'APY Promedio',     icon: '⚡', value: null,  display: `${avgAPY.toFixed(1)}%`,   color: '#00D4FF' },
            { label: 'Posiciones activas',icon: '◉', value: null, display: `${activePositions}`,        color: '#9B30FF' },
          ].map((k) => (
            <div key={k.label} className="glass clip-corner p-4" style={{ borderColor: `${k.color}22` }}>
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-base"
                  style={{ background: `${k.color}15`, border: `1px solid ${k.color}30` }}
                >
                  {k.icon}
                </div>
                <p className="text-white/35 text-xs font-mono">{k.label}</p>
              </div>
              <p className="font-orbitron text-2xl font-black" style={{ color: k.color }}>
                {k.value !== null ? <AnimatedValue value={k.value} prefix={k.prefix} /> : k.display}
                {k.suffix && <span className="text-xs text-white/30 font-mono ml-1">{k.suffix}</span>}
              </p>
            </div>
          ))}
        </div>

        {/* How yield works */}
        <div className="glass clip-corner-lg border-[#00FF9420] p-5 mb-6">
          <p className="font-orbitron text-xs text-[#00FF94] uppercase tracking-widest mb-3">
            Flujo del Yield
          </p>
          <div className="flex flex-wrap items-center gap-2 text-sm font-mono">
            {[
              { t: 'Fondos en escrow',   c: '#00D4FF' },
              { t: '→', c: '#ffffff20' },
              { t: 'NexusVault.deposit()', c: '#F7B731' },
              { t: '→', c: '#ffffff20' },
              { t: 'Aave V3 pool',       c: '#00FF94' },
              { t: '→', c: '#ffffff20' },
              { t: '4.2% APY',           c: '#00FF94' },
              { t: '→', c: '#ffffff20' },
              { t: 'Settlement: 80% seller + 20% protocolo', c: '#9B30FF' },
            ].map((s, i) => (
              <span key={i} className="font-semibold" style={{ color: s.c }}>{s.t}</span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
          {/* Positions */}
          <div className="lg:col-span-2 space-y-3">
            <p className="text-white/30 text-xs font-mono uppercase tracking-widest mb-1">
              Posiciones en Aave V3
            </p>
            {POSITIONS.map(p => {
              const isActive  = p.state !== 'SETTLED';
              const earnedPct = ((p.earned / p.amount) * 100).toFixed(2);
              const isOpen    = selected === p.tradeId;

              return (
                <button
                  key={p.tradeId}
                  onClick={() => setSelected(isOpen ? null : p.tradeId)}
                  className="w-full text-left"
                >
                  <div
                    className="glass clip-corner p-4 card-hover transition-all"
                    style={{
                      borderColor:  isOpen ? '#00FF9440' : '#00FF9415',
                      boxShadow:    isOpen ? '0 0 30px rgba(0,255,148,0.08)' : 'none',
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-orbitron text-sm font-black text-[#00FF94]">{p.tradeId}</span>
                        <span
                          className="clip-corner-sm text-xs font-mono px-2 py-0.5"
                          style={{
                            color:      isActive ? '#00D4FF' : '#00FF94',
                            background: isActive ? '#00D4FF15' : '#00FF9415',
                            border:     `1px solid ${isActive ? '#00D4FF30' : '#00FF9430'}`,
                          }}
                        >
                          {p.state}
                        </span>
                      </div>
                      <span className="text-white/30 text-xs font-mono">{p.days}d</span>
                    </div>

                    <div className="grid grid-cols-4 gap-3 mb-3">
                      <div>
                        <p className="text-white/30 text-xs font-mono">Principal</p>
                        <p className="font-orbitron text-sm font-bold text-white">${p.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-white/30 text-xs font-mono">APY</p>
                        <p className="font-orbitron text-sm font-bold text-[#00D4FF]">{p.apy}%</p>
                      </div>
                      <div>
                        <p className="text-white/30 text-xs font-mono">Yield</p>
                        <p className="font-orbitron text-sm font-bold text-[#00FF94]">+${p.earned}</p>
                      </div>
                      <div>
                        <p className="text-white/30 text-xs font-mono">Return</p>
                        <p className="font-orbitron text-sm font-bold text-[#F7B731]">{earnedPct}%</p>
                      </div>
                    </div>

                    {/* Yield bar */}
                    <div className="h-1.5 bg-[#ffffff06] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${Math.min((p.earned / p.amount) * 100 * 30, 80)}%`,
                          background: 'linear-gradient(90deg, #00FF9444, #00FF94)',
                        }}
                      />
                    </div>

                    {isOpen && (
                      <div className="mt-3 pt-3 border-t border-[#00FF9415] grid grid-cols-2 gap-2 text-xs font-mono">
                        <div className="flex justify-between">
                          <span className="text-white/30">Protocolo</span>
                          <span className="text-[#00FF94]">{p.protocol}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/30">Split seller</span>
                          <span className="text-[#00FF94]">80%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/30">Split protocolo</span>
                          <span className="text-[#9B30FF]">20%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/30">Contrato</span>
                          <span className="text-[#00D4FF]">NexusVault.rs</span>
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Simulator + history */}
          <div className="space-y-4">
            <YieldSimulator />

            <p className="text-white/30 text-xs font-mono uppercase tracking-widest">
              Historial de Yield
            </p>
            <div className="glass clip-corner border-[#00FF9415] overflow-hidden">
              <div className="divide-y divide-[#ffffff05]">
                {HISTORY.map((h, i) => (
                  <div key={i} className="px-4 py-3">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-mono text-xs font-bold" style={{ color: h.color }}>
                        {h.amount}
                      </span>
                      <span className="text-white/25 text-xs font-mono">{h.date}</span>
                    </div>
                    <p className="text-white/50 text-xs">{h.event}</p>
                    <p className="text-white/25 text-xs font-mono mt-0.5">{h.trade}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
