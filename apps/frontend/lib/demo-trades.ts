// Example trades shared by the Command Center list (/trades), the trade
// creator and the trade detail page (/trades/[id]).
//
// apps/api is not deployed with the public site (vercel.json only ships
// apps/frontend), so everything here is a labelled simulation. Trades created
// with the "Nueva operación" form live only in this browser tab
// (sessionStorage), which is enough for "VER OPERACIÓN" to open the trade the
// visitor just created instead of an unrelated fixed example.

export interface DemoTradeRow {
  id:      string;
  state:   string;
  amount:  string;
  buyer:   string;
  seller:  string;
  country: string;
  rail:    string;
  time:    string;
  nft:     string;
}

export const DEMO_TRADES: DemoTradeRow[] = [
  { id: 'NEXUS-8821', state: 'SETTLED',   amount: '$25,000', buyer: '0x1a2b...', seller: '0xcd34...', country: 'MX', rail: 'SPEI', time: '58s', nft: '#8821' },
  { id: 'NEXUS-8820', state: 'FUNDED',    amount: '$12,500', buyer: '0xef56...', seller: '0x78ab...', country: 'BR', rail: 'PIX',  time: '--',  nft: '#8820' },
  { id: 'NEXUS-8819', state: 'PENDING',   amount: '$8,000',  buyer: '0xcd12...', seller: '0x34ef...', country: 'CO', rail: 'PSE',  time: '--',  nft: '#8819' },
  { id: 'NEXUS-8818', state: 'SETTLED',   amount: '$50,000', buyer: '0xab89...', seller: '0xcd67...', country: 'AR', rail: 'CVU',  time: '52s', nft: '#8818' },
  { id: 'NEXUS-8817', state: 'DISPUTED',  amount: '$3,200',  buyer: '0x90ef...', seller: '0x12ab...', country: 'PE', rail: 'CCI',  time: '--',  nft: '#8817' },
  { id: 'NEXUS-8816', state: 'DELIVERED', amount: '$18,750', buyer: '0xbc23...', seller: '0x45de...', country: 'CL', rail: 'TEF',  time: '--',  nft: '#8816' },
];

export interface TradeDetail {
  id:             string;
  state:          string;
  sellerAddress:  string;
  buyerAddress:   string;
  amountUSDC:     string;
  complianceNFT:  string;
  lcNFT:          string;
  settlementNFT:  string;
  escrowAddress:  string;
  escrowTxHash:   string;
  yieldAPY:       string;
  yieldEarned:    string;
  totalCost:      string;
  country:        string;
  rail:           string;
  settlementTime: string;
  createdAt:      string;
}

export interface CreatedDemoTrade {
  id:            string;
  amountUSDC:    number;
  sellerAddress: string;
  country:       string;
  rail:          string;
  complianceNFT: string;
  lcNFT:         string;
  escrowAddress: string;
  createdAt:     string; // ISO
}

export type DemoTradeSource = 'created' | 'list' | 'sample';

const STORAGE_KEY = 'nexus-demo-trades';

const SAMPLE: TradeDetail = {
  id:             'NEXUS-8821',
  state:          'SETTLED',
  sellerAddress:  '0xcd3456789abc1234ef',
  buyerAddress:   '0x1a2b3c4d5e6f7890ab',
  amountUSDC:     '25,000',
  complianceNFT:  '#NC-89123',
  lcNFT:          '#8821',
  settlementNFT:  '#SETTLE-2291',
  escrowAddress:  '0xabc123def456789...',
  escrowTxHash:   '0x5f8e2d1c9b4a7f3e...',
  yieldAPY:       '4.2%',
  yieldEarned:    '+$312 USDC',
  totalCost:      '$75 USDC (0.3%)',
  country:        'MX',
  rail:           'SPEI',
  settlementTime: '58s',
  createdAt:      '2026-05-26 14:32 UTC',
};

function readCreated(): Record<string, CreatedDemoTrade> {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, CreatedDemoTrade>) : {};
  } catch {
    return {};
  }
}

export function saveCreatedTrade(trade: CreatedDemoTrade) {
  try {
    const all = readCreated();
    all[trade.id] = trade;
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    /* private mode / storage blocked: the detail page falls back to the sample */
  }
}

const usd = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 2 });

function formatUTC(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.toISOString().slice(0, 16).replace('T', ' ')} UTC`;
}

function digits(id: string) {
  return id.replace(/\D/g, '') || '0000';
}

/**
 * Resolves the trade shown on /trades/[id] without a backend: a trade the
 * visitor created in this tab, one of the example rows of the list, or (for
 * any other id) the fixed sample, which the page labels as such.
 */
export function getDemoTradeDetail(id: string): { detail: TradeDetail; source: DemoTradeSource } {
  const created = typeof window !== 'undefined' ? readCreated()[id] : undefined;
  if (created) {
    const amount = Number(created.amountUSDC) || 0;
    return {
      source: 'created',
      detail: {
        id:             created.id,
        state:          'FUNDED',
        sellerAddress:  created.sellerAddress,
        buyerAddress:   'Tu empresa (simulado)',
        amountUSDC:     usd(amount),
        complianceNFT:  created.complianceNFT,
        lcNFT:          created.lcNFT,
        settlementNFT:  'pendiente',
        escrowAddress:  created.escrowAddress,
        escrowTxHash:   'ninguno (no se envió transacción)',
        yieldAPY:       '4.2% (ejemplo)',
        yieldEarned:    'se calcula al liquidar',
        totalCost:      `$${usd(amount * 0.003)} USDC (0.3%)`,
        country:        created.country,
        rail:           created.rail,
        settlementTime: 'pendiente',
        createdAt:      formatUTC(created.createdAt),
      },
    };
  }

  const row = DEMO_TRADES.find((t) => t.id === id);
  if (row) {
    const n       = digits(row.id);
    const amount  = Number(row.amount.replace(/[$,]/g, '')) || 0;
    const settled = row.state === 'SETTLED';
    return {
      source: 'list',
      detail: {
        ...SAMPLE,
        id:             row.id,
        state:          row.state,
        sellerAddress:  row.seller,
        buyerAddress:   row.buyer,
        amountUSDC:     usd(amount),
        complianceNFT:  `#NC-${n}`,
        lcNFT:          row.nft,
        settlementNFT:  settled ? `#SETTLE-${n}` : 'pendiente',
        yieldEarned:    settled ? `+$${usd(Math.round(amount * 0.0125))} USDC` : 'acumulando',
        totalCost:      `$${usd(amount * 0.003)} USDC (0.3%)`,
        country:        row.country,
        rail:           row.rail,
        settlementTime: row.time !== '--' ? row.time : 'pendiente',
      },
    };
  }

  return { source: 'sample', detail: SAMPLE };
}
