'use client';

const FEATURES = [
  {
    icon: '⚡',
    color: '#F7B731',
    title: 'Settlement en 60s',
    subtitle: 'End-to-end automatizado',
    description: 'Desde solicitud hasta liquidación en menos de 60 segundos. SPEI, PIX, PSE y CVU procesados por Bitso Business sin intervención humana.',
    tags: ['SPEI', 'PIX', 'PSE', 'CVU'],
  },
  {
    icon: '🤖',
    color: '#9B30FF',
    title: 'IA Multi-Agente',
    subtitle: 'Claude Opus + Prompt Caching',
    description: '5 agentes especializados operando en paralelo con Claude Opus 4.7, prompt caching de $0.30/1M tokens y adaptive thinking.',
    tags: ['Claude API', 'Prompt Cache', 'Adaptive Think'],
  },
  {
    icon: '⛓',
    color: '#00D4FF',
    title: 'Arbitrum Stylus',
    subtitle: 'Smart Contracts en Rust',
    description: 'Contratos TradeEscrow, BatchPayment, NexusVault y ComplianceRegistry escritos en Rust con Arbitrum Stylus. Gas 100x más barato.',
    tags: ['Rust', 'Stylus SDK', 'EVM-compatible'],
  },
  {
    icon: '📈',
    color: '#00FF94',
    title: 'Yield Automático',
    subtitle: 'Aave V3 Integration',
    description: 'Los fondos en escrow generan yield en Aave V3 vía NexusVault. 20% del rendimiento se distribuye automáticamente al seller.',
    tags: ['Aave V3', 'Auto-yield', '20% split'],
  },
  {
    icon: '🔐',
    color: '#FF6B35',
    title: 'Compliance On-chain',
    subtitle: 'KYC/AML Inmutable',
    description: 'ComplianceNFT acuñado con score 0-1000, tier BASIC/VERIFIED/PREMIUM y vigencia. Validación automática en cada operación.',
    tags: ['KYC/AML', 'NFT Score', 'FATF Ready'],
  },
  {
    icon: '🌎',
    color: '#00D4FF',
    title: 'Multi-Rail LATAM',
    subtitle: '6 países, múltiples rieles',
    description: 'MX-SPEI, BR-PIX, CO-PSE, AR-CVU, PE-CCI, CL-TEF. Conversión automática FIAT → USDC en cada riel de pago.',
    tags: ['México', 'Brasil', 'Colombia', '+3'],
  },
];

const STACK = [
  { name: 'Arbitrum Stylus', role: 'Smart Contracts (Rust)', color: '#00D4FF' },
  { name: 'Claude Opus 4.7', role: 'AI Agents Engine',        color: '#9B30FF' },
  { name: 'Bitso Business',  role: 'Payments & FX',           color: '#F7B731' },
  { name: 'Rare Protocol',   role: 'NFT Minting CLI',         color: '#FF6B35' },
  { name: 'Aave V3',         role: 'Yield Optimization',      color: '#00FF94' },
  { name: 'Next.js 14',      role: 'Dashboard Frontend',      color: '#00D4FF' },
];

export function ProtocolFeatures() {
  return (
    <section id="protocol" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 text-xs font-mono text-[#00D4FF] uppercase tracking-widest">
            <span className="w-8 h-px bg-[#00D4FF]" />
            PROTOCOLO
            <span className="w-8 h-px bg-[#00D4FF]" />
          </div>
          <h2 className="font-orbitron text-4xl md:text-5xl font-black mb-4">
            <span className="text-white">INFRAESTRUCTURA </span>
            <span className="gradient-text-cyan">WEB3</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-sm">
            Stack técnico diseñado para procesar el comercio B2B de LATAM a escala industrial.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="group glass clip-corner p-5 card-hover relative overflow-hidden"
              style={{
                borderColor: `${f.color}22`,
                animationDelay: `${i * 0.08}s`,
              }}
            >
              {/* Icon + title */}
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center text-xl shrink-0"
                  style={{
                    background: `${f.color}15`,
                    border: `1px solid ${f.color}35`,
                    boxShadow: `0 0 20px ${f.color}20`,
                  }}
                >
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-orbitron font-black text-sm text-white mb-0.5 tracking-wide">
                    {f.title}
                  </h3>
                  <p className="text-xs font-mono" style={{ color: f.color }}>
                    {f.subtitle}
                  </p>
                </div>
              </div>

              <p className="text-white/55 text-sm leading-relaxed mb-4">{f.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {f.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono px-2 py-0.5 rounded"
                    style={{
                      color: f.color,
                      background: `${f.color}10`,
                      border: `1px solid ${f.color}25`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Hover accent line */}
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, transparent, ${f.color}, transparent)` }}
              />
            </div>
          ))}
        </div>

        {/* Tech stack */}
        <div className="divider-neon mb-12" />
        <div className="text-center mb-8">
          <p className="font-orbitron text-sm text-white/40 uppercase tracking-widest">Tech Stack</p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {STACK.map((s) => (
            <div
              key={s.name}
              className="flex items-center gap-3 glass px-4 py-2.5 clip-corner-sm"
              style={{ borderColor: `${s.color}30` }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: s.color, boxShadow: `0 0 6px ${s.color}` }}
              />
              <span className="font-orbitron text-sm font-bold" style={{ color: s.color }}>{s.name}</span>
              <span className="text-white/30 text-xs font-mono">{s.role}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
