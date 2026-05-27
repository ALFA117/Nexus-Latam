'use client';

import Link from 'next/link';

interface Trade {
  id:             string;
  state:          string;
  amount?:        string;
  country?:       string;
  rail?:          string;
  time?:          string;
  nft?:           string;
  complianceNFT?: string;
  lcNFT?:         string;
  yieldAPY?:      string;
  totalCost?:     string;
  [key: string]:  unknown;
}

const STATE_COLOR: Record<string, string> = {
  PENDING:   '#F7B731',
  FUNDED:    '#00D4FF',
  DELIVERED: '#00E5FF',
  SETTLED:   '#00FF94',
  DISPUTED:  '#FF3366',
};

const STATE_ICON: Record<string, string> = {
  PENDING:   '○',
  FUNDED:    '◉',
  DELIVERED: '◈',
  SETTLED:   '✓',
  DISPUTED:  '⚠',
};

export function TradeCard({ trade }: { trade: Trade; stateColors?: Record<string, string> }) {
  const color = STATE_COLOR[trade.state] ?? '#ffffff';
  const icon  = STATE_ICON[trade.state]  ?? '○';

  return (
    <Link href={`/trades/${trade.id}`}>
      <div
        className="glass clip-corner card-hover cursor-pointer group relative overflow-hidden"
        style={{ borderColor: `${color}22` }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${color}60, transparent)` }}
        />

        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="font-orbitron text-sm font-black text-white group-hover:text-[#00D4FF] transition-colors">
                {trade.id}
              </p>
              {trade.country && (
                <p className="text-white/30 text-xs font-mono mt-0.5">
                  {trade.country} · {trade.rail}
                </p>
              )}
            </div>
            <div
              className="flex items-center gap-1.5 clip-corner-sm px-2 py-1"
              style={{ background: `${color}15`, border: `1px solid ${color}35` }}
            >
              <span style={{ color }} className="text-xs">{icon}</span>
              <span className="font-orbitron text-xs font-bold" style={{ color }}>
                {trade.state}
              </span>
            </div>
          </div>

          {/* Amount */}
          {trade.amount && (
            <p className="font-orbitron text-xl font-black text-white mb-3">
              {trade.amount}
              <span className="text-white/30 text-xs font-mono ml-1">USDC</span>
            </p>
          )}

          {/* Metrics */}
          <div className="space-y-1.5 text-xs">
            {trade.nft && (
              <div className="flex justify-between">
                <span className="text-white/30 font-mono">LC-NFT</span>
                <span className="font-mono text-[#9B30FF] font-semibold">{trade.nft}</span>
              </div>
            )}
            {trade.lcNFT && (
              <div className="flex justify-between">
                <span className="text-white/30 font-mono">LC-NFT</span>
                <span className="font-mono text-[#9B30FF] font-semibold">{trade.lcNFT}</span>
              </div>
            )}
            {trade.yieldAPY && (
              <div className="flex justify-between">
                <span className="text-white/30 font-mono">Yield APY</span>
                <span className="font-mono text-[#00FF94] font-semibold">{trade.yieldAPY}</span>
              </div>
            )}
            {trade.time && trade.time !== '--' && (
              <div className="flex justify-between">
                <span className="text-white/30 font-mono">Settlement</span>
                <span className="font-mono font-bold" style={{ color: '#00FF94' }}>{trade.time}</span>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#ffffff06]">
            <span className="text-white/20 text-xs font-mono">Ver detalle</span>
            <span
              className="text-xs font-mono font-bold group-hover:translate-x-1 transition-transform"
              style={{ color }}
            >
              →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
