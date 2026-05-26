'use client';

import { useEffect, useState } from 'react';

interface AgentStatus {
  name:     string;
  role:     string;
  status:   'IDLE' | 'RUNNING' | 'ERROR';
  lastOp:   string;
  opsCount: number;
  color:    string;
  icon:     string;
  load:     number;
}

const INITIAL: AgentStatus[] = [
  { name: 'NexusRouter',     role: 'Orquestador',    status: 'IDLE',    lastOp: 'Ruta MX→BR calculada',    opsCount: 48,  color: '#00D4FF', icon: '⬡', load: 22 },
  { name: 'ComplianceAgent', role: 'KYC / AML',      status: 'RUNNING', lastOp: 'Verificando RFC...',       opsCount: 143, color: '#9B30FF', icon: '◈', load: 78 },
  { name: 'TradeAgent',      role: 'Cartas Crédito', status: 'IDLE',    lastOp: 'LC-NFT #8821 acuñado',    opsCount: 92,  color: '#F7B731', icon: '◆', load: 35 },
  { name: 'YieldAgent',      role: 'Aave V3 DeFi',   status: 'RUNNING', lastOp: 'Rebalanceando posición', opsCount: 206, color: '#00FF94', icon: '⬡', load: 61 },
  { name: 'AuditAgent',      role: 'Auditoría',      status: 'IDLE',    lastOp: 'Bundle #42 sellado',       opsCount: 42,  color: '#FF6B35', icon: '◉', load: 14 },
];

const OPS_MESSAGES: Record<string, string[]> = {
  NexusRouter:     ['Ruta MX→BR calculada', 'Enrutando PSE→USDC', 'Queue: 3 ops pendientes', 'SLA < 60s OK'],
  ComplianceAgent: ['Verificando RFC...', 'Score: 891 VERIFIED', 'KYC BR completado', 'OFAC check OK'],
  TradeAgent:      ['LC-NFT #8821 acuñado', 'Escrow 0x1a2b fondado', 'Subasta LC activa', 'Settlement iniciado'],
  YieldAgent:      ['Rebalanceando posición', 'APY: 4.2% Aave V3', 'Yield distribuido: +$312', 'TVL: $842K'],
  AuditAgent:      ['Bundle #42 sellado', 'Merkle root generado', '500 txs procesadas', 'NFT IPFS pinned'],
};

export function AgentStatusPanel() {
  const [agents, setAgents] = useState(INITIAL);
  const [tick, setTick]     = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      setTick(t => t + 1);
      setAgents(prev => prev.map(a => {
        const msgs = OPS_MESSAGES[a.name];
        const running = a.status === 'RUNNING';
        return {
          ...a,
          opsCount: running ? a.opsCount + 1 : a.opsCount,
          load:     Math.max(5, Math.min(95, a.load + (Math.random() - 0.48) * 8)),
          lastOp:   running ? msgs[Math.floor(Math.random() * msgs.length)] : a.lastOp,
        };
      }));
    }, 2800);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="glass clip-corner border-[#00D4FF18] p-4 space-y-1">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#00D4FF12]">
        <span className="font-orbitron text-xs text-white/50 uppercase tracking-widest">
          Agent Monitor
        </span>
        <div className="flex items-center gap-1.5">
          <span className="status-dot status-online" />
          <span className="text-[#00FF94] text-xs font-mono">5 / 5 online</span>
        </div>
      </div>

      {/* Agent rows */}
      {agents.map((a) => (
        <div key={a.name} className="py-2.5 border-b border-[#ffffff06] last:border-0">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 mt-0.5"
              style={{ background: `${a.color}18`, border: `1px solid ${a.color}35`, color: a.color }}
            >
              {a.icon}
            </div>

            <div className="flex-1 min-w-0">
              {/* Name + status */}
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-orbitron text-xs font-bold text-white/80 tracking-wide">
                  {a.name}
                </span>
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${a.status === 'RUNNING' ? 'animate-pulse' : ''}`}
                    style={{ background: a.status === 'RUNNING' ? a.color : a.status === 'ERROR' ? '#FF3366' : '#00FF94' }}
                  />
                  <span
                    className="text-xs font-mono"
                    style={{ color: a.status === 'RUNNING' ? a.color : a.status === 'ERROR' ? '#FF3366' : '#00FF94' }}
                  >
                    {a.status}
                  </span>
                </div>
              </div>

              {/* Role + ops */}
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-white/30 text-xs font-mono">{a.role}</span>
                <span className="text-white/30 text-xs font-mono">{a.opsCount} ops</span>
              </div>

              {/* Load bar */}
              <div className="h-1 bg-[#ffffff08] rounded-full overflow-hidden mb-1.5">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${a.load}%`,
                    background: a.load > 70
                      ? `linear-gradient(90deg, ${a.color}88, #FF3366)`
                      : `linear-gradient(90deg, ${a.color}66, ${a.color})`,
                  }}
                />
              </div>

              {/* Last operation */}
              <p
                className="text-xs font-mono truncate"
                style={{ color: a.status === 'RUNNING' ? `${a.color}bb` : 'rgba(255,255,255,0.25)' }}
              >
                {a.status === 'RUNNING' ? '▶ ' : '■ '}{a.lastOp}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Footer */}
      <div className="pt-2 flex items-center justify-between">
        <span className="text-white/20 text-xs font-mono">Claude Opus 4.7</span>
        <span className="text-white/20 text-xs font-mono">
          {String(tick).padStart(4, '0')} ticks
        </span>
      </div>
    </div>
  );
}
