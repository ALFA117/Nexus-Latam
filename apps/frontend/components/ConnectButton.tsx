'use client';

import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { arbitrumSepolia } from '../lib/wagmi-config';
import { useState, useEffect, useRef } from 'react';

export function ConnectButton() {
  const { address, isConnected, chain }   = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect }                     = useDisconnect();
  const { data: balance }                  = useBalance({ address, chainId: arbitrumSepolia.id });
  const [open, setOpen]                    = useState(false);
  const [copied, setCopied]                = useState(false);
  const ref                                = useRef<HTMLDivElement>(null);

  const short     = (addr: string) => `${addr.slice(0, 6)}…${addr.slice(-4)}`;
  const wrongChain = isConnected && chain?.id !== arbitrumSepolia.id;

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const copyAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  if (isConnected && address) {
    return (
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(v => !v)}
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
          <span
            className="text-white/30 text-xs transition-transform duration-200"
            style={{ display: 'inline-block', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >▾</span>
        </button>

        {open && (
          <div
            className="absolute right-0 top-full mt-2 glass-dark border border-[#00D4FF20] rounded-lg overflow-hidden min-w-[210px] z-50"
            style={{ animation: 'dropdownIn 0.15s ease-out' }}
          >
            <div className="px-4 py-3 border-b border-[#00D4FF12]">
              <p className="text-white/30 text-xs font-mono uppercase tracking-widest">Conectado</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="font-mono text-sm text-[#00D4FF]">{short(address)}</p>
                <button
                  onClick={copyAddress}
                  title="Copiar address completa"
                  className="text-white/30 hover:text-[#00D4FF] transition-colors text-xs"
                >
                  {copied ? '✓' : '⎘'}
                </button>
              </div>
              {wrongChain && (
                <p className="text-[#F7B731] text-xs font-mono mt-1">⚠ Cambia a Arbitrum Sepolia</p>
              )}
              {balance && (
                <p className="text-white/40 text-xs font-mono mt-1">
                  {Number(balance.formatted).toFixed(4)} ETH
                </p>
              )}
            </div>
            <button
              onClick={copyAddress}
              className="w-full px-4 py-2.5 text-left text-xs font-mono text-white/50 hover:bg-[#00D4FF08] hover:text-[#00D4FF] transition-colors border-b border-[#ffffff04] flex items-center gap-2"
            >
              <span>{copied ? '✓' : '⎘'}</span>
              {copied ? 'Copiado!' : 'Copiar address'}
            </button>
            <button
              onClick={() => { disconnect(); setOpen(false); }}
              className="w-full px-4 py-2.5 text-left text-xs font-mono text-[#FF3366] hover:bg-[#FF336615] transition-colors flex items-center gap-2"
            >
              <span>⏻</span> Desconectar
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
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
        <div
          className="absolute right-0 top-full mt-2 glass-dark border border-[#00D4FF20] rounded-lg overflow-hidden min-w-[210px] z-50"
          style={{ animation: 'dropdownIn 0.15s ease-out' }}
        >
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
