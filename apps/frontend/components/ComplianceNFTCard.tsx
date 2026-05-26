'use client';

interface ComplianceData {
  approved?:  boolean;
  nftId?:     string;
  score?:     number;
  tier?:      string;
  reasoning?: string;
  [key: string]: unknown;
}

const TIER_COLORS: Record<string, string> = {
  BASIC:    '#F7B731',
  VERIFIED: '#00D4FF',
  PREMIUM:  '#00FF88',
};

export function ComplianceNFTCard({ data }: { data: ComplianceData }) {
  if (!data.approved) {
    return (
      <div className="bg-[#1A2840] rounded-xl p-6 border border-red-500/30 max-w-lg">
        <div className="text-red-400 font-bold text-lg mb-2">✗ Empresa No Aprobada</div>
        <p className="text-gray-400 text-sm">{data.reasoning ?? 'No cumple con los requisitos KYC/AML de NEXUS LATAM.'}</p>
      </div>
    );
  }

  const tier      = data.tier ?? 'BASIC';
  const color     = TIER_COLORS[tier] ?? '#fff';
  const scoreBar  = ((data.score ?? 0) / 1000) * 100;

  return (
    <div className="bg-[#1A2840] rounded-xl p-6 border border-[#00D4FF22] max-w-lg">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-gray-400 text-xs uppercase tracking-wider">Compliance NFT</p>
          <p className="text-[#00D4FF] font-bold text-lg">{data.nftId ?? 'N/A'}</p>
        </div>
        <span
          className="px-3 py-1 rounded-full text-xs font-bold border"
          style={{ color, borderColor: color }}
        >
          {tier}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">KYC Score</span>
          <span style={{ color }} className="font-bold">{data.score ?? 0}/1000</span>
        </div>
        <div className="h-2 bg-[#0D1B2A] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${scoreBar}%`, backgroundColor: color }}
          />
        </div>
      </div>

      {data.reasoning && (
        <p className="text-gray-400 text-xs border-t border-[#00D4FF22] pt-3 mt-3">
          {data.reasoning}
        </p>
      )}

      <div className="mt-3 text-xs text-gray-600">
        Emitido por NEXUS LATAM Protocol · Arbitrum Stylus
      </div>
    </div>
  );
}
