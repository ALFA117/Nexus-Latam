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

export default router;
