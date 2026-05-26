'use client';

import { useEffect, useState } from 'react';
import { useNexusAPI }         from '../../../hooks/useNexusAPI';
import { AuditTrailTable }     from '../../../components/AuditTrailTable';
import Link                    from 'next/link';

interface TradeDetail {
  id:             string;
  state:          string;
  complianceNFT:  string;
  lcNFT:          string;
  escrowAddress:  string;
  escrowTxHash:   string;
  yieldAPY:       string;
  totalCost:      string;
}

export default function TradeDetailPage({ params }: { params: { id: string } }) {
  const { getTradeStatus } = useNexusAPI();
  const [trade, setTrade]  = useState<TradeDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTradeStatus(params.id)
      .then(data => setTrade(data as TradeDetail))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params.id]);

  const STATE_COLORS: Record<string, string> = {
    PENDING: '#F7B731', FUNDED: '#00D4FF', SETTLED: '#00FF88', DISPUTED: '#FF4444',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center">
        <div className="text-[#00D4FF] animate-pulse text-xl">Cargando operación...</div>
      </div>
    );
  }

  if (!trade) {
    return (
      <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center text-red-400">
        Operación no encontrada
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1B2A] text-white font-mono p-6">
      <Link href="/trades" className="text-gray-500 text-sm hover:text-[#00D4FF]">
        ← Todas las operaciones
      </Link>

      <div className="mt-4 flex items-center gap-4">
        <h2 className="text-2xl font-bold text-[#00D4FF]">{trade.id}</h2>
        <span
          className="px-3 py-1 rounded-full text-xs font-bold"
          style={{ color: STATE_COLORS[trade.state] ?? '#fff', border: `1px solid ${STATE_COLORS[trade.state] ?? '#fff'}` }}
        >
          {trade.state}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-6">
        {/* NFTs */}
        <div className="bg-[#1A2840] rounded-xl p-5 border border-[#00D4FF22]">
          <h3 className="text-[#F7B731] text-sm font-bold uppercase tracking-wider mb-4">
            NFTs On-Chain
          </h3>
          {[
            { label: 'Compliance NFT', value: trade.complianceNFT },
            { label: 'Carta de Crédito NFT', value: trade.lcNFT },
          ].map(({ label, value }) => (
            <div key={label} className="mb-3">
              <p className="text-gray-500 text-xs">{label}</p>
              <p className="text-[#00D4FF] text-sm font-medium truncate">{value}</p>
            </div>
          ))}
        </div>

        {/* On-Chain Info */}
        <div className="bg-[#1A2840] rounded-xl p-5 border border-[#00D4FF22]">
          <h3 className="text-[#F7B731] text-sm font-bold uppercase tracking-wider mb-4">
            Datos On-Chain
          </h3>
          {[
            { label: 'Escrow Address', value: trade.escrowAddress },
            { label: 'Tx Hash',        value: trade.escrowTxHash },
            { label: 'Yield APY',      value: trade.yieldAPY },
            { label: 'Costo Total',    value: trade.totalCost },
          ].map(({ label, value }) => (
            <div key={label} className="mb-3">
              <p className="text-gray-500 text-xs">{label}</p>
              <p className="text-white text-sm font-medium truncate">{value ?? 'N/A'}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <AuditTrailTable tradeId={trade.id} />
      </div>
    </div>
  );
}
