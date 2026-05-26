'use client';

import { useState, useEffect } from 'react';
import { useNexusAPI }         from '../../hooks/useNexusAPI';
import { TradeCard }           from '../../components/TradeCard';
import Link                    from 'next/link';

const STATE_LABELS: Record<string, string> = {
  PENDING:   'Pendiente',
  FUNDED:    'Fondeado',
  DELIVERED: 'Entregado',
  SETTLED:   'Liquidado',
  DISPUTED:  'En Disputa',
};

const STATE_COLORS: Record<string, string> = {
  PENDING:   '#F7B731',
  FUNDED:    '#00D4FF',
  DELIVERED: '#00E5FF',
  SETTLED:   '#00FF88',
  DISPUTED:  '#FF4444',
};

export default function TradesPage() {
  const { loading, error, getTrades } = useNexusAPI();
  const [trades, setTrades]           = useState<unknown[]>([]);
  const [filter, setFilter]           = useState<string>('ALL');

  useEffect(() => {
    getTrades().then(setTrades).catch(console.error);
  }, []);

  const filters = ['ALL', 'PENDING', 'FUNDED', 'SETTLED', 'DISPUTED'];

  return (
    <div className="min-h-screen bg-[#0D1B2A] text-white font-mono p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/" className="text-gray-500 text-sm hover:text-[#00D4FF]">← Dashboard</Link>
          <h2 className="text-2xl font-bold text-[#00D4FF] mt-1">Operaciones Comerciales</h2>
        </div>
        <div className="flex gap-2">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                filter === f
                  ? 'bg-[#00D4FF] text-[#0D1B2A]'
                  : 'bg-[#1A2840] text-gray-400 hover:text-white'
              }`}
            >
              {STATE_LABELS[f] ?? f}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="text-[#00D4FF] animate-pulse text-center py-12">
          Cargando operaciones...
        </div>
      )}
      {error && (
        <div className="text-red-400 bg-red-900/20 rounded-xl p-4 mb-4">
          Error: {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {(trades as { id: string; state: string }[])
          .filter(t => filter === 'ALL' || t.state === filter)
          .map(trade => (
            <TradeCard key={trade.id} trade={trade} stateColors={STATE_COLORS} />
          ))}
      </div>

      {trades.length === 0 && !loading && (
        <div className="text-center text-gray-500 py-20">
          <p className="text-2xl mb-3">No hay operaciones aún</p>
          <Link href="/" className="text-[#00D4FF] hover:underline text-sm">
            Crear primera operación →
          </Link>
        </div>
      )}
    </div>
  );
}
