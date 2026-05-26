'use client';

import { useEffect, useState } from 'react';
import { useNexusAPI }          from '../hooks/useNexusAPI';

interface AuditEntry {
  batchId:    string;
  txCount:    number;
  volumeUSDC: number;
  merkleRoot: string;
  nftId:      string;
  timestamp:  string;
}

const MOCK: AuditEntry[] = [
  { batchId: '#42', txCount: 500, volumeUSDC: 1_250_000, merkleRoot: '0xabc1...', nftId: '#1042', timestamp: '14:32' },
  { batchId: '#41', txCount: 500, volumeUSDC: 980_000,   merkleRoot: '0xdef2...', nftId: '#1041', timestamp: '09:11' },
  { batchId: '#40', txCount: 500, volumeUSDC: 1_100_000, merkleRoot: '0x789a...', nftId: '#1040', timestamp: '18:45' },
];

export function AuditTrailTable({ tradeId }: { tradeId?: string }) {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const { getAuditTrail }     = useNexusAPI();

  useEffect(() => {
    const data = tradeId ? MOCK.slice(0, 1) : MOCK;
    getAuditTrail(tradeId ?? '')
      .then(() => setEntries(data))
      .catch(() => setEntries(data));
  }, [tradeId]);

  return (
    <div className="glass clip-corner border-[#FF6B3518] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#FF6B3515]">
        <span className="font-orbitron text-xs text-[#FF6B35] uppercase tracking-widest">
          Audit NFTs
        </span>
        <span className="flex items-center gap-1.5 text-xs font-mono text-[#FF6B35]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-pulse" />
          on-chain
        </span>
      </div>

      {/* Entries */}
      <div className="divide-y divide-[#ffffff05]">
        {entries.map((e) => (
          <div key={e.batchId} className="px-4 py-3 hover:bg-[#ffffff03] transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-orbitron text-sm font-bold text-[#FF6B35]">
                BUNDLE {e.batchId}
              </span>
              <span className="text-white/30 text-xs font-mono">{e.timestamp}</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <div>
                <span className="text-white/25 text-xs font-mono">txs </span>
                <span className="text-white/70 text-xs font-mono font-semibold">{e.txCount}</span>
              </div>
              <div>
                <span className="text-white/25 text-xs font-mono">vol </span>
                <span className="text-[#F7B731] text-xs font-mono font-semibold">
                  ${(e.volumeUSDC / 1_000_000).toFixed(2)}M
                </span>
              </div>
              <div>
                <span className="text-white/25 text-xs font-mono">nft </span>
                <span className="text-[#9B30FF] text-xs font-mono">{e.nftId}</span>
              </div>
              <div className="overflow-hidden">
                <span className="text-white/25 text-xs font-mono">∑ </span>
                <span className="text-white/40 text-xs font-mono truncate">{e.merkleRoot}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {entries.length === 0 && (
        <div className="text-center text-white/20 py-8 text-xs font-mono">
          Sin bundles aún
        </div>
      )}
    </div>
  );
}
