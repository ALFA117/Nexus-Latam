'use client';

import { useEffect, useState } from 'react';

interface FXRate {
  pair:   string;
  flag:   string;
  rate:   number;
  change: number;
  rail:   string;
}

const BASE: FXRate[] = [
  { pair: 'USDC/MXN', flag: '🇲🇽', rate: 17.23,  change:  0.12, rail: 'SPEI' },
  { pair: 'USDC/BRL', flag: '🇧🇷', rate:  5.61,  change: -0.03, rail: 'PIX'  },
  { pair: 'USDC/COP', flag: '🇨🇴', rate: 3924.0, change:  8.40, rail: 'PSE'  },
  { pair: 'USDC/ARS', flag: '🇦🇷', rate: 950.0,  change:  2.10, rail: 'CVU'  },
];

export function LiveFXTicker() {
  const [rates, setRates] = useState(BASE);

  useEffect(() => {
    const iv = setInterval(() => {
      setRates(prev => prev.map(r => ({
        ...r,
        rate:   r.rate * (1 + (Math.random() - 0.5) * 0.001),
        change: r.change + (Math.random() - 0.5) * 0.02,
      })));
    }, 2500);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="glass clip-corner border-[#00D4FF18] p-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#00D4FF12] mb-3">
        <span className="font-orbitron text-xs text-[#F7B731] uppercase tracking-widest">
          FX Live — Bitso
        </span>
        <span className="flex items-center gap-1.5 text-xs font-mono text-[#00FF94]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00FF94] animate-pulse" />
          live
        </span>
      </div>

      <div className="space-y-2.5">
        {rates.map((r) => {
          const up     = r.change >= 0;
          const rateStr = r.rate < 100 ? r.rate.toFixed(4) : r.rate.toFixed(1);
          return (
            <div key={r.pair} className="flex items-center gap-2">
              <span className="text-base leading-none shrink-0">{r.flag}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-white/55 text-xs font-mono">{r.pair}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-orbitron text-xs font-bold text-white">{rateStr}</span>
                    <span
                      className="text-xs font-mono font-semibold"
                      style={{ color: up ? '#00FF94' : '#FF3366' }}
                    >
                      {up ? '▲' : '▼'} {Math.abs(r.change).toFixed(2)}
                    </span>
                  </div>
                </div>
                {/* Mini sparkline bar */}
                <div className="h-0.5 bg-[#ffffff06] rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${40 + Math.random() * 40}%`,
                      background: up
                        ? 'linear-gradient(90deg, #00FF9444, #00FF94)'
                        : 'linear-gradient(90deg, #FF336644, #FF3366)',
                    }}
                  />
                </div>
              </div>
              <span
                className="text-xs font-mono shrink-0 px-1.5 py-0.5 rounded"
                style={{ color: '#00D4FF', background: '#00D4FF12', border: '1px solid #00D4FF25' }}
              >
                {r.rail}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-white/20 text-xs font-mono mt-3 text-center">
        vía Bitso Business API
      </p>
    </div>
  );
}
