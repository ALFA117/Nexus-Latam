import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#060D17] text-white grid-bg flex items-center justify-center relative overflow-hidden">
      {/* Scan line */}
      <div className="scan-line" />

      {/* Bg radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(255,51,102,0.06) 0%, transparent 70%)' }}
      />

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l border-t border-[#FF336640] pointer-events-none" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r border-t border-[#FF336640] pointer-events-none" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l border-b border-[#00D4FF33] pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r border-b border-[#00D4FF33] pointer-events-none" />

      <div className="text-center px-6 relative z-10">
        {/* Error code */}
        <div className="relative mb-4">
          <p
            className="font-orbitron text-[120px] md:text-[180px] font-black leading-none select-none"
            style={{
              color: 'transparent',
              WebkitTextStroke: '1px rgba(255,51,102,0.3)',
              textShadow: '0 0 80px rgba(255,51,102,0.15)',
            }}
          >
            404
          </p>
          <p
            className="font-orbitron text-[120px] md:text-[180px] font-black leading-none absolute inset-0 glitch"
            style={{ color: 'rgba(255,51,102,0.6)' }}
          >
            404
          </p>
        </div>

        {/* Message */}
        <div className="mb-2">
          <span className="inline-flex items-center gap-2 glass border-[#FF336630] px-4 py-2 rounded-full text-xs font-mono text-[#FF3366] uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF3366] animate-pulse" />
            RUTA NO ENCONTRADA
          </span>
        </div>

        <h1 className="font-orbitron text-xl md:text-2xl font-black text-white mt-4 mb-2">
          OPERACIÓN FALLIDA
        </h1>
        <p className="text-white/40 text-sm font-mono max-w-sm mx-auto mb-8">
          El agente no pudo resolver esta ruta en el protocolo.
          Verifica el ID de operación o vuelve al dashboard.
        </p>

        {/* Terminal error */}
        <div className="terminal rounded-lg p-4 max-w-md mx-auto text-left mb-8">
          <div className="flex gap-2 mb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF3366]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#F7B731]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#00FF94]" />
          </div>
          {[
            { t: '[NexusRouter]    ERROR: route not found — 404', c: '#FF3366' },
            { t: '[NexusRouter]    Tried: GET /unknown-path',     c: '#ffffff40' },
            { t: '[NexusRouter]    Suggestion: check trade ID',   c: '#F7B731' },
            { t: '[NexusRouter]    Redirecting to /trades...',    c: '#00D4FF' },
          ].map((l, i) => (
            <div key={i} className="text-xs font-mono mb-1" style={{ color: l.c }}>{l.t}</div>
          ))}
          <div className="text-[#00D4FF] text-xs font-mono blink mt-1">_</div>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/">
            <button className="btn-solid-cyan text-xs px-8 py-3">
              IR AL INICIO
            </button>
          </Link>
          <Link href="/trades">
            <button className="btn-neon text-xs px-8 py-3">
              VER OPERACIONES
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
