'use client';

import { useState } from 'react';

const NFTS = [
  {
    type: 'ComplianceNFT',
    collection: 'NEXUS-COMPLIANCE-MX',
    id: 'NC-RFC123456',
    color: '#9B30FF',
    gradientFrom: '#9B30FF',
    gradientTo: '#4F46E5',
    agent: 'Compliance Agent',
    icon: '◈',
    description: 'Certificado KYC/AML inmutable en Arbitrum. Incluye score de riesgo, tier y vigencia.',
    attributes: [
      { key: 'score',       value: '876' },
      { key: 'tier',        value: 'VERIFIED' },
      { key: 'country',     value: 'MX' },
      { key: 'valid_until', value: '2027-05-25' },
    ],
    rarity: 'COMMON',
  },
  {
    type: 'LC-NFT',
    collection: 'NEXUS-LETTERS-OF-CREDIT',
    id: 'LC-#8821',
    color: '#F7B731',
    gradientFrom: '#F7B731',
    gradientTo: '#FF6B35',
    agent: 'Trade Agent',
    icon: '◆',
    description: 'Carta de Crédito programable. Transferible en mercado secundario vía subasta.',
    attributes: [
      { key: 'amount_usdc', value: '25,000' },
      { key: 'status',      value: 'ACTIVE' },
      { key: 'trade_id',    value: '8821' },
      { key: 'expires',     value: '2026-06-01' },
    ],
    rarity: 'RARE',
  },
  {
    type: 'Audit-NFT',
    collection: 'NEXUS-AUDIT-TRAIL',
    id: 'AUDIT #42',
    color: '#FF6B35',
    gradientFrom: '#FF6B35',
    gradientTo: '#FF3366',
    agent: 'Audit Agent',
    icon: '◉',
    description: 'Bundle de auditoría con Merkle root. 500 transacciones, hash inmutable.',
    attributes: [
      { key: 'batch',       value: '42' },
      { key: 'tx_count',    value: '500' },
      { key: 'volume',      value: '$1.25M' },
      { key: 'merkle',      value: '0xabc...' },
    ],
    rarity: 'EPIC',
  },
  {
    type: 'Settlement-NFT',
    collection: 'NEXUS-SETTLEMENTS',
    id: 'SETTLE-2291',
    color: '#00FF94',
    gradientFrom: '#00FF94',
    gradientTo: '#00D4FF',
    agent: 'Trade Agent',
    icon: '⬡',
    description: 'Prueba de liquidación completa. Incluye yield generado y timestamp de confirmación.',
    attributes: [
      { key: 'amount',      value: '$25,312' },
      { key: 'yield',       value: '+$312 USDC' },
      { key: 'rail',        value: 'SPEI → USDC' },
      { key: 'time',        value: '58s' },
    ],
    rarity: 'LEGENDARY',
  },
];

const RARITY_COLOR: Record<string, string> = {
  COMMON:    '#9B30FF',
  RARE:      '#00D4FF',
  EPIC:      '#F7B731',
  LEGENDARY: '#FF6B35',
};

export function NFTShowcase() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section id="nfts" className="py-24 px-6 relative overflow-hidden">
      {/* Bg glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(155,48,255,0.05) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 text-xs font-mono text-[#F7B731] uppercase tracking-widest">
            <span className="w-8 h-px bg-[#F7B731]" />
            RARE PROTOCOL × ARBITRUM
            <span className="w-8 h-px bg-[#F7B731]" />
          </div>
          <h2 className="font-orbitron text-4xl md:text-5xl font-black mb-4">
            <span className="gradient-text-amber">NFT </span>
            <span className="text-white">ECOSYSTEM</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-sm leading-relaxed">
            Cada evento del protocolo se tokeniza como NFT en Arbitrum via Rare Protocol CLI.
            Compliance, Cartas de Crédito, Auditoría y Liquidaciones — todo en cadena.
          </p>
        </div>

        {/* NFT Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {NFTS.map((nft) => (
            <div
              key={nft.id}
              className="nft-card-3d"
              onMouseEnter={() => setHovered(nft.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="nft-card-inner">
                <div
                  className="clip-corner glass relative overflow-hidden"
                  style={{ border: `1px solid ${nft.color}40` }}
                >
                  {/* Holographic overlay */}
                  <div
                    className="nft-holographic absolute inset-0 pointer-events-none z-10"
                    style={{ opacity: hovered === nft.id ? 0.6 : 0.2, transition: 'opacity 0.3s' }}
                  />

                  {/* Card image area */}
                  <div
                    className="relative h-44 flex items-center justify-center overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${nft.gradientFrom}22, ${nft.gradientTo}33)`,
                    }}
                  >
                    {/* Bg rings */}
                    <div
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                      <div
                        className="w-32 h-32 rounded-full opacity-20 spin-slow"
                        style={{ border: `1px dashed ${nft.color}` }}
                      />
                      <div
                        className="absolute w-20 h-20 rounded-full opacity-30"
                        style={{
                          border: `2px solid ${nft.color}`,
                          animation: 'spin-slow 12s linear infinite reverse',
                        }}
                      />
                    </div>

                    {/* Icon */}
                    <div
                      className="relative z-10 w-20 h-20 rounded-2xl flex items-center justify-center text-4xl font-black float"
                      style={{
                        background: `${nft.color}20`,
                        border: `2px solid ${nft.color}60`,
                        boxShadow: `0 0 30px ${nft.color}40`,
                        color: nft.color,
                      }}
                    >
                      {nft.icon}
                    </div>

                    {/* Rarity badge */}
                    <div
                      className="absolute top-3 right-3 text-xs font-orbitron font-bold px-2 py-0.5 rounded"
                      style={{
                        color: RARITY_COLOR[nft.rarity],
                        background: `${RARITY_COLOR[nft.rarity]}15`,
                        border: `1px solid ${RARITY_COLOR[nft.rarity]}40`,
                      }}
                    >
                      {nft.rarity}
                    </div>
                  </div>

                  {/* Card content */}
                  <div className="p-4 relative z-20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-orbitron text-xs font-bold" style={{ color: nft.color }}>
                        {nft.type}
                      </span>
                      <span className="text-white/30 text-xs font-mono">{nft.id}</span>
                    </div>
                    <p className="text-white/35 text-xs font-mono uppercase tracking-wider mb-3">
                      {nft.collection}
                    </p>
                    <p className="text-white/55 text-xs leading-relaxed mb-3">
                      {nft.description}
                    </p>

                    {/* Attributes */}
                    <div className="space-y-1.5">
                      {nft.attributes.map((attr) => (
                        <div key={attr.key} className="flex justify-between items-center">
                          <span className="text-white/30 text-xs font-mono">{attr.key}</span>
                          <span
                            className="text-xs font-mono font-semibold clip-corner-sm px-2 py-0.5"
                            style={{
                              color: nft.color,
                              background: `${nft.color}10`,
                              border: `1px solid ${nft.color}25`,
                            }}
                          >
                            {attr.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Agent minter */}
                    <div
                      className="mt-4 pt-3 flex items-center gap-1.5"
                      style={{ borderTop: `1px solid ${nft.color}20` }}
                    >
                      <span className="text-white/25 text-xs font-mono">Minted by</span>
                      <span className="text-xs font-mono font-bold" style={{ color: nft.color }}>
                        {nft.agent}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom stats */}
        <div className="mt-12 glass border-[#F7B73122] p-6 clip-corner-lg">
          <div className="flex flex-wrap items-center justify-around gap-6 text-center">
            {[
              { v: '4',       l: 'Tipos de NFT',      c: '#9B30FF' },
              { v: '144+',    l: 'NFTs acuñados',      c: '#F7B731' },
              { v: 'Rare CLI', l: 'Powered by',        c: '#00D4FF' },
              { v: 'Arbitrum', l: 'Blockchain',        c: '#00FF94' },
              { v: 'IPFS',    l: 'Metadata storage',   c: '#FF6B35' },
            ].map((s) => (
              <div key={s.l}>
                <p className="font-orbitron text-2xl font-black" style={{ color: s.c }}>{s.v}</p>
                <p className="text-white/30 text-xs font-mono uppercase tracking-wider mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
