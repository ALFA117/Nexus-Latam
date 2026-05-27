export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-[#060D17] grid-bg flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* Animated rings */}
        <div className="relative w-20 h-20 mx-auto">
          <div
            className="absolute inset-0 rounded-full border-2 border-[#00D4FF20]"
            style={{ animation: 'spin 3s linear infinite' }}
          />
          <div
            className="absolute inset-2 rounded-full border-2 border-t-[#00D4FF] border-r-transparent border-b-transparent border-l-transparent"
            style={{ animation: 'spin 1.2s linear infinite' }}
          />
          <div
            className="absolute inset-4 rounded-full border border-[#9B30FF40]"
            style={{ animation: 'spin 2s linear infinite reverse' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[#00D4FF] text-lg font-bold">⬡</span>
          </div>
        </div>

        <div className="space-y-1">
          <p className="font-orbitron text-sm text-[#00D4FF] tracking-widest uppercase">
            NEXUS LATAM
          </p>
          <p className="text-white/30 text-xs font-mono">Inicializando protocolo...</p>
        </div>

        {/* Shimmer bar */}
        <div className="w-48 h-0.5 bg-[#ffffff08] rounded-full mx-auto overflow-hidden relative">
          <div
            className="absolute top-0 h-full rounded-full"
            style={{
              width: '40%',
              background: 'linear-gradient(90deg, #9B30FF, #00D4FF)',
              animation: 'skeleton-shimmer 1.4s ease-in-out infinite',
            }}
          />
        </div>
      </div>
    </div>
  );
}
