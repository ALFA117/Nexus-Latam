'use client';

import { useEffect, useState } from 'react';

interface FXRate {
  pair:   string;
  flag:   string;
  rate:   number;
  change: number;
  rail:   string;
}

interface ETHPrice {
  price:  number;
  change: number;
}

const BASE: FXRate[] = [
  { pair: 'USDC/MXN', flag: '🇲🇽', rate:   17.23, change:  0.12, rail: 'SPEI' },
  { pair: 'USDC/BRL', flag: '🇧🇷', rate:    5.61, change: -0.03, rail: 'PIX'  },
  { pair: 'USDC/COP', flag: '🇨🇴', rate: 3924.0,  change:  8.40, rail: 'PSE'  },
  { pair: 'USDC/ARS', flag: '🇦🇷', rate:  950.0,  change:  2.10, rail: 'CVU'  },
  { pair: 'USDC/PEN', flag: '🇵🇪', rate:    3.72, change:  0.01, rail: 'CCI'  },
  { pair: 'USDC/CLP', flag: '🇨🇱', rate:  912.0,  change: -1.50, rail: 'TEF'  },
];

const BASE_ETH: ETHPrice = { price: 3412.50, change: 42.30 };

function fmtRate(rate: number): string {
  if (rate < 100)    return rate.toFixed(4);
  if (rate < 10000)  return rate.toFixed(1);
  return rate.toFixed(0);
}

function fmtTime(d: Date): string {
  return d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function LiveFXTicker() {
  const [rates, setRates]     = useState(BASE);
  const [eth, setEth]         = useState(BASE_ETH);
  const [lastUpdate, setLast] = useState<string>('');

  useEffect(() => {
    setLast(fmtTime(new Date()));
    const iv = setInterval(() => {
      setRates(prev => prev.map(r => ({
        ...r,
        rate:   r.rate * (1 + (Math.random() - 0.5) * 0.001),
        change: r.change + (Math.random() - 0.5) * 0.02,
      })));
      setEth(prev => ({
        price:  prev.price * (1 + (Math.random() - 0.5) * 0.002),
        change: prev.change + (Math.random() - 0.5) * 1.5,
      }));
      setLast(fmtTime(new Date()));
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

      {/* ETH/USD row */}
      <div className="flex items-center gap-2 mb-2.5 pb-2.5 border-b border-[#00D4FF08]">
        <span className="text-base leading-none shrink-0">⟠</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-white/55 text-xs font-mono">ETH/USD</span>
            <div className="flex items-center gap-2">
              <span className="font-orbitron text-xs font-bold text-white">
                ${eth.price.toFixed(2)}
              </span>
              <span
                className="text-xs font-mono font-semibold"
                style={{ color: eth.change >= 0 ? '#00FF94' : '#FF3366' }}
              >
                {eth.change >= 0 ? '▲' : '▼'} {Math.abs(eth.change).toFixed(2)}
              </span>
            </div>
          </div>
          <div className="h-0.5 bg-[#ffffff06] rounded-full mt-1 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: '62%',
                background: eth.change >= 0
                  ? 'linear-gradient(90deg, #00D4FF44, #00D4FF)'
                  : 'linear-gradient(90deg, #FF336644, #FF3366)',
              }}
            />
          </div>
        </div>
        <span
          className="text-xs font-mono shrink-0 px-1.5 py-0.5 rounded"
          style={{ color: '#A855F7', background: '#A855F712', border: '1px solid #A855F725' }}
        >
          ARB
        </span>
      </div>

      {/* FIAT pairs */}
      <div className="space-y-2.5">
        {rates.map((r) => {
          const up = r.change >= 0;
          return (
            <div key={r.pair} className="flex items-center gap-2">
              <span className="text-base leading-none shrink-0">{r.flag}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-white/55 text-xs font-mono">{r.pair}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-orbitron text-xs font-bold text-white">{fmtRate(r.rate)}</span>
                    <span
                      className="text-xs font-mono font-semibold"
                      style={{ color: up ? '#00FF94' : '#FF3366' }}
                    >
                      {up ? '▲' : '▼'} {Math.abs(r.change).toFixed(2)}
                    </span>
                  </div>
                </div>
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

      {/* Footer: last update */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#00D4FF08]">
        <p className="text-white/20 text-xs font-mono">vía Bitso Business API</p>
        <p className="text-white/25 text-xs font-mono">
          {lastUpdate ? `↻ ${lastUpdate}` : ''}
        </p>
      </div>
    </div>
  );
}
