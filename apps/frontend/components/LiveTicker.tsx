'use client';

const TICKERS = [
  { label: 'MXN/USDC', value: '17.3241', change: '+0.12%', up: true },
  { label: 'BRL/USDC', value: '5.1890',  change: '-0.08%', up: false },
  { label: 'ARS/USDC', value: '892.50',  change: '+1.43%', up: true },
  { label: 'COP/USDC', value: '4120.00', change: '+0.31%', up: true },
  { label: 'CLP/USDC', value: '968.40',  change: '-0.22%', up: false },
  { label: 'PEN/USDC', value: '3.7850',  change: '+0.05%', up: true },
  { label: 'ARB/USDC', value: '0.8412',  change: '+2.14%', up: true },
  { label: 'ETH/USDC', value: '3,421.00','change': '+1.87%', up: true },
  { label: 'VOLUME 24H', value: '$1.24M', change: 'USDC', up: true },
  { label: 'SETTLEMENTS', value: '48', change: 'TODAY', up: true },
  { label: 'AVG TIME', value: '58s',  change: 'SETTLEMENT', up: true },
  { label: 'YIELD APY', value: '4.2%', change: 'AAVE V3', up: true },
];

export function LiveTicker() {
  const doubled = [...TICKERS, ...TICKERS];

  return (
    <div className="w-full overflow-hidden bg-[#060D17] border-y border-[#00D4FF22] py-3 relative">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, #060D17, transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(-90deg, #060D17, transparent)' }} />

      <div className="flex ticker-track whitespace-nowrap" style={{ width: 'max-content' }}>
        {doubled.map((t, i) => (
          <div key={i} className="flex items-center gap-2 mx-6 shrink-0">
            <span className="text-white/40 font-mono text-xs uppercase tracking-widest">{t.label}</span>
            <span className="font-orbitron text-sm font-bold text-white">{t.value}</span>
            <span
              className="text-xs font-mono font-medium"
              style={{ color: t.up ? '#00FF94' : '#FF3366' }}
            >
              {t.change}
            </span>
            <span className="text-[#00D4FF22] mx-2">|</span>
          </div>
        ))}
      </div>
    </div>
  );
}
