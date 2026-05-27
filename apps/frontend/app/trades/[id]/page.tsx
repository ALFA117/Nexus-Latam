'use client';

import { useEffect, useState } from 'react';
import { useNexusAPI }         from '../../../hooks/useNexusAPI';
import { Navbar }              from '../../../components/Navbar';
import Link                    from 'next/link';

interface TradeDetail {
  id:             string;
  state:          string;
  sellerAddress:  string;
  buyerAddress:   string;
  amountUSDC:     string;
  complianceNFT:  string;
  lcNFT:          string;
  settlementNFT:  string;
  escrowAddress:  string;
  escrowTxHash:   string;
  yieldAPY:       string;
  yieldEarned:    string;
  totalCost:      string;
  country:        string;
  rail:           string;
  settlementTime: string;
  createdAt:      string;
}

const MOCK: TradeDetail = {
  id:             'NEXUS-8821',
  state:          'SETTLED',
  sellerAddress:  '0xcd3456789abc1234ef',
  buyerAddress:   '0x1a2b3c4d5e6f7890ab',
  amountUSDC:     '25,000',
  complianceNFT:  '#NC-89123',
  lcNFT:          '#8821',
  settlementNFT:  '#SETTLE-2291',
  escrowAddress:  '0xabc123def456789...',
  escrowTxHash:   '0x5f8e2d1c9b4a7f3e...',
  yieldAPY:       '4.2%',
  yieldEarned:    '+$312 USDC',
  totalCost:      '$75 USDC (0.3%)',
  country:        'MX',
  rail:           'SPEI',
  settlementTime: '58s',
  createdAt:      '2026-05-26 14:32 UTC',
};

const STATE_COLOR: Record<string, string> = {
  PENDING:   '#F7B731',
  FUNDED:    '#00D4FF',
  DELIVERED: '#00E5FF',
  SETTLED:   '#00FF94',
  DISPUTED:  '#FF3366',
};

const TIMELINE = [
  { step: 'Solicitud recibida',      agent: 'NexusRouter',     color: '#00D4FF', done: true,  ts: '14:32:01' },
  { step: 'KYC/AML verificado',      agent: 'ComplianceAgent', color: '#9B30FF', done: true,  ts: '14:32:14' },
  { step: 'ComplianceNFT acuñado',   agent: 'ComplianceAgent', color: '#9B30FF', done: true,  ts: '14:32:21' },
  { step: 'Escrow fondado on-chain', agent: 'TradeAgent',      color: '#F7B731', done: true,  ts: '14:32:35' },
  { step: 'LC-NFT emitido',          agent: 'TradeAgent',      color: '#F7B731', done: true,  ts: '14:32:48' },
  { step: 'Fondos en Aave V3',       agent: 'YieldAgent',      color: '#00FF94', done: true,  ts: '14:32:55' },
  { step: 'Entrega confirmada',       agent: 'TradeAgent',      color: '#F7B731', done: true,  ts: '14:33:08' },
  { step: 'Yield distribuido',        agent: 'YieldAgent',      color: '#00FF94', done: true,  ts: '14:33:24' },
  { step: 'Settlement SPEI',         agent: 'NexusRouter',     color: '#00D4FF', done: true,  ts: '14:33:29' },
  { step: 'Audit Bundle #42',        agent: 'AuditAgent',      color: '#FF6B35', done: true,  ts: '14:34:01' },
];

const NFTS = [
  { type: 'ComplianceNFT', id: MOCK.complianceNFT, color: '#9B30FF', icon: '◈', collection: 'NEXUS-COMPLIANCE-MX' },
  { type: 'LC-NFT',        id: MOCK.lcNFT,         color: '#F7B731', icon: '◆', collection: 'NEXUS-LETTERS-OF-CREDIT' },
  { type: 'Settlement-NFT',id: MOCK.settlementNFT, color: '#00FF94', icon: '⬡', collection: 'NEXUS-SETTLEMENTS' },
];

export default function TradeDetailPage({ params }: { params: { id: string } }) {
  const { getTradeStatus } = useNexusAPI();
  const [trade, setTrade]  = useState<TradeDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTradeStatus(params.id)
      .then(d => setTrade(d as TradeDetail))
      .catch(() => setTrade({ ...MOCK, id: params.id }))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060D17] grid-bg">
        <Navbar />
        <div className="page-inner flex items-center justify-center">
          <div className="flex items-center gap-3 text-[#00D4FF]">
            <div className="w-5 h-5 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin" />
            <span className="font-orbitron text-sm">Cargando operación...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!trade) {
    return (
      <div className="min-h-screen bg-[#060D17] grid-bg">
        <Navbar />
        <div className="page-inner flex items-center justify-center">
        <div className="text-center">
          <p className="font-orbitron text-xl text-[#FF3366] mb-4">OPERACIÓN NO ENCONTRADA</p>
          <Link href="/trades" className="btn-neon text-xs">← VOLVER</Link>
        </div>
        </div>
      </div>
    );
  }

  const stateColor = STATE_COLOR[trade.state] ?? '#fff';

  return (
    <div className="min-h-screen bg-[#060D17] text-white grid-bg">
      <Navbar />

      <div className="page-inner px-4 sm:px-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="py-8 border-b border-[#00D4FF12]">
          <Link href="/trades" className="text-white/30 text-xs font-mono hover:text-[#00D4FF] transition-colors">
            ← COMMAND CENTER
          </Link>
          <div className="flex flex-wrap items-center gap-4 mt-2">
            <h1 className="font-orbitron text-2xl font-black text-white">{trade.id}</h1>
            <span
              className="clip-corner-sm text-xs font-orbitron font-black px-3 py-1.5"
              style={{ color: stateColor, background: `${stateColor}18`, border: `1px solid ${stateColor}45` }}
            >
              {trade.state}
            </span>
            <span className="text-white/30 text-xs font-mono ml-auto">{trade.createdAt}</span>
          </div>
          {/* Confirmar Entrega — solo visible cuando está FUNDED */}
          {trade.state === 'FUNDED' && (
            <div className="mt-4 p-4 glass border border-[#F7B73130] rounded-lg flex flex-wrap items-center gap-4">
              <div>
                <p className="text-[#F7B731] font-orbitron text-xs uppercase tracking-widest">Acción requerida</p>
                <p className="text-white/60 text-sm mt-0.5">El escrow está fondado. Confirma la entrega de los bienes para liberar los fondos al vendedor.</p>
              </div>
              <button
                className="shrink-0 clip-corner text-xs font-orbitron font-black px-5 py-2.5 transition-all duration-200 hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #F7B731, #FF6B35)', color: '#060D17' }}
                onClick={() => alert('Función on-chain disponible con contrato desplegado en Sepolia')}
              >
                ✓ CONFIRMAR ENTREGA
              </button>
            </div>
          )}
          {/* Quick stats */}
          <div className="flex flex-wrap gap-6 mt-4">
            {[
              { l: 'Monto',      v: `$${trade.amountUSDC} USDC`, c: '#00D4FF' },
              { l: 'País / Rail',v: `${trade.country} · ${trade.rail}`, c: '#F7B731' },
              { l: 'Settlement', v: trade.settlementTime,        c: '#00FF94' },
              { l: 'Yield',      v: trade.yieldEarned,           c: '#00FF94' },
              { l: 'Costo',      v: trade.totalCost,             c: '#9B30FF' },
            ].map(s => (
              <div key={s.l}>
                <p className="text-white/30 text-xs font-mono uppercase">{s.l}</p>
                <p className="font-orbitron text-sm font-bold" style={{ color: s.c }}>{s.v}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-6 pb-12">

          {/* Left: NFTs + On-chain ─────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* NFT Cards */}
            <div>
              <p className="text-white/30 text-xs font-mono uppercase tracking-widest mb-3">
                NFTs Acuñados en Esta Operación
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {NFTS.map((n) => (
                  <div
                    key={n.type}
                    className="glass clip-corner p-4 text-center card-hover"
                    style={{ borderColor: `${n.color}25` }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center text-xl float"
                      style={{ background: `${n.color}18`, border: `1px solid ${n.color}40`, color: n.color }}
                    >
                      {n.icon}
                    </div>
                    <p className="font-orbitron text-xs font-black mb-0.5" style={{ color: n.color }}>
                      {n.type}
                    </p>
                    <p className="font-mono text-sm font-bold text-white">{n.id}</p>
                    <p className="text-white/25 text-xs font-mono mt-1 truncate">{n.collection}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* On-chain data */}
            <div>
              <p className="text-white/30 text-xs font-mono uppercase tracking-widest mb-3">
                Datos On-Chain
              </p>
              <div className="glass clip-corner border-[#00D4FF15] p-5 space-y-3">
                {[
                  { l: 'Escrow Address', v: trade.escrowAddress,  c: '#00D4FF' },
                  { l: 'Tx Hash',        v: trade.escrowTxHash,   c: '#00D4FF' },
                  { l: 'Buyer',          v: trade.buyerAddress,   c: '#9B30FF' },
                  { l: 'Seller',         v: trade.sellerAddress,  c: '#F7B731' },
                  { l: 'Yield APY',      v: trade.yieldAPY,       c: '#00FF94' },
                  { l: 'Network',        v: 'Arbitrum Sepolia',   c: '#00D4FF' },
                ].map(r => (
                  <div key={r.l} className="flex items-center justify-between gap-4 border-b border-[#ffffff05] pb-2 last:border-0 last:pb-0">
                    <span className="text-white/30 text-xs font-mono shrink-0">{r.l}</span>
                    <span className="text-xs font-mono font-semibold truncate" style={{ color: r.c }}>{r.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Timeline ──────────────────────────────────── */}
          <div>
            <p className="text-white/30 text-xs font-mono uppercase tracking-widest mb-3">
              Timeline del Protocolo
            </p>
            <div className="space-y-0">
              {TIMELINE.map((t, i) => (
                <div key={i} className="flex gap-3 relative">
                  {/* Line connector */}
                  {i < TIMELINE.length - 1 && (
                    <div
                      className="absolute left-3.5 top-7 bottom-0 w-px"
                      style={{ background: `${t.color}25` }}
                    />
                  )}

                  {/* Dot */}
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 relative z-10 mt-1.5"
                    style={{
                      background: t.done ? `${t.color}20` : '#111D2E',
                      border: `1px solid ${t.done ? t.color : '#ffffff15'}`,
                      boxShadow: t.done ? `0 0 8px ${t.color}40` : 'none',
                    }}
                  >
                    {t.done
                      ? <span style={{ color: t.color }}>✓</span>
                      : <span className="text-white/20">○</span>
                    }
                  </div>

                  {/* Content */}
                  <div className="pb-4 pt-1.5 flex-1">
                    <p className="text-white/75 text-xs font-medium">{t.step}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-mono" style={{ color: t.color }}>{t.agent}</span>
                      <span className="text-white/20 text-xs font-mono">{t.ts}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total time */}
            <div className="glass clip-corner-sm border-[#00FF9425] p-3 mt-2 text-center">
              <p className="text-[#00FF94] font-orbitron text-xl font-black">
                {trade.settlementTime}
              </p>
              <p className="text-white/30 text-xs font-mono">tiempo total E2E</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
