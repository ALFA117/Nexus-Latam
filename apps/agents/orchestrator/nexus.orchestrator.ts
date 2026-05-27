import Anthropic from '@anthropic-ai/sdk';
import * as crypto from 'crypto';
import { NexusBitsoService, LATAMCurrency }       from '../services/bitso.service';
import { RareProtocolService }                     from '../services/rare.service';
import { ArbitrumService }                         from '../services/arbitrum.service';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  defaultHeaders: { 'anthropic-beta': 'prompt-caching-2024-07-31' },
});

const NEXUS_MODEL = 'claude-sonnet-4-20250514';

export interface CreateTradeInput {
  buyer:              string;
  seller:             string;
  amountUSDC:         number;
  currency:           LATAMCurrency;
  destinationCountry: 'MX' | 'BR' | 'CO' | 'AR';
  deadlineDays:       number;
  tradeTerms?:        string;
}

export interface TradeResult {
  id:                  string;
  complianceNFT:       string;
  lcNFT:               string;
  escrowAddress:       string;
  escrowTxHash:        string;
  estimatedSettlement: string;
  totalCostBps:        number;
  yieldAPY:            string;
}

export interface RouterDecision {
  route:            string;
  reasoning:        string;
  estimatedCostBps: number;
  settlementTime:   string;
}

export interface ComplianceResult {
  approved:  boolean;
  nftId?:    string;
  score?:    number;
  tier?:     string;
  reasoning: string;
}

export class NexusOrchestrator {
  private bitso:    NexusBitsoService;
  private rare:     RareProtocolService;
  private arbitrum: ArbitrumService;

  constructor() {
    this.bitso = new NexusBitsoService(
      process.env.BITSO_API_KEY!,
      process.env.BITSO_API_SECRET!,
      process.env.NODE_ENV !== 'production',
    );
    this.rare = new RareProtocolService(
      process.env.NODE_ENV === 'production' ? 'mainnet' : 'sepolia'
    );
    this.arbitrum = new ArbitrumService(
      process.env.ARBITRUM_RPC_URL!
    );
  }

  // ─── NEXUS ROUTER AGENT ───────────────────────────────────────────────────

  async runNexusRouter(params: {
    amount:             number;
    fromCurrency:       LATAMCurrency;
    destinationCountry: 'MX' | 'BR' | 'CO' | 'AR';
    urgency:            'STANDARD' | 'EXPRESS';
  }): Promise<RouterDecision> {
    const route = await this.bitso.getOptimalRoute(
      params.amount,
      params.fromCurrency,
      params.destinationCountry,
    );

    const response = await client.messages.create({
      model:      NEXUS_MODEL,
      max_tokens: 1000,
      system: [{
        type: 'text',
        text: `Eres NexusRouter, el agente de enrutamiento del protocolo NEXUS LATAM.
Tu trabajo es analizar rutas de pago y recomendar la óptima basándote en:
- Costo total (spread FX + gas fees en Arbitrum)
- Tiempo de liquidación (SPEI/PIX = <10s, PSE/CVU = <60s)
- Disponibilidad del rail según país destino
- Urgencia de la operación
Responde SIEMPRE en JSON válido con exactamente estos campos:
{ "route": string, "reasoning": string, "estimatedCostBps": number, "settlementTime": string }`,
        cache_control: { type: 'ephemeral' },
      }],
      messages: [{
        role: 'user',
        content: `Evalúa esta ruta de pago:
Monto: ${params.amount} ${params.fromCurrency}
País destino: ${params.destinationCountry}
Urgencia: ${params.urgency}
Cotización disponible: ${JSON.stringify(route)}

Determina si esta es la ruta óptima o si hay una mejor alternativa.`,
      }],
    });

    const text = (response.content[0] as Anthropic.TextBlock).text;
    return JSON.parse(text) as RouterDecision;
  }

  // ─── COMPLIANCE AGENT ────────────────────────────────────────────────────

  async runComplianceAgent(company: {
    id:            string;
    rfc?:          string;
    cnpj?:         string;
    nit?:          string;
    country:       'MX' | 'BR' | 'CO' | 'AR';
    walletAddress: string;
  }): Promise<ComplianceResult> {
    const analysis = await client.messages.create({
      model:      NEXUS_MODEL,
      max_tokens: 800,
      system: [{
        type: 'text',
        text: `Eres ComplianceAgent de NEXUS LATAM. Analizas el riesgo de compliance de empresas
para operar en el protocolo de comercio B2B. Evalúas:
- Validez del identificador fiscal (RFC para MX, CNPJ para BR, NIT para CO)
- País de operación y nivel de riesgo regulatorio
- Señales de riesgo en la dirección de wallet (si existen)
- Score KYC: 0-500 = BÁSICO rechazado, 500-749 = BASIC, 750-899 = VERIFIED, 900-1000 = PREMIUM
Responde SIEMPRE en JSON: { "approved": boolean, "score": number, "tier": "BASIC"|"VERIFIED"|"PREMIUM", "reasoning": string }`,
        cache_control: { type: 'ephemeral' },
      }],
      messages: [{
        role: 'user',
        content: `Evalúa compliance para:
ID: ${company.id}
País: ${company.country}
RFC/CNPJ/NIT: ${company.rfc ?? company.cnpj ?? company.nit ?? 'N/A'}
Wallet: ${company.walletAddress}

Determina si puede operar en NEXUS y su nivel de confianza.`,
      }],
    });

    const result = JSON.parse((analysis.content[0] as Anthropic.TextBlock).text);

    if (!result.approved) {
      return { approved: false, reasoning: result.reasoning };
    }

    const nft = await this.rare.mintComplianceNFT(
      company.id,
      result.score,
      result.tier,
      company.country,
      this.hashData(company),
    );

    return {
      approved:  true,
      nftId:     nft.tokenId,
      score:     result.score,
      tier:      result.tier,
      reasoning: result.reasoning,
    };
  }

  // ─── TRADE AGENT ─────────────────────────────────────────────────────────

  async runTradeAgent(trade: {
    tradeId:      string;
    buyerAddress:  string;
    sellerAddress: string;
    amountUSDC:   number;
    terms:        string;
    deadlineDate: Date;
  }): Promise<{ lcNftId: string; escrowTxHash: string }> {
    const escrowTx = await this.arbitrum.createTradeEscrow({
      seller:          trade.sellerAddress,
      amountUSDC:      trade.amountUSDC,
      deadlineSeconds: Math.floor((trade.deadlineDate.getTime() - Date.now()) / 1000),
    });

    const lcNft = await this.rare.mintLetterOfCredit(
      trade.tradeId,
      trade.buyerAddress,
      trade.sellerAddress,
      trade.amountUSDC,
      'USDC',
      Math.floor(trade.deadlineDate.getTime() / 1000),
      this.hashData(trade.terms),
    );

    // Link NFT to escrow on-chain
    await this.arbitrum.setLcNft(escrowTx.tradeId, lcNft.tokenId);

    return {
      lcNftId:      lcNft.tokenId,
      escrowTxHash: escrowTx.txHash,
    };
  }

  // ─── YIELD AGENT ─────────────────────────────────────────────────────────

  async runYieldAgent(tradeId: string, amountUSDC: number, daysInEscrow: number): Promise<{
    strategy:      string;
    estimatedAPY:  number;
    estimatedYield: number;
  }> {
    let strategy:     string;
    let estimatedAPY: number;

    if (daysInEscrow < 7) {
      strategy     = 'Aave V3 Arbitrum Supply';
      estimatedAPY = 4.5;
    } else if (daysInEscrow <= 30) {
      strategy     = 'GMX Liquidity Provision';
      estimatedAPY = 10.0;
    } else {
      strategy     = 'Aave V3 + ARB Staking (split)';
      estimatedAPY = 7.5;
    }

    const estimatedYield = amountUSDC * (estimatedAPY / 100) * (daysInEscrow / 365);

    console.log(`[YieldAgent] Trade ${tradeId}: ${strategy} @ ${estimatedAPY}% APY → ~$${estimatedYield.toFixed(2)} USDC`);
    return { strategy, estimatedAPY, estimatedYield };
  }

  // ─── AUDIT AGENT ─────────────────────────────────────────────────────────

  async runAuditAgent(batchTransactions: Array<{
    tradeId:   string;
    amount:    number;
    timestamp: Date;
    txHash:    string;
  }>): Promise<{ auditNftId: string; merkleRoot: string }> {
    const merkleRoot   = this.computeMerkleRoot(batchTransactions.map(tx => tx.txHash));
    const totalVolume  = batchTransactions.reduce((sum, tx) => sum + tx.amount, 0);
    const batchNumber  = Math.floor(Date.now() / 1000);

    const auditNft = await this.rare.mintAuditBundle(
      batchNumber,
      batchTransactions.length,
      merkleRoot,
      totalVolume,
      batchTransactions[0].timestamp,
      batchTransactions[batchTransactions.length - 1].timestamp,
    );

    return { auditNftId: auditNft.tokenId, merkleRoot };
  }

  // ─── ORCHESTRATOR MAIN ────────────────────────────────────────────────────

  async createTrade(input: CreateTradeInput): Promise<TradeResult> {
    const tradeId = `NEXUS-${Date.now()}`;
    console.log(`[Orchestrator] Starting trade ${tradeId}`);

    // 1. Compliance check
    const compliance = await this.runComplianceAgent({
      id:            input.buyer,
      country:       input.destinationCountry,
      walletAddress: input.buyer,
    });
    if (!compliance.approved) {
      throw new Error(`Compliance rejected: ${compliance.reasoning}`);
    }

    // 2. Router decision
    const routerDecision = await this.runNexusRouter({
      amount:             input.amountUSDC,
      fromCurrency:       input.currency,
      destinationCountry: input.destinationCountry,
      urgency:            'STANDARD',
    });

    // 3. Trade agent: escrow + LC NFT
    const deadline = new Date(Date.now() + input.deadlineDays * 24 * 3600 * 1000);
    const tradeResult = await this.runTradeAgent({
      tradeId,
      buyerAddress:  input.buyer,
      sellerAddress: input.seller,
      amountUSDC:    input.amountUSDC,
      terms:         input.tradeTerms ?? `Trade: ${input.amountUSDC} USDC, deadline: ${deadline.toISOString()}`,
      deadlineDate:  deadline,
    });

    // 4. Yield strategy
    const yieldInfo = await this.runYieldAgent(tradeId, input.amountUSDC, input.deadlineDays);

    const result: TradeResult = {
      id:                  tradeId,
      complianceNFT:       compliance.nftId ?? 'N/A',
      lcNFT:               tradeResult.lcNftId,
      escrowAddress:       process.env.TRADE_ESCROW_ADDRESS ?? '0x...',
      escrowTxHash:        tradeResult.escrowTxHash,
      estimatedSettlement: routerDecision.settlementTime,
      totalCostBps:        routerDecision.estimatedCostBps,
      yieldAPY:            `${yieldInfo.estimatedAPY}%`,
    };
    this.tradeRegistry.set(tradeId, 'FUNDED');
    return result;
  }

  async getTradeStatus(tradeId: string): Promise<{ tradeId: string; state: string }> {
    const stateMap: Record<number, string> = {
      0: 'PENDING', 1: 'FUNDED', 2: 'DELIVERED', 3: 'SETTLED', 4: 'DISPUTED',
    };
    const stateNum = await this.arbitrum.getTradeState(tradeId);
    return { tradeId, state: stateMap[stateNum] ?? 'UNKNOWN' };
  }

  async fundTrade(tradeId: string): Promise<{ txHash: string; yieldPositionId: string }> {
    const result = await this.arbitrum.fundTrade(tradeId);
    return { txHash: result.txHash, yieldPositionId: tradeId };
  }

  async getComplianceNFT(address: string): Promise<ComplianceResult> {
    return this.runComplianceAgent({ id: address, country: 'MX', walletAddress: address });
  }

  async getFXQuote(from: string, to: string, amount: number) {
    return this.bitso.getFXQuote(from as LATAMCurrency, to as LATAMCurrency, amount);
  }

  async getAuditTrail(tradeId: string) {
    return { tradeId, events: [], message: 'Audit trail from on-chain NFTs' };
  }

  async listTrades(): Promise<{ tradeId: string; state: string }[]> {
    // Returns in-memory trade registry; replace with DB query when available
    return Array.from(this.tradeRegistry.entries()).map(([id, state]) => ({ tradeId: id, state }));
  }

  // ─── In-memory trade registry (keyed by tradeId → state) ─────────────────
  private tradeRegistry = new Map<string, string>();

  // ─── Helpers ─────────────────────────────────────────────────────────────

  private hashData(data: unknown): string {
    return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
  }

  private computeMerkleRoot(hashes: string[]): string {
    if (hashes.length === 0) return '0x0';
    if (hashes.length === 1) return hashes[0];

    let level = hashes;
    while (level.length > 1) {
      const next: string[] = [];
      for (let i = 0; i < level.length; i += 2) {
        const left  = level[i];
        const right = level[i + 1] ?? level[i];
        next.push(
          crypto.createHash('sha256').update(left + right).digest('hex')
        );
      }
      level = next;
    }
    return level[0];
  }
}
