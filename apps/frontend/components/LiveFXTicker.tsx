'use client';

import { useEffect, useState } from 'react';

interface FXRate {
  pair:   string;
  rate:   number;
  change: number;
  flag:   string;
}

const BASE_RATES: FXRate[] = [
  { pair: 'USDC/MXN', rate: 17.23, change:  0.12, flag: 'MX' },
  { pair: 'USDC/BRL', rate:  5.61, change: -0.03, flag: 'BR' },
  { pair: 'USDC/COP', rate: 3924,  change:  8.40, flag: 'CO' },
  { pair: 'USDC/ARS', rate:  950,  change:  2.10, flag: 'AR' },
];

export function LiveFXTicker() {
  const [rates, setRates] = useState(BASE_RATES);

  // Simulate live FX updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRates(prev =>
        prev.map(r => ({
          ...r,
          rate:   r.rate + (Math.random() - 0.5) * r.rate * 0.001,
          change: r.change + (Math.random() - 0.5) * 0.02,
        }))
      );
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#1A2840] rounded-xl p-4 border border-[#00D4FF22]">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-[#F7B731] text-xs font-bold uppercase tracking-wider">FX en Vivo</h3>
        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
      </div>
      <div className="space-y-2">
        {rates.map(r => (
          <div key={r.pair} className="flex justify-between items-center">
            <span className="text-gray-400 text-xs">{r.pair}</span>
            <div className="text-right">
              <span className="text-white text-xs font-medium">
                {r.rate < 100
                  ? r.rate.toFixed(4)
                  : r.rate.toFixed(0)}
              </span>
              <span
                className="ml-2 text-xs"
                style={{ color: r.change >= 0 ? '#00FF88' : '#FF4444' }}
              >
                {r.change >= 0 ? '+' : ''}{r.change.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
      <p className="text-gray-600 text-xs mt-3">vía Bitso Business API</p>
    </div>
  );
}
