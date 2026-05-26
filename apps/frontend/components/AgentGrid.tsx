'use client';

import { useState } from 'react';

const AGENTS = [
  {
    id: 'router',
    name: 'NEXUS ROUTER',
    role: 'Orquestador Principal',
    class: 'agent-router',
    color: '#00D4FF',
    icon: '⬡',
    level: 99,
    status: 'ONLINE',
    description: 'Clasifica solicitudes entrantes y coordina el flujo entre todos los agentes. Punto de entrada único del protocolo.',
    skills: ['Routing', 'Load Balancing', 'Orchestration', 'Priority Queue'],
    metrics: { processed: '48,291', uptime: '99.97%', latency: '12ms' },
    xp: 92,
  },
  {
    id: 'compliance',
    name: 'COMPLIANCE AGENT',
    role: 'Verificación KYC/AML',
    class: 'agent-compliance',
    color: '#9B30FF',
    icon: '◈',
    level: 87,
    status: 'ONLINE',
    description: 'Ejecuta KYC/AML via Bitso Business. Acuña ComplianceNFT en Arbitrum con score, tier y vigencia.',
    skills: ['KYC/AML', 'NFT Minting', 'Risk Scoring', 'FATF Compliance'],
    metrics: { verified: '12,441', nfts: '12,441', accuracy: '99.2%' },
    xp: 78,
  },
  {
    id: 'trade',
    name: 'TRADE AGENT',
    role: 'Cartas de Crédito & LC',
    class: 'agent-trade',
    color: '#F7B731',
    icon: '◆',
    level: 94,
    status: 'ONLINE',
    description: 'Emite Cartas de Crédito programables como NFTs. Gestiona el escrow on-chain y liquida contra eventos reales.',
    skills: ['Letter of Credit', 'Escrow Mgmt', 'LC-NFT Mint', 'Settlement'],
    metrics: { volume: '$1.2M', lcs: '891', settled: '99.1%' },
    xp: 88,
  },
  {
    id: 'yield',
    name: 'YIELD AGENT',
    role: 'Optimización de Rendimiento',
    class: 'agent-yield',
    color: '#00FF94',
    icon: '⬡',
    level: 78,
    status: 'ONLINE',
    description: 'Deposita fondos en escrow en Aave V3 vía NexusVault. Distribuye yield al seller al momento de settlement.',
    skills: ['Aave V3', 'Yield Farming', 'Auto-compound', 'Risk Mgmt'],
    metrics: { tvl: '$842K', apy: '4.2%', earned: '$32,104' },
    xp: 65,
  },
  {
    id: 'audit',
    name: 'AUDIT AGENT',
    role: 'Trazabilidad & Reportes',
    class: 'agent-audit',
    color: '#FF6B35',
    icon: '◉',
    level: 85,
    status: 'ONLINE',
    description: 'Genera bundles de auditoría con Merkle root por lote. Acuña Audit NFT con hash inmutable en Arbitrum.',
    skills: ['Merkle Tree', 'Audit NFT', 'Batch Reports', 'Compliance Logs'],
    metrics: { bundles: '42', transactions: '500/bundle', merkle: 'SHA-256' },
    xp: 71,
  },
];

export function AgentGrid() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section id="agents" className="py-24 px-6 relative">
      {/* Background */}
      <div className="absolute inset-0 grid-bg-dense opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 text-xs font-mono text-[#9B30FF] uppercase tracking-widest">
            <span className="w-8 h-px bg-[#9B30FF]" />
            INTELLIGENCE LAYER
            <span className="w-8 h-px bg-[#9B30FF]" />
          </div>
          <h2 className="font-orbitron text-4xl md:text-5xl font-black mb-4">
            <span className="text-white">5 AGENTES </span>
            <span className="gradient-text-cyan">AUTÓNOMOS</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-sm leading-relaxed">
            Cada agente opera de forma independiente con Claude Opus, prompt caching y herramientas especializadas para el comercio B2B en LATAM.
          </p>
        </div>

        {/* Agent cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {AGENTS.map((agent, i) => (
            <div
              key={agent.id}
              className={`${agent.class} relative cursor-pointer card-hover`}
              style={{ animationDelay: `${i * 0.1}s` }}
              onClick={() => setActive(active === agent.id ? null : agent.id)}
            >
              {/* Card */}
              <div
                className="clip-corner glass h-full p-6 transition-all duration-300"
                style={{
                  borderColor: `${agent.color}33`,
                  boxShadow: active === agent.id
                    ? `0 0 40px ${agent.color}30, inset 0 1px 0 ${agent.color}20`
                    : `0 0 0 transparent`,
                }}
              >
                {/* Top bar */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl font-bold"
                    style={{ background: `${agent.color}15`, color: agent.color, border: `1px solid ${agent.color}40` }}
                  >
                    {agent.icon}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className="status-dot status-online" />
                      <span className="text-[#00FF94] text-xs font-mono">{agent.status}</span>
                    </div>
                    <span
                      className="text-xs font-orbitron font-bold"
                      style={{ color: agent.color }}
                    >
                      LVL {agent.level}
                    </span>
                  </div>
                </div>

                {/* Name */}
                <h3
                  className="font-orbitron font-black text-base mb-0.5 tracking-wide"
                  style={{ color: agent.color }}
                >
                  {agent.name}
                </h3>
                <p className="text-white/40 text-xs font-mono uppercase tracking-widest mb-3">
                  {agent.role}
                </p>

                {/* XP bar */}
                <div className="progress-bar mb-4">
                  <div
                    className="progress-fill transition-all duration-1000"
                    style={{
                      width: `${agent.xp}%`,
                      background: `linear-gradient(90deg, ${agent.color}88, ${agent.color})`,
                    }}
                  />
                </div>

                {/* Description */}
                <p className="text-white/55 text-sm leading-relaxed mb-4">
                  {agent.description}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {agent.skills.map((sk) => (
                    <span
                      key={sk}
                      className="clip-corner-sm text-xs font-mono px-2 py-0.5"
                      style={{
                        background: `${agent.color}10`,
                        color: agent.color,
                        border: `1px solid ${agent.color}30`,
                      }}
                    >
                      {sk}
                    </span>
                  ))}
                </div>

                {/* Metrics */}
                {active === agent.id && (
                  <div
                    className="grid grid-cols-3 gap-2 pt-4 border-t"
                    style={{ borderColor: `${agent.color}25` }}
                  >
                    {Object.entries(agent.metrics).map(([k, v]) => (
                      <div key={k} className="text-center">
                        <p className="font-orbitron text-sm font-bold" style={{ color: agent.color }}>{v}</p>
                        <p className="text-white/30 text-xs font-mono uppercase">{k}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Expand hint */}
                <div className="absolute bottom-3 right-4 text-white/20 text-xs font-mono">
                  {active === agent.id ? '▲ menos' : '▼ stats'}
                </div>

                {/* Corner accent */}
                <div
                  className="absolute top-0 right-0 w-0 h-0 pointer-events-none"
                  style={{
                    borderLeft: '16px solid transparent',
                    borderTop: `16px solid ${agent.color}60`,
                  }}
                />
              </div>
            </div>
          ))}

          {/* Orchestrator visual — wide card */}
          <div className="md:col-span-2 lg:col-span-3">
            <div className="clip-corner-lg glass border-[#00D4FF22] p-6">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div>
                  <p className="text-[#00D4FF] font-orbitron text-xs uppercase tracking-widest mb-1">NEXUS ORCHESTRATOR</p>
                  <h3 className="text-white font-bold text-xl">Flow de Operación Completo</h3>
                  <p className="text-white/40 text-sm mt-1">Todos los agentes operan en cadena coordinados por el Orchestrator</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {['Router', '→', 'Compliance', '→', 'Trade', '→', 'Yield', '→', 'Audit'].map((step, i) => (
                    <span
                      key={i}
                      className={`text-sm font-mono ${step === '→' ? 'text-[#00D4FF33]' : 'font-bold text-white/70'}`}
                    >
                      {step}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="font-orbitron text-xl font-black text-[#00D4FF]">58s</p>
                    <p className="text-white/30 text-xs font-mono">E2E avg</p>
                  </div>
                  <div className="text-center">
                    <p className="font-orbitron text-xl font-black text-[#00FF94]">99.97%</p>
                    <p className="text-white/30 text-xs font-mono">uptime</p>
                  </div>
                  <div className="text-center">
                    <p className="font-orbitron text-xl font-black text-[#9B30FF]">Claude</p>
                    <p className="text-white/30 text-xs font-mono">Opus 4.7</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
