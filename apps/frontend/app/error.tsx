'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[NEXUS Error]', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#060D17] grid-bg flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-6">
        {/* Glitch icon */}
        <div className="relative w-24 h-24 mx-auto">
          <div
            className="absolute inset-0 rounded-2xl border border-[#FF336640] flex items-center justify-center"
            style={{ background: '#FF336610' }}
          >
            <span className="text-4xl" style={{ color: '#FF3366', filter: 'drop-shadow(0 0 12px #FF3366)' }}>
              ⚠
            </span>
          </div>
          <div
            className="absolute inset-0 rounded-2xl border border-[#FF336620]"
            style={{ animation: 'ping 2s cubic-bezier(0,0,0.2,1) infinite', opacity: 0.4 }}
          />
        </div>

        {/* Error info */}
        <div className="space-y-2">
          <h1 className="font-orbitron text-2xl font-black text-[#FF3366] tracking-widest">
            PROTOCOL ERROR
          </h1>
          <p className="text-white/40 text-sm font-mono">
            Un error inesperado interrumpió el protocolo NEXUS LATAM
          </p>
        </div>

        {/* Terminal block */}
        <div className="glass border border-[#FF336620] rounded-lg p-4 text-left space-y-1">
          <p className="text-[#FF3366] text-xs font-mono uppercase tracking-widest mb-2">
            ▸ Error Log
          </p>
          <p className="text-white/50 text-xs font-mono break-all">
            {error.message || 'Unknown error'}
          </p>
          {error.digest && (
            <p className="text-white/25 text-xs font-mono">digest: {error.digest}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="btn-neon text-xs px-6 py-2.5"
          >
            ↻ REINTENTAR
          </button>
          <Link href="/" className="btn-solid-cyan text-xs px-6 py-2.5 text-center">
            ← VOLVER AL INICIO
          </Link>
        </div>

        <p className="text-white/15 text-xs font-mono">
          NEXUS LATAM · Protocolo B2B Autónomo
        </p>
      </div>
    </div>
  );
}
