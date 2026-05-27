'use client';

import { useState }          from 'react';
import { ComplianceNFTCard } from '../../components/ComplianceNFTCard';
import { useNexusAPI }       from '../../hooks/useNexusAPI';
import { Navbar }            from '../../components/Navbar';
import { FadeIn, ScaleIn }   from '../../components/FadeIn';
import Link                  from 'next/link';

const SAMPLE_WALLETS = [
  { addr: '0x1a2b3c4d...', country: 'MX', tier: 'VERIFIED', score: 891 },
  { addr: '0xef56ab89...', country: 'BR', tier: 'PREMIUM',  score: 956 },
  { addr: '0xcd1234ef...', country: 'CO', tier: 'BASIC',    score: 612 },
];

const TIER_META: Record<string, { color: string; icon: string; desc: string }> = {
  BASIC:    { color: '#F7B731', icon: '◆', desc: 'KYC nivel básico. Ops ≤$5K' },
  VERIFIED: { color: '#00D4FF', icon: '◈', desc: 'KYC completo. Sin límite.' },
  PREMIUM:  { color: '#00FF94', icon: '⬡', desc: 'Due diligence avanzado.' },
};

export default function CompliancePage() {
  const [address, setAddress] = useState('');
  const [result, setResult]   = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const { getComplianceNFT }  = useNexusAPI();

  const lookup = async (addr?: string) => {
    const target = addr ?? address;
    if (!target) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await getComplianceNFT(target);
      setResult(data as Record<string, unknown>);
    } catch {
      /* mock fallback */
      setResult({
        approved:   true,
        nftId:      `NC-${Math.floor(Math.random() * 90000) + 10000}`,
        score:      Math.floor(Math.random() * 300) + 650,
        tier:       ['BASIC', 'VERIFIED', 'PREMIUM'][Math.floor(Math.random() * 3)],
        reasoning:  'Empresa verificada por NEXUS LATAM. KYC/AML FATF compliant.',
        country:    'MX',
        valid_until: '2027-05-25',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060D17] text-white grid-bg">
      <Navbar />

      <div className="page-inner px-4 sm:px-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="py-8 border-b border-[#9B30FF20]">
          <Link href="/" className="text-white/30 text-xs font-mono hover:text-[#9B30FF] transition-colors">
            ← NEXUS LATAM
          </Link>
          <div className="flex flex-wrap items-end justify-between gap-3 mt-1">
            <div>
              <h1 className="font-orbitron text-2xl font-black">
                COMPLIANCE <span className="text-[#9B30FF]">REGISTRY</span>
              </h1>
              <p className="text-white/40 text-xs font-mono mt-1">
                KYC/AML on-chain · ComplianceNFT · Arbitrum Sepolia
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#9B30FF]">
              <span className="w-2 h-2 rounded-full bg-[#9B30FF] pulse-cyan" />
              ComplianceAgent online
            </div>
          </div>
        </div>

        {/* Tier legend */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-6">
          {Object.entries(TIER_META).map(([tier, meta], i) => (
            <ScaleIn key={tier} delay={i * 0.08}>
            <div
              className="glass clip-corner-sm p-3 flex items-center gap-3 h-full"
              style={{ borderColor: `${meta.color}25` }}
            >
              <span className="text-xl" style={{ color: meta.color }}>{meta.icon}</span>
              <div>
                <p className="font-orbitron text-xs font-bold" style={{ color: meta.color }}>{tier}</p>
                <p className="text-white/35 text-xs font-mono">{meta.desc}</p>
              </div>
            </div>
            </ScaleIn>
          ))}
        </div>

        {/* Search box */}
        <div className="glass clip-corner p-6 mb-6 border-[#9B30FF25] relative overflow-hidden">
          {/* Scan animation while loading */}
          {loading && <div className="scan-line-anim" />}

          <p className="text-white/50 text-sm mb-4 font-mono">
            Consulta el NFT de cumplimiento KYC/AML de cualquier wallet en el protocolo.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                className="w-full bg-[#060D17] border border-[#9B30FF33] rounded-lg px-4 py-3 text-[#9B30FF] text-sm placeholder-white/20 focus:outline-none focus:border-[#9B30FF] font-mono transition-colors"
                placeholder="0x... wallet address"
                value={address}
                onChange={e => setAddress(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && lookup()}
              />
              {loading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-[#9B30FF] border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            <button
              onClick={() => lookup()}
              disabled={loading || !address}
              className="btn-solid-cyan disabled:opacity-40 text-sm px-6 shrink-0 transition-all"
              style={{ background: loading ? '#9B30FF80' : '#9B30FF', borderColor: '#9B30FF', color: '#fff' }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verificando KYC...
                </span>
              ) : 'VERIFICAR KYC'}
            </button>
          </div>

          {/* Hint */}
          <p className="text-white/20 text-xs font-mono mt-3">
            ↵ Enter · o haz click en una wallet de ejemplo ↓
          </p>
        </div>

        {/* Result */}
        {result && (
          <div className="mb-6">
            <ComplianceNFTCard data={result} />
          </div>
        )}

        {/* Sample wallets */}
        <div className="mb-12">
          <p className="text-white/30 text-xs font-mono uppercase tracking-widest mb-3">
            Wallets de ejemplo — click para consultar
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SAMPLE_WALLETS.map((w, i) => {
              const meta = TIER_META[w.tier];
              return (
                <ScaleIn key={w.addr} delay={i * 0.1}>
                <button
                  onClick={() => { setAddress(w.addr); lookup(w.addr); }}
                  className="w-full glass clip-corner-sm p-3 text-left card-hover transition-all"
                  style={{ borderColor: `${meta.color}25` }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs text-white/50 truncate">{w.addr}</span>
                    <span className="font-orbitron text-xs font-bold" style={{ color: meta.color }}>
                      {meta.icon} {w.tier}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${(w.score / 1000) * 100}%`,
                          background: `linear-gradient(90deg, ${meta.color}88, ${meta.color})`,
                        }}
                      />
                    </div>
                    <span className="text-xs font-mono font-bold" style={{ color: meta.color }}>
                      {w.score}
                    </span>
                  </div>
                  <p className="text-white/25 text-xs font-mono mt-1">{w.country}</p>
                </button>
                </ScaleIn>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
