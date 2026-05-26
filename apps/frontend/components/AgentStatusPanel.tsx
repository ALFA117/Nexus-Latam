'use client';

import { useEffect, useState } from 'react';

interface AgentStatus {
  name:     string;
  role:     string;
  status:   'IDLE' | 'RUNNING' | 'ERROR';
  lastOp:   string;
  opsCount: number;
}

const AGENTS: AgentStatus[] = [
  { name: 'NexusRouter',    role: 'Enrutamiento',      status: 'IDLE',    lastOp: 'Calculó ruta MX→BR',    opsCount: 48 },
  { name: 'ComplianceAgent', role: 'KYC/AML',          status: 'RUNNING', lastOp: 'Verificando RFC...',    opsCount: 143 },
  { name: 'TradeAgent',     role: 'Cartas de Crédito', status: 'IDLE',    lastOp: 'Acuñó LC-NFT #8821',   opsCount: 92 },
  { name: 'YieldAgent',     role: 'DeFi Yield',        status: 'RUNNING', lastOp: 'Gestionando Aave pos.', opsCount: 206 },
  { name: 'AuditAgent',     role: 'Auditoría',         status: 'IDLE',    lastOp: 'Bundle #12 minted',     opsCount: 12 },
];

const STATUS_COLORS = { IDLE: '#00FF88', RUNNING: '#00D4FF', ERROR: '#FF4444' };

export function AgentStatusPanel() {
  const [agents, setAgents] = useState(AGENTS);

  // Simulate live agent activity
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev =>
        prev.map(agent => ({
          ...agent,
          opsCount: agent.status === 'RUNNING' ? agent.opsCount + 1 : agent.opsCount,
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#1A2840] rounded-xl p-4 border border-[#00D4FF22]">
      <h3 className="text-[#F7B731] text-xs font-bold uppercase tracking-wider mb-3">
        Agentes IA — Estado
      </h3>
      <div className="space-y-2">
        {agents.map(agent => (
          <div key={agent.name} className="flex items-center gap-2">
            <div
              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${agent.status === 'RUNNING' ? 'animate-pulse' : ''}`}
              style={{ backgroundColor: STATUS_COLORS[agent.status] }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between">
                <span className="text-white text-xs font-medium">{agent.name}</span>
                <span className="text-gray-500 text-xs">{agent.opsCount} ops</span>
              </div>
              <p className="text-gray-500 text-xs truncate">{agent.lastOp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
