'use client';

import { useState }          from 'react';
import { AuditTrailTable }   from '../../components/AuditTrailTable';
import { Navbar }            from '../../components/Navbar';
import Link                  from 'next/link';

const BUNDLES = [
  { id: 42, txs: 500,  volume: '$1,250,000', merkle: '0xabc123...', ts: '2026-05-26 14:32', status: 'FINALIZED' },
  { id: 41, txs: 500,  volume: '$980,500',   merkle: '0xdef456...', ts: '2026-05-25 09:11', status: 'FINALIZED' },
  { id: 40, txs: 500,  volume: '$1,100,000', merkle: '0x789abc...', ts: '2026-05-24 18:45', status: 'FINALIZED' },
  { id: 39, txs: 500,  volume: '$870,200',   merkle: '0xfed321...', ts: '2026-05-23 11:02', status: 'FINALIZED' },
  { id: 38, txs: 312,  volume: '$620,000',   merkle: '0x654cba...', ts: '2026-05-22 22:18', status: 'OPEN' },
];

export default function AuditPage() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#060D17] text-white grid-bg">
      <Navbar />

      <div className="page-inner px-4 sm:px-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="py-8 border-b border-[#FF6B3520]">
          <Link href="/" className="text-white/30 text-xs font-mono hover:text-[#FF6B35] transition-colors">
            ← NEXUS LATAM
          </Link>
          <div className="flex flex-wrap items-end justify-between gap-3 mt-1">
            <div>
              <h1 className="font-orbitron text-2xl font-black">
                AUDIT <span className="text-[#FF6B35]">TRAIL</span>
              </h1>
              <p className="text-white/40 text-xs font-mono mt-1">
                Registro inmutable · Merkle Tree · Audit-NFT · Arbitrum Sepolia
              </p>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-mono text-[#FF6B35]">
              <span className="w-2 h-2 rounded-full bg-[#FF6B35] pulse-amber" />
              AuditAgent online
            </span>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-6">
          {[
            { label: 'Audit Bundles',  value: '42',      color: '#FF6B35', icon: '◉' },
            { label: 'Transacciones',  value: '21,000+', color: '#F7B731', icon: '⚡' },
            { label: 'Volumen total',  value: '$24.5M',  color: '#00D4FF', icon: '📊' },
            { label: 'Txs/Bundle',     value: '500',     color: '#00FF94', icon: '⬡' },
          ].map((k) => (
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
                <p className="font-orbitron text-lg font-black" style={{ color: k.color }}>{k.value}</p>
                <p className="text-white/35 text-xs font-mono">{k.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="glass clip-corner-lg border-[#FF6B3522] p-5 mb-6">
          <p className="font-orbitron text-xs text-[#FF6B35] uppercase tracking-widest mb-3">
            ¿Cómo funciona el Audit Trail?
          </p>
          <div className="flex flex-wrap items-center gap-2 text-sm font-mono text-white/60">
            {[
              '500 transacciones',
              '→',
              'Merkle root SHA-256',
              '→',
              'Audit-NFT acuñado',
              '→',
              'IPFS metadata',
              '→',
              'Arbitrum permanente',
            ].map((s, i) => (
              <span
                key={i}
                className={s === '→' ? 'text-[#FF6B3550]' : 'font-semibold text-white/70'}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
          {/* Bundle list */}
          <div className="lg:col-span-2 space-y-3">
            <p className="text-white/30 text-xs font-mono uppercase tracking-widest mb-2">
              Bundles Recientes
            </p>
            {BUNDLES.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelected(selected === b.id ? null : b.id)}
                className="w-full text-left"
              >
                <div
                  className="glass clip-corner p-4 card-hover transition-all"
                  style={{
                    borderColor: selected === b.id ? '#FF6B3550' : '#FF6B3515',
                    boxShadow:   selected === b.id ? '0 0 30px rgba(255,107,53,0.15)' : 'none',
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-orbitron text-base font-black text-[#FF6B35]">
                        BUNDLE #{b.id}
                      </span>
                      <span
                        className="clip-corner-sm text-xs font-mono px-2 py-0.5"
                        style={{
                          color:      b.status === 'FINALIZED' ? '#00FF94' : '#F7B731',
                          background: b.status === 'FINALIZED' ? '#00FF9415' : '#F7B73115',
                          border:     `1px solid ${b.status === 'FINALIZED' ? '#00FF9430' : '#F7B73130'}`,
                        }}
                      >
                        {b.status}
                      </span>
                    </div>
                    <span className="text-white/30 text-xs font-mono">{b.ts}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="font-orbitron text-sm font-bold text-white">{b.txs}</p>
                      <p className="text-white/30 text-xs font-mono">txs</p>
                    </div>
                    <div>
                      <p className="font-orbitron text-sm font-bold text-[#F7B731]">{b.volume}</p>
                      <p className="text-white/30 text-xs font-mono">volumen</p>
                    </div>
                    <div>
                      <p className="font-mono text-sm text-[#9B30FF] truncate">{b.merkle}</p>
                      <p className="text-white/30 text-xs font-mono">merkle root</p>
                    </div>
                  </div>

                  {selected === b.id && (
                    <div className="mt-4 pt-3 border-t border-[#FF6B3520] grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-white/30">Auditor</span>
                        <span className="text-[#FF6B35]">NEXUS_AUDIT_AGENT_V1</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/30">NFT ID</span>
                        <span className="text-[#9B30FF]">AUDIT #{b.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/30">Chain</span>
                        <span className="text-[#00D4FF]">Arbitrum Sepolia</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/30">Hash algo</span>
                        <span className="text-[#00FF94]">SHA-256</span>
                      </div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Sidebar: recent events */}
          <div>
            <p className="text-white/30 text-xs font-mono uppercase tracking-widest mb-3">
              Eventos Recientes
            </p>
            <AuditTrailTable />
          </div>
        </div>
      </div>
    </div>
  );
}
