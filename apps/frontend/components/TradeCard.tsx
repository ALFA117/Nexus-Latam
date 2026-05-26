'use client';

import Link from 'next/link';

interface Trade {
  id:            string;
  state:         string;
  complianceNFT?: string;
  lcNFT?:        string;
  escrowAddress?: string;
  yieldAPY?:     string;
  totalCost?:    string;
  [key: string]: unknown;
}

interface TradeCardProps {
  trade:       Trade;
  stateColors: Record<string, string>;
}

export function TradeCard({ trade, stateColors }: TradeCardProps) {
  const color = stateColors[trade.state] ?? '#ffffff';

  return (
    <Link href={`/trades/${trade.id}`}>
      <div className="bg-[#1A2840] rounded-xl p-5 border border-[#00D4FF22] hover:border-[#00D4FF55] transition-colors cursor-pointer group">
        <div className="flex justify-between items-start mb-3">
          <span className="text-[#00D4FF] font-bold text-sm group-hover:underline">{trade.id}</span>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full border"
            style={{ color, borderColor: color }}
          >
            {trade.state}
          </span>
        </div>

        <div className="space-y-1.5 text-xs">
          {trade.lcNFT && (
            <div className="flex justify-between">
              <span className="text-gray-500">LC NFT</span>
              <span className="text-[#F7B731]">{trade.lcNFT}</span>
            </div>
          )}
          {trade.yieldAPY && (
            <div className="flex justify-between">
              <span className="text-gray-500">Yield APY</span>
              <span className="text-green-400">{trade.yieldAPY}</span>
            </div>
          )}
          {trade.totalCost && (
            <div className="flex justify-between">
              <span className="text-gray-500">Costo</span>
              <span className="text-white">{trade.totalCost}</span>
            </div>
          )}
        </div>

        <div className="mt-3 text-xs text-gray-600 group-hover:text-[#00D4FF] transition-colors">
          Ver detalle →
        </div>
      </div>
    </Link>
  );
}
