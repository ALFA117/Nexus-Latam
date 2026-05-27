'use client';

import { useState, useEffect } from 'react';
import { useNexusAPI }                       from '../../hooks/useNexusAPI';
import { TradeCard }                         from '../../components/TradeCard';
import { Navbar }                            from '../../components/Navbar';
import { TradeCreator }                      from '../../components/TradeCreator';
import { AgentStatusPanel }                  from '../../components/AgentStatusPanel';
import { TradeCardSkeleton, KPICardSkeleton } from '../../components/Skeleton';
import Link                                  from 'next/link';

const STATE_LABELS: Record<string, string> = {
  ALL:       'Todas',
  PENDING:   'Pendiente',
  FUNDED:    'Fondeado',
  DELIVERED: 'Entregado',
  SETTLED:   'Liquidado',
  DISPUTED:  'Disputa',
};

const STATE_COLORS: Record<string, string> = {
  PENDING:   '#F7B731',
  FUNDED:    '#00D4FF',
  DELIVERED: '#00E5FF',
  SETTLED:   '#00FF94',
  DISPUTED:  '#FF3366',
};

const MOCK_TRADES = [
  { id: 'NEXUS-8821', state: 'SETTLED',   amount: '$25,000', buyer: '0x1a2b...', seller: '0xcd34...', country: 'MX', rail: 'SPEI', time: '58s',  nft: '#8821' },
  { id: 'NEXUS-8820', state: 'FUNDED',    amount: '$12,500', buyer: '0xef56...', seller: '0x78ab...', country: 'BR', rail: 'PIX',  time: '--',    nft: '#8820' },
  { id: 'NEXUS-8819', state: 'PENDING',   amount: '$8,000',  buyer: '0xcd12...', seller: '0x34ef...', country: 'CO', rail: 'PSE',  time: '--',    nft: '#8819' },
  { id: 'NEXUS-8818', state: 'SETTLED',   amount: '$50,000', buyer: '0xab89...', seller: '0xcd67...', country: 'AR', rail: 'CVU',  time: '52s',   nft: '#8818' },
  { id: 'NEXUS-8817', state: 'DISPUTED',  amount: '$3,200',  buyer: '0x90ef...', seller: '0x12ab...', country: 'PE', rail: 'CCI',  time: '--',    nft: '#8817' },
  { id: 'NEXUS-8816', state: 'DELIVERED', amount: '$18,750', buyer: '0xbc23...', seller: '0x45de...', country: 'CL', rail: 'TEF',  time: '--',    nft: '#8816' },
];

const KPI = [
  { label: 'Volumen 24h',    value: '$1.24M', sub: 'USDC',       color: '#00D4FF', icon: '📊' },
  { label: 'Ops. hoy',       value: '48',     sub: 'operaciones', color: '#F7B731', icon: '⚡' },
  { label: 'Yield generado', value: '$4,320', sub: 'USDC',       color: '#00FF94', icon: '📈' },
  { label: 'NFTs acuñados',  value: '144',    sub: 'en cadena',  color: '#9B30FF', icon: '◈' },
];

export default function TradesPage() {
  const { loading, error, getTrades } = useNexusAPI();
  const [trades, setTrades]           = useState<unknown[]>([]);
  const [filter, setFilter]           = useState<string>('ALL');
  const [search, setSearch]           = useState('');
  const [tab, setTab]                 = useState<'list' | 'new'>('list');

  useEffect(() => {
    getTrades().then(setTrades).catch(() => setTrades(MOCK_TRADES));
  }, []);

  const displayTrades = (trades.length > 0 ? trades : MOCK_TRADES) as typeof MOCK_TRADES;
  const filtered = displayTrades.filter(t => {
    const matchState   = filter === 'ALL' || t.state === filter;
    const q            = search.toLowerCase();
    const matchSearch  = !q || t.id.toLowerCase().includes(q) || t.buyer.toLowerCase().includes(q) || t.seller.toLowerCase().includes(q) || t.country.toLowerCase().includes(q);
    return matchState && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#060D17] text-white grid-bg">
      <Navbar />

      <div className="page-inner px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 py-8 border-b border-[#00D4FF12]">
          <div>
            <Link href="/" className="text-white/30 text-xs font-mono hover:text-[#00D4FF] transition-colors">
              ← NEXUS LATAM
            </Link>
            <h1 className="font-orbitron text-2xl font-black text-white mt-1">
              COMMAND <span className="text-[#00D4FF]">CENTER</span>
            </h1>
            <p className="text-white/40 text-xs font-mono mt-1">
              Operaciones comerciales B2B en tiempo real
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs font-mono text-[#00FF94]">
              <span className="status-dot status-online" />
              5 agentes online
            </span>
            <button
              onClick={() => setTab('new')}
              className="btn-solid-cyan text-xs py-2 px-5"
            >
              + NUEVA OP
            </button>
          </div>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <KPICardSkeleton key={i} />)
            : KPI.map((k) => (
            <div
              key={k.label}
              className="glass clip-corner p-4 flex items-center gap-3"
              style={{ borderColor: `${k.color}22` }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
                style={{ background: `${k.color}15`, border: `1px solid ${k.color}30` }}
              >
                {k.icon}
              </div>
              <div>
                <p className="font-orbitron text-lg font-black" style={{ color: k.color }}>
                  {k.value}
                </p>
                <p className="text-white/35 text-xs font-mono">{k.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tab nav */}

        <div className="flex gap-1 mb-6 border-b border-[#00D4FF12]">
          {(['list', 'new'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 text-xs font-orbitron uppercase tracking-widest transition-all border-b-2 -mb-px ${
                tab === t
                  ? 'text-[#00D4FF] border-[#00D4FF]'
                  : 'text-white/30 border-transparent hover:text-white/60'
              }`}
            >
              {t === 'list' ? 'OPERACIONES' : 'NUEVA OP'}
            </button>
          ))}
        </div>

        {/* Tab: List */}
        {tab === 'list' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pb-12">
            {/* Main trades list — 3 cols */}
            <div className="lg:col-span-3">
              {/* Search + count */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 text-xs font-mono">⌕</span>
                  <input
                    type="text"
                    placeholder="Buscar por ID, wallet, país..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full bg-[#060D17] border border-[#00D4FF18] focus:border-[#00D4FF44] rounded-lg pl-8 pr-4 py-2.5 text-white/70 text-xs placeholder-white/20 focus:outline-none font-mono transition-colors"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 text-xs"
                    >×</button>
                  )}
                </div>
                <span className="self-center text-white/25 text-xs font-mono shrink-0">
                  {filtered.length} / {displayTrades.length} ops
                </span>
              </div>

              {/* Filter chips */}
              <div className="flex flex-wrap gap-2 mb-5">
                {Object.keys(STATE_LABELS).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className="clip-corner-sm px-3 py-1 text-xs font-mono uppercase tracking-wider transition-all"
                    style={{
                      background: filter === f ? (STATE_COLORS[f] ?? '#00D4FF') + '25' : 'transparent',
                      color:      filter === f ? (STATE_COLORS[f] ?? '#00D4FF') : 'rgba(255,255,255,0.35)',
                      border:     `1px solid ${filter === f ? (STATE_COLORS[f] ?? '#00D4FF') + '60' : 'rgba(255,255,255,0.08)'}`,
                    }}
                  >
                    {STATE_LABELS[f]}
                  </button>
                ))}
              </div>

              {loading && (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => <TradeCardSkeleton key={i} />)}
                </div>
              )}

              {error && (
                <div className="glass border-[#FF336640] p-4 rounded mb-4 text-[#FF3366] text-sm font-mono">
                  ⚠ {error}
                </div>
              )}

              {/* Trade table */}
              {filtered.length > 0 ? (
                <div className="space-y-2">
                  {/* Header row — oculto en mobile */}
                  <div className="hidden sm:grid grid-cols-6 gap-2 px-4 text-white/25 text-xs font-mono uppercase tracking-widest pb-1">
                    <span>ID</span>
                    <span>Estado</span>
                    <span>Monto</span>
                    <span>País / Rail</span>
                    <span>LC-NFT</span>
                    <span>Tiempo</span>
                  </div>
                  {filtered.map((trade) => {
                    const color = STATE_COLORS[trade.state] ?? '#fff';
                    return (
                      <Link key={trade.id} href={`/trades/${trade.id}`}>
                        {/* Desktop: grid 6 cols */}
                        <div
                          className="hidden sm:grid grid-cols-6 gap-2 glass clip-corner px-4 py-3 card-hover cursor-pointer"
                          style={{ borderColor: `${color}20` }}
                        >
                          <span className="font-mono text-xs text-white/70 truncate">{trade.id}</span>
                          <span
                            className="text-xs font-orbitron font-bold clip-corner-sm px-2 py-0.5 self-center text-center"
                            style={{ color, background: `${color}15`, border: `1px solid ${color}35` }}
                          >
                            {trade.state}
                          </span>
                          <span className="font-orbitron text-sm font-bold text-white">{trade.amount}</span>
                          <span className="text-xs font-mono text-white/50">{trade.country} · {trade.rail}</span>
                          <span className="text-xs font-mono text-[#9B30FF]">{trade.nft}</span>
                          <span className="text-xs font-mono font-bold"
                            style={{ color: trade.time !== '--' ? '#00FF94' : 'rgba(255,255,255,0.25)' }}>
                            {trade.time}
                          </span>
                        </div>
                        {/* Mobile: card layout */}
                        <div
                          className="sm:hidden glass clip-corner px-4 py-3 card-hover cursor-pointer"
                          style={{ borderColor: `${color}20` }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-mono text-xs text-white/70">{trade.id}</span>
                            <span
                              className="text-xs font-orbitron font-bold clip-corner-sm px-2 py-0.5"
                              style={{ color, background: `${color}15`, border: `1px solid ${color}35` }}
                            >
                              {trade.state}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-orbitron text-base font-bold text-white">{trade.amount}</span>
                            <div className="flex items-center gap-2 text-xs font-mono">
                              <span className="text-white/40">{trade.country} · {trade.rail}</span>
                              <span className="text-[#9B30FF]">{trade.nft}</span>
                              <span style={{ color: trade.time !== '--' ? '#00FF94' : 'rgba(255,255,255,0.25)' }}>
                                {trade.time}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-20 text-white/25">
                  <p className="font-orbitron text-xl mb-3">SIN OPERACIONES</p>
                  <button
                    onClick={() => setTab('new')}
                    className="btn-neon text-xs"
                  >
                    CREAR PRIMERA
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar — agent panel */}
            <div className="space-y-4">
              <AgentStatusPanel />
            </div>
          </div>
        )}

        {/* Tab: New trade */}
        {tab === 'new' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
            <div className="lg:col-span-2">
              <TradeCreator />
            </div>
            <div>
              <AgentStatusPanel />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
