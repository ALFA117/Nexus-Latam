'use client';

import { useState, useEffect, useRef } from 'react';
import { Navbar } from '../../components/Navbar';
import Link from 'next/link';

const AGENTS = [
  {
    id: 'router',
    name: 'NEXUS ROUTER',
    role: 'Orquestador Principal',
    color: '#00D4FF',
    icon: '⬡',
    level: 99,
    model: 'claude-opus-4-7',
    thinking: 'adaptive',
    description:
      'Punto de entrada único del protocolo. Clasifica cada solicitud entrante, decide qué agentes activar y en qué orden, y gestiona la cola de prioridad de operaciones en tiempo real.',
    tools: [
      { name: 'classify_request',  desc: 'Clasifica tipo de operación (LC, pago, consulta KYC)' },
      { name: 'route_to_agent',    desc: 'Despacha al agente especializado correcto' },
      { name: 'check_sla',         desc: 'Verifica SLA < 60s en cada paso' },
      { name: 'priority_queue',    desc: 'Gestiona la cola de operaciones por urgencia' },
    ],
    metrics: { processed: '48,291', uptime: '99.97%', latency: '12ms', errors: '0.03%' },
    prompt: `Eres NexusRouter, el orquestador central de NEXUS LATAM.
Tu misión: clasificar solicitudes B2B y coordinar los agentes especializados
para liquidar operaciones en < 60 segundos. Siempre verifica compliance primero.`,
    skills: ['Routing', 'Load Balancing', 'Orchestration', 'Priority Queue'],
    connects: ['ComplianceAgent', 'TradeAgent', 'YieldAgent', 'AuditAgent'],
    caching: '$0.30/1M tokens',
    xp: 92,
  },
  {
    id: 'compliance',
    name: 'COMPLIANCE AGENT',
    role: 'Verificación KYC/AML',
    color: '#9B30FF',
    icon: '◈',
    level: 87,
    model: 'claude-opus-4-7',
    thinking: 'adaptive',
    description:
      'Ejecuta KYC/AML completo via Bitso Business API con HMAC-SHA256. Valida contra listas OFAC, SAT y DIAN. Acuña un ComplianceNFT en Arbitrum con score (0-1000), tier y vigencia.',
    tools: [
      { name: 'bitso_kyc_verify',  desc: 'POST /v3/kyc/verify con HMAC-SHA256 auth' },
      { name: 'ofac_check',        desc: 'Cruza contra lista OFAC/SAT/DIAN en tiempo real' },
      { name: 'mint_compliance_nft', desc: 'rare mint --contract 0x... con atributos on-chain' },
      { name: 'score_risk',        desc: 'Calcula risk score 0-1000 con modelo propietario' },
    ],
    metrics: { verified: '12,441', nfts: '12,441', accuracy: '99.2%', avg_score: '847' },
    prompt: `Eres ComplianceAgent de NEXUS LATAM.
Tu misión: verificar KYC/AML de compradores y vendedores usando Bitso Business API.
Si el score >= 700: acuña ComplianceNFT VERIFIED. Si < 500: rechaza la operación.
FATF compliance obligatorio en cada transacción.`,
    skills: ['KYC/AML', 'NFT Minting', 'Risk Scoring', 'FATF Compliance'],
    connects: ['NexusRouter', 'TradeAgent'],
    caching: '$0.30/1M tokens',
    xp: 78,
  },
  {
    id: 'trade',
    name: 'TRADE AGENT',
    role: 'Cartas de Crédito & LC',
    color: '#F7B731',
    icon: '◆',
    level: 94,
    model: 'claude-opus-4-7',
    thinking: 'adaptive',
    description:
      'Emite Cartas de Crédito programables como NFTs (LC-NFTs) transferibles. Gestiona el escrow on-chain en TradeEscrow.sol (Rust/Stylus) y liquida cuando se confirma la entrega del bien.',
    tools: [
      { name: 'create_escrow',     desc: 'TradeEscrow::create_trade() en Arbitrum Stylus' },
      { name: 'mint_lc_nft',       desc: 'Acuña LC-NFT con monto, ruta y condiciones' },
      { name: 'confirm_delivery',  desc: 'Verifica entrega y libera fondos del escrow' },
      { name: 'bitso_fx_quote',    desc: 'Obtiene cotización FX USDC→FIAT via Bitso' },
    ],
    metrics: { volume: '$1.2M', lcs: '891', settled: '99.1%', avg_time: '58s' },
    prompt: `Eres TradeAgent de NEXUS LATAM.
Tu misión: emitir Cartas de Crédito programables y gestionar escrow on-chain.
Verifica compliance ANTES de crear cualquier escrow. El LC-NFT es transferible
en mercado secundario. Settlement automático al confirmar entrega.`,
    skills: ['Letter of Credit', 'Escrow Mgmt', 'LC-NFT Mint', 'Settlement'],
    connects: ['NexusRouter', 'ComplianceAgent', 'YieldAgent'],
    caching: '$0.30/1M tokens',
    xp: 88,
  },
  {
    id: 'yield',
    name: 'YIELD AGENT',
    role: 'Optimización de Rendimiento',
    color: '#00FF94',
    icon: '⬡',
    level: 78,
    model: 'claude-opus-4-7',
    thinking: 'adaptive',
    description:
      'Deposita los fondos en escrow en Aave V3 vía NexusVault.sol mientras dura la operación. Distribuye automáticamente el yield al seller (80%) y al protocolo (20%) en el momento del settlement.',
    tools: [
      { name: 'vault_deposit',     desc: 'NexusVault::deposit(amount, asset=USDC) en Aave V3' },
      { name: 'get_apy',           desc: 'Consulta APY actual de Aave V3 USDC pool' },
      { name: 'calculate_yield',   desc: 'Calcula yield acumulado por posición' },
      { name: 'distribute_yield',  desc: 'Split 80/20 seller/protocolo al settlement' },
    ],
    metrics: { tvl: '$842K', apy: '4.2%', earned: '$32,104', positions: '4 activas' },
    prompt: `Eres YieldAgent de NEXUS LATAM.
Tu misión: maximizar el rendimiento de los fondos en escrow via Aave V3.
Deposita USDC inmediatamente al crear el escrow. Al settlement, calcula el yield
exacto y distribúyelo: 80% al seller, 20% al protocolo. APY target: > 3.5%.`,
    skills: ['Aave V3', 'Yield Farming', 'Auto-compound', 'Risk Mgmt'],
    connects: ['TradeAgent', 'NexusRouter'],
    caching: '$0.30/1M tokens',
    xp: 65,
  },
  {
    id: 'audit',
    name: 'AUDIT AGENT',
    role: 'Trazabilidad & Reportes',
    color: '#FF6B35',
    icon: '◉',
    level: 85,
    model: 'claude-opus-4-7',
    thinking: 'adaptive',
    description:
      'Genera bundles de auditoría con árbol Merkle SHA-256 por cada 500 transacciones. Acuña un Audit-NFT en Arbitrum con hash inmutable y lo pina en IPFS para trazabilidad permanente.',
    tools: [
      { name: 'build_merkle_tree', desc: 'Construye árbol Merkle de 500 transacciones' },
      { name: 'mint_audit_nft',    desc: 'Acuña Audit-NFT con merkle_root + metadata IPFS' },
      { name: 'pin_ipfs',          desc: 'Pina metadata del bundle en IPFS' },
      { name: 'generate_report',   desc: 'Genera reporte PDF de auditoría descargable' },
    ],
    metrics: { bundles: '42', transactions: '21,000+', volume: '$24.5M', uptime: '100%' },
    prompt: `Eres AuditAgent de NEXUS LATAM.
Tu misión: mantener trazabilidad inmutable de TODAS las operaciones.
Cada 500 transacciones: construye Merkle tree, acuña Audit-NFT, pina en IPFS.
Los datos de auditoría son permanentes e inalterables en Arbitrum.`,
    skills: ['Merkle Tree', 'Audit NFT', 'Batch Reports', 'Compliance Logs'],
    connects: ['NexusRouter'],
    caching: '$0.30/1M tokens',
    xp: 71,
  },
];

const FLOW_STEPS = [
  { agent: 'NexusRouter',     color: '#00D4FF', action: 'Clasifica solicitud y verifica SLA' },
  { agent: 'ComplianceAgent', color: '#9B30FF', action: 'KYC/AML → acuña ComplianceNFT' },
  { agent: 'NexusRouter',     color: '#00D4FF', action: 'Calcula ruta óptima FIAT→USDC' },
  { agent: 'TradeAgent',      color: '#F7B731', action: 'Crea escrow + acuña LC-NFT' },
  { agent: 'YieldAgent',      color: '#00FF94', action: 'Deposita USDC en Aave V3' },
  { agent: 'TradeAgent',      color: '#F7B731', action: 'Confirma entrega → settlement' },
  { agent: 'YieldAgent',      color: '#00FF94', action: 'Distribuye yield 80/20' },
  { agent: 'AuditAgent',      color: '#FF6B35', action: 'Acuña Audit-NFT + Merkle root' },
];

export default function AgentsPage() {
  const [selected, setSelected] = useState<string>('router');
  const agent = AGENTS.find(a => a.id === selected)!;

  return (
    <div className="min-h-screen bg-[#060D17] text-white grid-bg">
      <Navbar />

      <div className="page-inner px-4 sm:px-6 max-w-7xl mx-auto pb-16">
        {/* Header */}
        <div className="py-8 border-b border-[#9B30FF20]">
          <Link href="/" className="text-white/30 text-xs font-mono hover:text-[#9B30FF] transition-colors">
            ← NEXUS LATAM
          </Link>
          <div className="flex flex-wrap items-end justify-between gap-3 mt-2">
            <div>
              <h1 className="font-orbitron text-2xl sm:text-3xl font-black">
                INTELLIGENCE <span className="gradient-text-cyan">LAYER</span>
              </h1>
              <p className="text-white/40 text-xs font-mono mt-1">
                5 agentes autónomos · Claude Opus 4.7 · Adaptive Thinking · Prompt Caching
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="font-orbitron text-lg font-black text-[#9B30FF]">5</p>
                <p className="text-white/30 text-xs font-mono">Agentes</p>
              </div>
              <div className="text-center">
                <p className="font-orbitron text-lg font-black text-[#00D4FF]">Opus 4.7</p>
                <p className="text-white/30 text-xs font-mono">Modelo</p>
              </div>
              <div className="text-center">
                <p className="font-orbitron text-lg font-black text-[#00FF94]">$0.30</p>
                <p className="text-white/30 text-xs font-mono">/1M tokens cache</p>
              </div>
            </div>
          </div>
        </div>

        {/* Agent selector tabs */}
        <div className="flex gap-1 overflow-x-auto scroll-x py-4 border-b border-[#ffffff08]">
          {AGENTS.map(a => (
            <button
              key={a.id}
              onClick={() => setSelected(a.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-orbitron font-bold uppercase tracking-wide whitespace-nowrap transition-all shrink-0"
              style={{
                background:  selected === a.id ? `${a.color}20` : 'transparent',
                color:       selected === a.id ? a.color : 'rgba(255,255,255,0.35)',
                border:      `1px solid ${selected === a.id ? `${a.color}50` : 'rgba(255,255,255,0.08)'}`,
              }}
            >
              <span>{a.icon}</span>
              <span className="hidden sm:inline">{a.name}</span>
              <span className="sm:hidden">
                {a.name.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>

        {/* Agent detail */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left: main info */}
          <div className="lg:col-span-2 space-y-4">
            {/* Agent card header */}
            <div
              className="glass clip-corner p-6"
              style={{ borderColor: `${agent.color}30`, boxShadow: `0 0 40px ${agent.color}10` }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl shrink-0"
                  style={{ background: `${agent.color}15`, border: `2px solid ${agent.color}40`, color: agent.color }}
                >
                  {agent.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h2 className="font-orbitron text-xl font-black" style={{ color: agent.color }}>
                      {agent.name}
                    </h2>
                    <span
                      className="clip-corner-sm text-xs font-orbitron px-2 py-0.5"
                      style={{ color: '#00FF94', background: '#00FF9415', border: '1px solid #00FF9430' }}
                    >
                      LVL {agent.level}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-mono text-[#00FF94]">
                      <span className="status-dot status-online" />
                      ONLINE
                    </span>
                  </div>
                  <p className="text-white/50 text-xs font-mono uppercase tracking-widest mb-2">
                    {agent.role}
                  </p>
                  <p className="text-white/60 text-sm leading-relaxed">{agent.description}</p>
                </div>
              </div>

              {/* XP bar */}
              <div className="flex items-center gap-3">
                <span className="text-white/30 text-xs font-mono w-6">XP</span>
                <div className="flex-1 progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${agent.xp}%`,
                      background: `linear-gradient(90deg, ${agent.color}88, ${agent.color})`,
                    }}
                  />
                </div>
                <span className="text-xs font-mono font-bold" style={{ color: agent.color }}>
                  {agent.xp}%
                </span>
              </div>
            </div>

            {/* Tools */}
            <div className="glass clip-corner p-5" style={{ borderColor: `${agent.color}18` }}>
              <p className="font-orbitron text-xs uppercase tracking-widest mb-4" style={{ color: agent.color }}>
                Herramientas (Tool Use)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {agent.tools.map(tool => (
                  <div
                    key={tool.name}
                    className="rounded-lg p-3"
                    style={{ background: `${agent.color}08`, border: `1px solid ${agent.color}20` }}
                  >
                    <p className="font-mono text-xs font-bold mb-1" style={{ color: agent.color }}>
                      {tool.name}()
                    </p>
                    <p className="text-white/40 text-xs font-mono leading-relaxed">{tool.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* System prompt preview */}
            <div className="terminal rounded-lg overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#00D4FF12]">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF3366]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#F7B731]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00FF94]" />
                </div>
                <span className="text-white/25 text-xs font-mono ml-2">system_prompt.txt</span>
                <span
                  className="ml-auto text-xs font-mono clip-corner-sm px-2 py-0.5"
                  style={{ color: agent.color, background: `${agent.color}15`, border: `1px solid ${agent.color}30` }}
                >
                  {agent.model}
                </span>
              </div>
              <pre className="p-4 text-xs font-mono leading-relaxed whitespace-pre-wrap"
                style={{ color: `${agent.color}cc` }}>
                {agent.prompt}
              </pre>
            </div>
          </div>

          {/* Right: metrics + config */}
          <div className="space-y-4">
            {/* Metrics */}
            <div className="glass clip-corner p-4" style={{ borderColor: `${agent.color}20` }}>
              <p className="font-orbitron text-xs uppercase tracking-widest mb-4 text-white/40">
                Métricas en Vivo
              </p>
              <div className="space-y-3">
                {Object.entries(agent.metrics).map(([k, v]) => (
                  <div key={k} className="flex justify-between items-center">
                    <span className="text-white/35 text-xs font-mono uppercase">{k}</span>
                    <span className="font-orbitron text-sm font-bold" style={{ color: agent.color }}>
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Config */}
            <div className="glass clip-corner p-4" style={{ borderColor: `${agent.color}20` }}>
              <p className="font-orbitron text-xs uppercase tracking-widest mb-4 text-white/40">
                Configuración Claude
              </p>
              <div className="space-y-2.5 text-xs font-mono">
                {[
                  { k: 'model',    v: agent.model },
                  { k: 'thinking', v: agent.thinking },
                  { k: 'caching',  v: agent.caching },
                  { k: 'effort',   v: 'xhigh' },
                  { k: 'stream',   v: 'true (SSE)' },
                ].map(({ k, v }) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-white/30">{k}:</span>
                    <span style={{ color: agent.color }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="glass clip-corner p-4" style={{ borderColor: `${agent.color}20` }}>
              <p className="font-orbitron text-xs uppercase tracking-widest mb-3 text-white/40">
                Skills
              </p>
              <div className="flex flex-wrap gap-1.5">
                {agent.skills.map(sk => (
                  <span
                    key={sk}
                    className="clip-corner-sm text-xs font-mono px-2.5 py-1"
                    style={{ color: agent.color, background: `${agent.color}10`, border: `1px solid ${agent.color}30` }}
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Connections */}
            <div className="glass clip-corner p-4" style={{ borderColor: `${agent.color}20` }}>
              <p className="font-orbitron text-xs uppercase tracking-widest mb-3 text-white/40">
                Se comunica con
              </p>
              <div className="space-y-1.5">
                {agent.connects.map(c => {
                  const connected = AGENTS.find(a => a.name === c);
                  return (
                    <div key={c} className="flex items-center gap-2 text-xs font-mono">
                      <span style={{ color: connected?.color ?? '#fff' }}>
                        {connected?.icon}
                      </span>
                      <span className="text-white/55">{c}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Operation flow */}
        <div className="mt-10">
          <p className="font-orbitron text-xs text-white/30 uppercase tracking-widest mb-4 text-center">
            Flujo de Orquestación · Operación Completa
          </p>
          <div className="glass clip-corner-lg p-5 border-[#00D4FF12]">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {FLOW_STEPS.map((s, i) => (
                <div key={i} className="text-center">
                  <div
                    className="w-8 h-8 rounded-lg mx-auto mb-1.5 flex items-center justify-center text-xs font-orbitron font-black"
                    style={{ background: `${s.color}20`, border: `1px solid ${s.color}40`, color: s.color }}
                  >
                    {i + 1}
                  </div>
                  <p className="text-xs font-orbitron font-bold mb-1" style={{ color: s.color }}>
                    {s.agent.replace('Agent', '').replace('Nexus', 'NX')}
                  </p>
                  <p className="text-white/35 text-xs font-mono leading-tight">{s.action}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-[#00D4FF10] flex flex-wrap items-center justify-center gap-6 text-center">
              <div>
                <p className="font-orbitron text-lg font-black text-[#F7B731]">&lt; 60s</p>
                <p className="text-white/30 text-xs font-mono">End-to-end</p>
              </div>
              <div>
                <p className="font-orbitron text-lg font-black text-[#9B30FF]">Claude Opus 4.7</p>
                <p className="text-white/30 text-xs font-mono">Modelo base</p>
              </div>
              <div>
                <p className="font-orbitron text-lg font-black text-[#00FF94]">$0.30/1M</p>
                <p className="text-white/30 text-xs font-mono">Con prompt caching</p>
              </div>
              <div>
                <p className="font-orbitron text-lg font-black text-[#00D4FF]">Adaptive</p>
                <p className="text-white/30 text-xs font-mono">Thinking mode</p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive query panel */}
        <AgentQueryPanel agent={agent} />

        {/* CTA */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
          <Link href="/demo">
            <button className="btn-solid-cyan text-sm px-8 py-3">
              ▶ VER DEMO
            </button>
          </Link>
          <Link href="/trades">
            <button className="btn-neon text-sm px-8 py-3">
              COMMAND CENTER
            </button>
          </Link>
          <Link href="/pitch">
            <button className="text-white/40 hover:text-white/60 text-sm font-mono transition-colors border border-white/10 hover:border-white/20 px-6 py-3 rounded">
              PITCH DECK
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Interactive Query Panel ──────────────────────────────────────── */
const SAMPLE_QUERIES: Record<string, string[]> = {
  router:     ['¿Cuántas operaciones están en cola ahora?', 'Ruta óptima para pago $50K MX→AR', '¿Qué agente maneja disputas?'],
  compliance: ['¿Cuál es el score mínimo para VERIFIED?', 'Verificar wallet 0x1a2b3c...', '¿Qué datos requiere el KYC?'],
  trade:      ['¿Cuánto cuesta crear un escrow?', 'Estado del LC-NFT #8821', '¿Qué ocurre si expira el plazo?'],
  yield:      ['¿Cuál es el APY actual en Aave V3?', 'Proyección de yield a 30 días por $25K', '¿Cuándo se distribuye el yield?'],
  audit:      ['¿Cuántas transacciones faltan para el Bundle #43?', '¿Cómo verificar el Merkle root?', 'Historial de auditoría de NEXUS-8821'],
};

const MOCK_RESPONSES: Record<string, string[]> = {
  router: [
    'Hay 3 operaciones en cola ahora. Prioridad: 2 FUNDED esperando confirm_delivery, 1 PENDING en compliance. ETA máximo: 58s.',
    'Ruta calculada: Arbitrum USDC → Bitso FX MX/AR → CVU BRL. Fee: 0.3% (30 bps). ETA estimado: <45s. Aprobado ✓',
    'Las disputas las maneja TradeAgent con asistencia del NexusOrchestrator. Se activa cuando confirm_delivery no llega antes del deadline.',
  ],
  compliance: [
    'Score mínimo para VERIFIED: 700/1000. Para PREMIUM se requiere ≥900 + due diligence avanzado. BASIC acepta 500-699 con límite $5K/op.',
    'Iniciando KYC para 0x1a2b3c... Verificando contra OFAC, SAT, DIAN. Procesando... Score: 891 · Tier: VERIFIED ✓ ComplianceNFT listo.',
    'KYC requiere: wallet address + empresa registrada + RFC/CNPJ/NIT según país + dirección fiscal. Todo on-chain con encriptación HMAC-SHA256.',
  ],
  trade: [
    'Crear un escrow cuesta 0.3% del monto (30 bps). Ejemplo: $25,000 USDC → fee $75 USDC. Gas en Arbitrum: ~$0.02. Total real: $75.02.',
    'LC-NFT #8821: SETTLED ✓ — $25,000 USDC liquidados en 58s via SPEI. Yield generado: +$312 USDC. Audit: Bundle #42.',
    'Si el plazo expira sin confirm_delivery, el escrow entra en DISPUTED. TradeAgent notifica a ambas partes y escala al NexusOrchestrator.',
  ],
  yield: [
    'APY actual en Aave V3 Arbitrum pool USDC: 4.2%. Este dato se actualiza en tiempo real cada 15 minutos via NexusVault.getAPY().',
    'Proyección para $25,000 USDC a 30 días al 4.2% APY: +$86.30 USDC. Split: $69.04 al seller (80%) + $17.26 al protocolo (20%).',
    'El yield se distribuye automáticamente cuando TradeAgent ejecuta release_funds() en el settlement. Sin acción manual requerida.',
  ],
  audit: [
    'Bundle #43 tiene 87/500 transacciones. Al llegar a 500, AuditAgent genera el Merkle root SHA-256 y acuña el Audit-NFT automáticamente.',
    'Para verificar el Merkle root: keccak256(merkle_root) debe coincidir con el tokenURI del Audit-NFT en Arbitrum. Verificable on-chain.',
    'Historial NEXUS-8821: Step 1→NexusRouter 14:32:01, Step 2→ComplianceAgent 14:32:21 (score 891), Step 9→Settlement 14:33:29. Total: 58s.',
  ],
};

function AgentQueryPanel({ agent }: { agent: { id: string; color: string; name: string; icon: string } }) {
  const [query, setQuery]     = useState('');
  const [response, setResp]   = useState('');
  const [typing, setTyping]   = useState(false);
  const [displayed, setDisp]  = useState('');
  const timerRef              = useRef<ReturnType<typeof setTimeout> | null>(null);

  const samples = SAMPLE_QUERIES[agent.id] ?? [];
  const responses = MOCK_RESPONSES[agent.id] ?? [];

  const sendQuery = (q: string) => {
    if (!q.trim() || typing) return;
    const resp = responses[Math.floor(Math.random() * responses.length)];
    setQuery(q);
    setResp('');
    setDisp('');
    setTyping(true);

    let i = 0;
    const tick = () => {
      if (i <= resp.length) {
        setDisp(resp.slice(0, i));
        i++;
        timerRef.current = setTimeout(tick, 18);
      } else {
        setTyping(false);
        setResp(resp);
      }
    };
    tick();
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <div className="mt-10 glass clip-corner-lg p-6" style={{ borderColor: `${agent.color}25` }}>
      <div className="flex items-center gap-3 mb-5">
        <span className="text-xl" style={{ color: agent.color }}>{agent.icon}</span>
        <div>
          <p className="font-orbitron text-sm font-black" style={{ color: agent.color }}>
            Consultar {agent.name}
          </p>
          <p className="text-white/35 text-xs font-mono">Simulación de respuesta del agente</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: agent.color }} />
          <span className="text-xs font-mono" style={{ color: agent.color }}>ONLINE</span>
        </div>
      </div>

      {/* Sample queries */}
      <div className="flex flex-wrap gap-2 mb-4">
        {samples.map((s) => (
          <button
            key={s}
            onClick={() => sendQuery(s)}
            className="text-xs font-mono px-3 py-1.5 rounded-lg transition-all hover:scale-105"
            style={{
              background: `${agent.color}10`,
              border:     `1px solid ${agent.color}30`,
              color:      `${agent.color}cc`,
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendQuery(query)}
          placeholder={`Pregunta a ${agent.name}...`}
          className="flex-1 bg-[#060D17] rounded-lg px-4 py-2.5 text-white/70 text-xs placeholder-white/20 focus:outline-none font-mono transition-colors"
          style={{ border: `1px solid ${agent.color}25` }}
        />
        <button
          onClick={() => sendQuery(query)}
          disabled={typing || !query.trim()}
          className="px-5 py-2.5 rounded-lg text-xs font-orbitron font-black transition-all disabled:opacity-40"
          style={{ background: `${agent.color}25`, color: agent.color, border: `1px solid ${agent.color}50` }}
        >
          SEND
        </button>
      </div>

      {/* Response */}
      {(displayed || typing) && (
        <div
          className="terminal rounded-lg p-4 text-xs font-mono leading-relaxed"
          style={{ borderColor: `${agent.color}25` }}
        >
          <div className="flex items-center gap-2 mb-2 pb-2 border-b" style={{ borderColor: `${agent.color}20` }}>
            <span style={{ color: agent.color }}>[{agent.name}]</span>
            <span className="text-white/25">→ respuesta</span>
            {typing && <span className="ml-auto text-xs font-mono animate-pulse" style={{ color: agent.color }}>typing...</span>}
          </div>
          <p style={{ color: `${agent.color}cc` }}>
            {displayed}
            {typing && <span className="blink text-white/60">█</span>}
          </p>
        </div>
      )}
    </div>
  );
}
