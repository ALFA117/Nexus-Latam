'use client';

import { useState, useRef, useEffect } from 'react';

type Step = 'form' | 'compliance' | 'escrow' | 'confirmed';

interface TradeData {
  sellerAddress:      string;
  amountUSDC:         string;
  destinationCountry: string;
  deadlineDays:       string;
}

interface TradeResult {
  tradeId:       string;
  complianceNFT: string;
  lcNFT:         string;
  escrowTx:      string;
  yieldAPY:      string;
  settlement:    string;
  cost:          string;
}

interface LogLine {
  text:  string;
  type:  'info' | 'success' | 'cmd' | 'error' | 'agent';
  agent: string;
}

const AGENT_COLORS: Record<string, string> = {
  ComplianceAgent: '#9B30FF',
  TradeAgent:      '#F7B731',
  NexusRouter:     '#00D4FF',
  YieldAgent:      '#00FF94',
  AuditAgent:      '#FF6B35',
  SYSTEM:          '#ffffff44',
};

const RAILS: Record<string, string> = { MX: 'SPEI', BR: 'PIX', CO: 'PSE', AR: 'CVU', PE: 'CCI', CL: 'TEF' };

const STEPS_META = [
  { key: 'form',       label: 'Configurar',  num: 1 },
  { key: 'compliance', label: 'Compliance',  num: 2 },
  { key: 'escrow',     label: 'Escrow',      num: 3 },
  { key: 'confirmed',  label: 'Confirmado',  num: 4 },
];

function delay(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

export function TradeCreator() {
  const [step, setStep]           = useState<Step>('form');
  const [tradeData, setTradeData] = useState<TradeData>({
    sellerAddress: '', amountUSDC: '', destinationCountry: 'MX', deadlineDays: '30',
  });
  const [result, setResult]     = useState<TradeResult | null>(null);
  const [loading, setLoading]   = useState(false);
  const [logs, setLogs]         = useState<LogLine[]>([]);
  const logRef                  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  const addLog = (text: string, type: LogLine['type'] = 'info', agent = 'SYSTEM') =>
    setLogs(prev => [...prev, { text, type, agent }]);

  const createTrade = async () => {
    setLoading(true);
    setStep('compliance');
    setLogs([]);

    try {
      addLog('Iniciando protocolo NEXUS LATAM...', 'agent', 'SYSTEM');
      await delay(500);

      /* ── Compliance ───────────────────────────────────────────── */
      addLog('Verificando identidad del comprador...', 'agent', 'ComplianceAgent');
      await delay(900);
      addLog(`curl -X POST https://api.bitso.com/v3/kyc/verify -H "BITSO-AUTH: ..."`, 'cmd', 'ComplianceAgent');
      await delay(1000);
      addLog('Validando contra listas OFAC / SAT / DIAN...', 'info', 'ComplianceAgent');
      await delay(800);
      const score    = Math.floor(Math.random() * 200) + 760;
      const compNft  = Math.floor(Math.random() * 9000) + 1000;
      addLog(`✓ Score: ${score} · Tier: VERIFIED · País: ${tradeData.destinationCountry}`, 'success', 'ComplianceAgent');
      await delay(600);
      addLog(`rare mint --contract 0x... --attribute "score=${score},tier=VERIFIED,country=${tradeData.destinationCountry}"`, 'cmd', 'ComplianceAgent');
      await delay(1200);
      addLog(`✓ ComplianceNFT #${compNft} acuñado en Arbitrum Sepolia`, 'success', 'ComplianceAgent');

      setStep('escrow');
      await delay(400);

      /* ── Route ────────────────────────────────────────────────── */
      const rail = RAILS[tradeData.destinationCountry] ?? 'SPEI';
      addLog(`Calculando ruta óptima → ${rail}...`, 'agent', 'NexusRouter');
      await delay(600);
      addLog(`✓ Ruta: Arbitrum → ${rail}. ETA: <60s`, 'success', 'NexusRouter');

      /* ── Escrow ───────────────────────────────────────────────── */
      addLog(`Creando escrow en TradeEscrow.sol (Rust/Stylus)...`, 'agent', 'TradeAgent');
      await delay(900);
      const escrowAddr = `0x${Math.random().toString(16).slice(2, 12)}`;
      addLog(`TradeEscrow::create_trade(seller=0x...${tradeData.sellerAddress.slice(-4)}, amount=${tradeData.amountUSDC}_000000)`, 'cmd', 'TradeAgent');
      await delay(1000);
      addLog(`✓ Escrow ${escrowAddr}... creado · ${tradeData.amountUSDC} USDC bloqueados`, 'success', 'TradeAgent');

      /* ── LC NFT ───────────────────────────────────────────────── */
      const lcId = Math.floor(Math.random() * 9000) + 1000;
      addLog(`Acuñando Carta de Crédito NFT...`, 'agent', 'TradeAgent');
      await delay(700);
      addLog(`rare mint --name "LC-#${lcId}" --attribute "amount_usdc=${tradeData.amountUSDC},status=ACTIVE,rail=${rail}"`, 'cmd', 'TradeAgent');
      await delay(1400);
      addLog(`✓ LC-NFT #${lcId} acuñado · Subasta disponible en mercado secundario`, 'success', 'TradeAgent');

      /* ── Yield ────────────────────────────────────────────────── */
      addLog(`Depositando fondos en Aave V3 vía NexusVault...`, 'agent', 'YieldAgent');
      await delay(700);
      addLog(`NexusVault::deposit(amount=${tradeData.amountUSDC}_000000, asset=USDC)`, 'cmd', 'YieldAgent');
      await delay(800);
      addLog(`✓ APY: 4.2% · Yield se distribuirá al seller en settlement`, 'success', 'YieldAgent');

      const tradeId = `NEXUS-${Date.now().toString().slice(-6)}`;
      setResult({
        tradeId,
        complianceNFT: `#${compNft}`,
        lcNFT:         `#${lcId}`,
        escrowTx:      `${escrowAddr}...`,
        yieldAPY:      '4.2%',
        settlement:    `<60s via ${rail}`,
        cost:          '30 bps (0.3%)',
      });

      setStep('confirmed');
      addLog(`✓ OPERACIÓN ${tradeId} CREADA EXITOSAMENTE`, 'success', 'SYSTEM');
    } catch (err) {
      addLog(`ERROR: ${err}`, 'error', 'SYSTEM');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setStep('form'); setResult(null); setLogs([]); };

  const stepIdx = STEPS_META.findIndex(s => s.key === step);

  return (
    <div className="glass clip-corner border-[#00D4FF18] overflow-hidden">
      {/* Step progress bar */}
      <div className="flex border-b border-[#00D4FF12]">
        {STEPS_META.map((s, i) => {
          const active   = s.key === step;
          const done     = i < stepIdx;
          const color    = done ? '#00FF94' : active ? '#00D4FF' : '#ffffff18';
          return (
            <div
              key={s.key}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-orbitron uppercase tracking-wider transition-all"
              style={{ color, borderBottom: active ? `2px solid ${color}` : '2px solid transparent' }}
            >
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black"
                style={{ background: done ? '#00FF9430' : active ? '#00D4FF25' : 'transparent', border: `1px solid ${color}` }}
              >
                {done ? '✓' : s.num}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
          );
        })}
      </div>

      <div className="p-6">
        {/* STEP: Form */}
        {step === 'form' && (
          <div className="max-w-lg">
            <h2 className="font-orbitron text-base font-black text-[#F7B731] mb-5 uppercase tracking-wide">
              Nueva Operación Comercial
            </h2>
            <div className="space-y-4">
              {[
                { label: 'Dirección del Vendedor', key: 'sellerAddress', placeholder: '0x...', type: 'text' },
                { label: 'Monto (USDC)',            key: 'amountUSDC',   placeholder: '25000', type: 'number' },
                { label: 'Plazo (días)',             key: 'deadlineDays', placeholder: '30',    type: 'number' },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key}>
                  <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1.5">
                    {label}
                  </label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={tradeData[key as keyof TradeData]}
                    onChange={e => setTradeData({ ...tradeData, [key]: e.target.value })}
                    className="w-full bg-[#060D17] border border-[#00D4FF22] focus:border-[#00D4FF66] rounded-lg px-4 py-3 text-[#00D4FF] text-sm placeholder-white/15 focus:outline-none font-mono transition-colors clip-corner-sm"
                  />
                </div>
              ))}

              <div>
                <label className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-1.5">
                  País de Destino
                </label>
                <select
                  value={tradeData.destinationCountry}
                  onChange={e => setTradeData({ ...tradeData, destinationCountry: e.target.value })}
                  className="w-full bg-[#060D17] border border-[#00D4FF22] focus:border-[#00D4FF66] rounded-lg px-4 py-3 text-white text-sm focus:outline-none font-mono transition-colors"
                >
                  {Object.entries({ MX: 'México (SPEI)', BR: 'Brasil (PIX)', CO: 'Colombia (PSE)', AR: 'Argentina (CVU)', PE: 'Perú (CCI)', CL: 'Chile (TEF)' }).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={createTrade}
                disabled={!tradeData.sellerAddress || !tradeData.amountUSDC}
                className="btn-solid-cyan w-full py-4 disabled:opacity-40"
              >
                LANZAR PROTOCOLO →
              </button>

              <div className="grid grid-cols-3 gap-3 pt-1">
                {[
                  { v: '0.3%',  l: 'Fee protocolo' },
                  { v: '<60s',  l: 'Settlement' },
                  { v: '4.2%',  l: 'Yield APY' },
                ].map(s => (
                  <div key={s.l} className="text-center glass clip-corner-sm p-2 border-[#00D4FF12]">
                    <p className="font-orbitron text-sm font-black text-[#00D4FF]">{s.v}</p>
                    <p className="text-white/30 text-xs font-mono">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP: Processing */}
        {(step === 'compliance' || step === 'escrow') && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#00D4FF] animate-pulse" />
              <span className="font-orbitron text-sm text-[#00D4FF] uppercase tracking-wide">
                {step === 'compliance' ? 'ComplianceAgent ejecutando...' : 'TradeAgent creando escrow...'}
              </span>
            </div>
            <Terminal logs={logs} loading={loading} logRef={logRef} />
          </div>
        )}

        {/* STEP: Confirmed */}
        {step === 'confirmed' && result && (
          <div>
            <div className="flex items-center gap-2 mb-5">
              <span className="text-[#00FF94] text-lg">✓</span>
              <span className="font-orbitron text-sm text-[#00FF94] uppercase tracking-wide">
                Operación {result.tradeId} creada
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              {Object.entries(result).map(([k, v]) => (
                <div
                  key={k}
                  className="glass clip-corner-sm p-3 border-[#00D4FF15]"
                >
                  <p className="text-white/30 text-xs font-mono uppercase mb-0.5">{k}</p>
                  <p className="text-[#00D4FF] text-sm font-mono font-semibold truncate">{v}</p>
                </div>
              ))}
            </div>

            <Terminal logs={logs} loading={false} logRef={logRef} />

            <div className="flex flex-wrap gap-3 mt-4">
              <button
                onClick={reset}
                className="btn-neon text-xs py-2 px-6"
              >
                + NUEVA OPERACIÓN
              </button>
              <a
                href={`/trades/${result.tradeId}`}
                className="btn-solid-cyan text-xs py-2 px-6 inline-block"
              >
                VER OPERACIÓN →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Terminal({ logs, loading, logRef }: {
  logs: LogLine[];
  loading: boolean;
  logRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div className="terminal rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-[#00D4FF12]">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF3366]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#F7B731]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#00FF94]" />
        </div>
        <span className="text-white/25 text-xs font-mono ml-2">nexus-protocol — agent-trace</span>
        {loading && (
          <span className="ml-auto flex items-center gap-1.5 text-xs font-mono text-[#00D4FF]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" />
            RUNNING
          </span>
        )}
      </div>

      {/* Log output */}
      <div ref={logRef} className="p-4 space-y-1 max-h-64 overflow-y-auto">
        {logs.map((line, i) => {
          const agentColor = AGENT_COLORS[line.agent] ?? '#00D4FF';
          return (
            <div key={i} className="flex gap-2 text-xs font-mono leading-relaxed">
              <span className="text-white/15 select-none shrink-0">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="shrink-0 font-bold" style={{ color: agentColor }}>
                [{line.agent}]
              </span>
              <span
                style={{
                  color: line.type === 'success' ? '#00FF94'
                       : line.type === 'cmd'     ? '#F7B731'
                       : line.type === 'error'   ? '#FF3366'
                       : 'rgba(255,255,255,0.55)',
                }}
              >
                {line.text}
              </span>
            </div>
          );
        })}
        {loading && (
          <div className="flex gap-2 text-xs font-mono">
            <span className="text-white/15">··</span>
            <span className="text-[#00D4FF] blink">█</span>
          </div>
        )}
      </div>
    </div>
  );
}
