'use client';

import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { arbitrumSepolia } from '../lib/wagmi-config';
import { useState } from 'react';

export function ConnectButton() {
  const { address, isConnected, chain }   = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect }                     = useDisconnect();
  const { data: balance }                  = useBalance({ address, chainId: arbitrumSepolia.id });
  const [open, setOpen]                    = useState(false);

  const short = (addr: string) => `${addr.slice(0, 6)}…${addr.slice(-4)}`;
  const wrongChain = isConnected && chain?.id !== arbitrumSepolia.id;

  if (isConnected && address) {
    return (
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 glass border-[#00D4FF30] px-3 py-1.5 clip-corner-sm hover:border-[#00D4FF60] transition-all"
        >
          {wrongChain ? (
            <span className="status-dot status-warning" />
          ) : (
            <span className="status-dot status-online" />
          )}
          <span className="font-mono text-xs text-white/80">{short(address)}</span>
          {balance && (
            <span className="text-[#00D4FF] text-xs font-mono font-semibold">
              {Number(balance.formatted).toFixed(3)} ETH
            </span>
          )}
          <span className="text-white/30 text-xs">▾</span>
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-2 glass-dark border border-[#00D4FF20] rounded-lg overflow-hidden min-w-[180px] z-50">
            <div className="px-4 py-3 border-b border-[#00D4FF12]">
              <p className="text-white/30 text-xs font-mono uppercase">Conectado</p>
              <p className="font-mono text-sm text-[#00D4FF] mt-0.5">{short(address)}</p>
              {wrongChain && (
                <p className="text-[#F7B731] text-xs font-mono mt-1">⚠ Cambia a Arbitrum Sepolia</p>
              )}
            </div>
            <button
              onClick={() => { disconnect(); setOpen(false); }}
              className="w-full px-4 py-3 text-left text-xs font-mono text-[#FF3366] hover:bg-[#FF336615] transition-colors"
            >
              Desconectar
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={isPending}
        className="btn-neon text-xs py-1.5 px-4 disabled:opacity-50"
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 border border-[#00D4FF] border-t-transparent rounded-full animate-spin" />
            Conectando
          </span>
        ) : 'CONECTAR'}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 glass-dark border border-[#00D4FF20] rounded-lg overflow-hidden min-w-[200px] z-50">
          <div className="px-4 py-3 border-b border-[#00D4FF12]">
            <p className="text-white/40 text-xs font-mono uppercase tracking-widest">Selecciona wallet</p>
          </div>
          {connectors.map(c => (
            <button
              key={c.id}
              onClick={() => { connect({ connector: c, chainId: arbitrumSepolia.id }); setOpen(false); }}
              className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-[#00D4FF08] transition-colors border-b border-[#ffffff04] last:border-0"
            >
              <span className="text-[#00D4FF] text-xs">⬡</span>
              <span className="font-mono text-sm text-white/70">{c.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
