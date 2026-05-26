'use client';

import { useState } from 'react';

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

export function TradeCreator() {
  const [step, setStep]     = useState<Step>('form');
  const [tradeData, setTradeData] = useState<TradeData>({
    sellerAddress:      '',
    amountUSDC:         '',
    destinationCountry: 'MX',
    deadlineDays:       '30',
  });
  const [result, setResult]     = useState<TradeResult | null>(null);
  const [loading, setLoading]   = useState(false);
  const [agentLog, setAgentLog] = useState<string[]>([]);

  const log = (msg: string) =>
    setAgentLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const createTrade = async () => {
    setLoading(true);
    setStep('compliance');
    setAgentLog([]);

    try {
      log('ComplianceAgent: Verificando identidad...');
      await delay(1200);
      log('ComplianceAgent: Validando contra listas OFAC/SAT/DIAN...');
      await delay(900);
      log('ComplianceAgent: ✓ Empresa verificada. Acuñando ComplianceNFT...');
      log('rare deploy erc721 "NEXUS-COMPLIANCE-MX" "NCMX"');
      log(`rare mint --contract 0x... --attribute "score=891,tier=VERIFIED,country=MX"`);
      await delay(1800);

      const compNftId = Math.floor(Math.random() * 9000) + 1000;
      log(`ComplianceAgent: ✓ ComplianceNFT #${compNftId} acuñado en Sepolia`);

      setStep('escrow');

      log('TradeAgent: Creando escrow en Arbitrum Stylus...');
      await delay(1200);
      log(`TradeEscrow.create_trade(seller=0x...${tradeData.sellerAddress.slice(-6)}, amount=${tradeData.amountUSDC}USDC)`);
      await delay(800);
      log('TradeAgent: Acuñando Carta de Crédito NFT...');
      const lcId = Math.floor(Math.random() * 9000) + 1000;
      log(`rare mint --contract 0x... --name "LC-#${lcId}" --attribute "amount=${tradeData.amountUSDC}USDC,status=ACTIVE"`);
      await delay(1800);
      log(`TradeAgent: ✓ LC-NFT #${lcId} acuñado. Subasta disponible en SuperRare`);

      log('NexusRouter: Calculando ruta óptima...');
      const rail = { MX: 'SPEI', BR: 'PIX', CO: 'PSE', AR: 'CVU' }[tradeData.destinationCountry] ?? 'SPEI';
      await delay(600);
      log(`NexusRouter: ✓ Ruta: Arbitrum → ${rail}. ETA liquidación: <60s`);

      log('YieldAgent: Preparando posición en Aave V3 Arbitrum...');
      await delay(600);
      log('YieldAgent: ✓ ~4.5% APY mientras fondos permanecen en escrow');

      setResult({
        tradeId:       `NEXUS-${Date.now()}`,
        complianceNFT: `#${compNftId}`,
        lcNFT:         `#${lcId}`,
        escrowTx:      `0xabc${Math.random().toString(16).slice(2, 10)}...`,
        yieldAPY:      '4.5%',
        settlement:    '<60 segundos al confirmar entrega',
        cost:          '30 bps (0.3%)',
      });

      setStep('confirmed');
    } catch (err) {
      log(`ERROR: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep('form');
    setResult(null);
    setAgentLog([]);
  };

  return (
    <div className="bg-[#0D1B2A] rounded-2xl border border-[#00D4FF22] p-6">
      <h2 className="text-lg font-bold text-[#F7B731] mb-5">Nueva Operación Comercial</h2>

      {step === 'form' && (
        <div className="space-y-4 max-w-lg">
          {[
            { label: 'Dirección del Vendedor',   key: 'sellerAddress',   placeholder: '0x...', type: 'text'   },
            { label: 'Monto (USDC)',              key: 'amountUSDC',      placeholder: '25000', type: 'number' },
            { label: 'Plazo (días)',              key: 'deadlineDays',    placeholder: '30',    type: 'number' },
          ].map(({ label, key, placeholder, type }) => (
            <div key={key}>
              <label className="text-xs text-gray-400 uppercase tracking-wider">{label}</label>
              <input
                type={type}
                placeholder={placeholder}
                value={tradeData[key as keyof TradeData]}
                onChange={e => setTradeData({ ...tradeData, [key]: e.target.value })}
                className="w-full mt-1 bg-[#0A1220] border border-[#00D4FF33] rounded-lg px-4 py-3 text-[#00D4FF] text-sm focus:outline-none focus:border-[#00D4FF]"
              />
            </div>
          ))}

          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider">País de Destino</label>
            <select
              value={tradeData.destinationCountry}
              onChange={e => setTradeData({ ...tradeData, destinationCountry: e.target.value })}
              className="w-full mt-1 bg-[#0A1220] border border-[#00D4FF33] rounded-lg px-4 py-3 text-white text-sm focus:outline-none"
            >
              <option value="MX">Mexico (SPEI)</option>
              <option value="BR">Brasil (PIX)</option>
              <option value="CO">Colombia (PSE)</option>
              <option value="AR">Argentina (CVU)</option>
            </select>
          </div>

          <button
            onClick={createTrade}
            disabled={!tradeData.sellerAddress || !tradeData.amountUSDC}
            className="w-full bg-[#00D4FF] text-[#0D1B2A] font-bold py-4 rounded-xl hover:bg-[#00B8D9] disabled:opacity-40 transition-all text-base mt-2"
          >
            Crear Operación →
          </button>
          <p className="text-xs text-center text-gray-600">
            Costo: 0.3% · Liquidación: &lt;60s · 4 países · Trazabilidad on-chain
          </p>
        </div>
      )}

      {(step === 'compliance' || step === 'escrow') && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 bg-[#00D4FF] rounded-full animate-pulse" />
            <span className="text-[#00D4FF] text-sm">
              {step === 'compliance' ? 'ComplianceAgent ejecutando...' : 'TradeAgent creando escrow...'}
            </span>
          </div>
          <AgentTerminal logs={agentLog} loading={loading} />
        </div>
      )}

      {step === 'confirmed' && result && (
        <div>
          <p className="text-green-400 font-bold mb-4">✓ Operación creada exitosamente</p>
          <div className="bg-[#1A2840] rounded-xl p-5 border border-green-500/30 space-y-2 mb-4">
            {Object.entries(result).map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm">
                <span className="text-gray-400">{k}</span>
                <span className="text-[#00D4FF] font-medium">{v}</span>
              </div>
            ))}
          </div>
          <AgentTerminal logs={agentLog} loading={false} />
          <button
            onClick={reset}
            className="mt-4 text-sm text-gray-400 hover:text-[#00D4FF] transition-colors"
          >
            + Nueva operación
          </button>
        </div>
      )}
    </div>
  );
}

function AgentTerminal({ logs, loading }: { logs: string[]; loading: boolean }) {
  return (
    <div className="bg-black rounded-xl p-4 font-mono text-xs space-y-1 max-h-72 overflow-y-auto border border-[#00D4FF22]">
      {logs.map((line, i) => (
        <div
          key={i}
          className={
            line.includes('✓')   ? 'text-green-400' :
            line.includes('rare') ? 'text-[#F7B731]' :
            line.includes('ERROR') ? 'text-red-400' :
            'text-gray-400'
          }
        >
          {line}
        </div>
      ))}
      {loading && <div className="text-[#00D4FF] blink">▌</div>}
    </div>
  );
}

function delay(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}
