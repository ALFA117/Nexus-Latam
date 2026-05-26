'use client';

import { useEffect, useState } from 'react';
import { useNexusAPI }          from '../hooks/useNexusAPI';

interface AuditEntry {
  batchId:      string;
  txCount:      number;
  volumeUSDC:   number;
  merkleRoot:   string;
  nftId:        string;
  timestamp:    string;
}

const MOCK_ENTRIES: AuditEntry[] = [
  { batchId: '#12', txCount: 500, volumeUSDC: 1_250_000, merkleRoot: '0xabc1...', nftId: '#1012', timestamp: '2026-05-26 10:00' },
  { batchId: '#11', txCount: 500, volumeUSDC: 980_000,   merkleRoot: '0xdef2...', nftId: '#1011', timestamp: '2026-05-25 18:30' },
  { batchId: '#10', txCount: 500, volumeUSDC: 1_100_000, merkleRoot: '0xghi3...', nftId: '#1010', timestamp: '2026-05-25 09:15' },
];

export function AuditTrailTable({ tradeId }: { tradeId?: string }) {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const { getAuditTrail }     = useNexusAPI();

  useEffect(() => {
    if (tradeId) {
      getAuditTrail(tradeId)
        .then(() => setEntries(MOCK_ENTRIES.slice(0, 1)))
        .catch(() => setEntries(MOCK_ENTRIES.slice(0, 1)));
    } else {
      setEntries(MOCK_ENTRIES);
    }
  }, [tradeId]);

  return (
    <div className="bg-[#1A2840] rounded-xl border border-[#00D4FF22] overflow-hidden">
      <div className="px-5 py-3 border-b border-[#00D4FF22]">
        <h3 className="text-[#F7B731] text-sm font-bold uppercase tracking-wider">
          Audit NFTs On-Chain
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-[#00D4FF11]">
              {['Bundle', 'Txs', 'Volumen', 'Merkle Root', 'NFT', 'Timestamp'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-gray-500 uppercase tracking-wider font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.batchId} className="border-b border-[#00D4FF0A] hover:bg-[#0D1B2A] transition-colors">
                <td className="px-4 py-3 text-[#F7B731] font-bold">{entry.batchId}</td>
                <td className="px-4 py-3 text-white">{entry.txCount}</td>
                <td className="px-4 py-3 text-green-400">${entry.volumeUSDC.toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-500">{entry.merkleRoot}</td>
                <td className="px-4 py-3 text-[#00D4FF]">{entry.nftId}</td>
                <td className="px-4 py-3 text-gray-400">{entry.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {entries.length === 0 && (
        <div className="text-center text-gray-600 py-8 text-sm">Sin registros de auditoría aún</div>
      )}
    </div>
  );
}
