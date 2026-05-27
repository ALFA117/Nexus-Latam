import { Router, Request, Response, NextFunction } from 'express';
import { NexusOrchestrator } from '../../agents/orchestrator/nexus.orchestrator';

const router    = Router();
const orchestrator = new NexusOrchestrator();

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
  return (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);
}

// POST /api/v1/trades — Crear operación comercial
router.post('/trades', asyncHandler(async (req, res) => {
  const { buyerAddress, sellerAddress, amount, currency, destinationCountry, deadline, terms } = req.body;

  if (!buyerAddress || !sellerAddress || !amount || !currency || !destinationCountry) {
    res.status(400).json({ error: 'Missing required fields: buyerAddress, sellerAddress, amount, currency, destinationCountry' });
    return;
  }

  const trade = await orchestrator.createTrade({
    buyer:              buyerAddress,
    seller:             sellerAddress,
    amountUSDC:         Number(amount),
    currency,
    destinationCountry,
    deadlineDays:       Number(deadline ?? 30),
    tradeTerms:         terms,
  });

  res.status(201).json({
    tradeId:             trade.id,
    complianceNFT:       trade.complianceNFT,
    lcNFT:               trade.lcNFT,
    escrowAddress:       trade.escrowAddress,
    escrowTxHash:        trade.escrowTxHash,
    estimatedSettlement: trade.estimatedSettlement,
    totalCost:           `${trade.totalCostBps} bps (${trade.totalCostBps / 100}%)`,
    yieldAPY:            trade.yieldAPY,
  });
}));

// GET /api/v1/trades — Listar operaciones con paginación
router.get('/trades', asyncHandler(async (req, res) => {
  const page    = Math.max(1, parseInt(String(req.query.page  ?? '1'), 10));
  const limit   = Math.min(100, Math.max(1, parseInt(String(req.query.limit ?? '20'), 10)));
  const state   = req.query.state as string | undefined;
  const offset  = (page - 1) * limit;

  // Retrieve from orchestrator (returns full list; we paginate here)
  const allTrades = await orchestrator.listTrades().catch(() => []);
  const filtered  = state ? allTrades.filter((t: { state: string }) => t.state === state) : allTrades;
  const items     = filtered.slice(offset, offset + limit);

  res.json({
    data:  items,
    meta: {
      page,
      limit,
      total:      filtered.length,
      totalPages: Math.ceil(filtered.length / limit),
      hasNext:    offset + limit < filtered.length,
      hasPrev:    page > 1,
    },
  });
}));

// GET /api/v1/trades/:id — Status de operación
router.get('/trades/:id', asyncHandler(async (req, res) => {
  const status = await orchestrator.getTradeStatus(req.params.id);
  res.json(status);
}));

// POST /api/v1/trades/:id/fund — Fondear escrow
router.post('/trades/:id/fund', asyncHandler(async (req, res) => {
  const result = await orchestrator.fundTrade(req.params.id);
  res.json({ txHash: result.txHash, yieldPositionId: result.yieldPositionId });
}));

// GET /api/v1/compliance/:address — NFT de cumplimiento de una empresa
router.get('/compliance/:address', asyncHandler(async (req, res) => {
  const nft = await orchestrator.getComplianceNFT(req.params.address);
  res.json(nft);
}));

// GET /api/v1/fx/quote — Cotización FX en tiempo real
router.get('/fx/quote', asyncHandler(async (req, res) => {
  const { from, to, amount } = req.query;

  if (!from || !to || !amount) {
    res.status(400).json({ error: 'Required query params: from, to, amount' });
    return;
  }

  const quote = await orchestrator.getFXQuote(
    from as string,
    to as string,
    Number(amount),
  );
  res.json(quote);
}));

// GET /api/v1/audit/:tradeId — Audit trail de operación
router.get('/audit/:tradeId', asyncHandler(async (req, res) => {
  const audit = await orchestrator.getAuditTrail(req.params.tradeId);
  res.json(audit);
}));

// GET /api/v1/health — Health check
router.get('/health', (_req, res) => {
  res.json({
    status:    'ok',
    protocol:  'NEXUS LATAM',
    version:   '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// SSE clients registry
const sseClients = new Set<Response>();

// Broadcast a single agent event to all connected SSE clients
export function broadcastAgentEvent(event: {
  agent:   string;
  type:    'start' | 'progress' | 'success' | 'error';
  message: string;
  tradeId?: string;
}) {
  const payload = JSON.stringify({ ...event, ts: Date.now() });
  for (const client of sseClients) {
    try {
      client.write(`data: ${payload}\n\n`);
    } catch {
      sseClients.delete(client);
    }
  }
}

// GET /api/v1/events — SSE stream de eventos de agentes
router.get('/events', (req, res) => {
  res.setHeader('Content-Type',  'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection',    'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  // Send heartbeat immediately so the client knows it's connected
  res.write(`data: ${JSON.stringify({ type: 'connected', ts: Date.now() })}\n\n`);

  sseClients.add(res);

  // Heartbeat every 25s to prevent proxy timeout
  const hb = setInterval(() => {
    try { res.write(': heartbeat\n\n'); } catch { clearInterval(hb); }
  }, 25_000);

  req.on('close', () => {
    sseClients.delete(res);
    clearInterval(hb);
  });
});

export default router;
