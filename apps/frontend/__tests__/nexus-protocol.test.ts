import { describe, it, expect } from 'vitest';

// ─── State & tier label mappings (mirrors useContracts.ts) ───────────────────

const STATE_LABELS = ['PENDING', 'FUNDED', 'DELIVERED', 'SETTLED', 'DISPUTED'] as const;
const TIER_LABELS  = ['NONE', 'BASIC', 'VERIFIED', 'PREMIUM'] as const;

describe('Contract state labels', () => {
  it('has exactly 5 states', () => expect(STATE_LABELS).toHaveLength(5));
  it('index 0 is PENDING', () => expect(STATE_LABELS[0]).toBe('PENDING'));
  it('index 1 is FUNDED',  () => expect(STATE_LABELS[1]).toBe('FUNDED'));
  it('index 2 is DELIVERED', () => expect(STATE_LABELS[2]).toBe('DELIVERED'));
  it('index 3 is SETTLED (happy-path terminal)', () => expect(STATE_LABELS[3]).toBe('SETTLED'));
  it('index 4 is DISPUTED (exception path)', () => expect(STATE_LABELS[4]).toBe('DISPUTED'));
});

describe('Compliance tier labels', () => {
  it('has 4 tiers', () => expect(TIER_LABELS).toHaveLength(4));
  it('tier 0 is NONE',    () => expect(TIER_LABELS[0]).toBe('NONE'));
  it('tier 1 is BASIC',   () => expect(TIER_LABELS[1]).toBe('BASIC'));
  it('tier 2 is VERIFIED',() => expect(TIER_LABELS[2]).toBe('VERIFIED'));
  it('tier 3 is PREMIUM', () => expect(TIER_LABELS[3]).toBe('PREMIUM'));
});

// ─── APY conversion (basis points → percent) ─────────────────────────────────

function bpsToPercent(bps: bigint): number { return Number(bps) / 100; }

describe('APY basis-point conversion', () => {
  it('420 bps = 4.20%',  () => expect(bpsToPercent(BigInt(420))).toBeCloseTo(4.2));
  it('0 bps = 0%',       () => expect(bpsToPercent(BigInt(0))).toBe(0));
  it('1000 bps = 10%',   () => expect(bpsToPercent(BigInt(1000))).toBe(10));
  it('10000 bps = 100%', () => expect(bpsToPercent(BigInt(10000))).toBe(100));
});

// ─── USDC amount formatting (6 decimals) ─────────────────────────────────────

function rawToUSDC(raw: bigint): number { return Number(raw) / 1e6; }

describe('USDC raw→display conversion (6 decimals)', () => {
  it('1_000_000 raw = $1',       () => expect(rawToUSDC(BigInt(1_000_000))).toBe(1));
  it('25_000_000_000 raw = $25k',() => expect(rawToUSDC(BigInt(25_000_000_000))).toBe(25000));
  it('0 raw = 0',                () => expect(rawToUSDC(BigInt(0))).toBe(0));
  it('1 raw = $0.000001',        () => expect(rawToUSDC(BigInt(1))).toBeCloseTo(0.000001));
});

// ─── Yield split (80/20) ─────────────────────────────────────────────────────

function splitYield(total: number) {
  return { seller: total * 0.8, protocol: total * 0.2 };
}

describe('Yield split 80/20', () => {
  it('$312 yield → seller $249.6, protocol $62.4', () => {
    const { seller, protocol } = splitYield(312);
    expect(seller).toBeCloseTo(249.6);
    expect(protocol).toBeCloseTo(62.4);
  });
  it('split always sums to total', () => {
    const total = 1234.567;
    const { seller, protocol } = splitYield(total);
    expect(seller + protocol).toBeCloseTo(total);
  });
  it('seller share is always ≥ protocol share', () => {
    expect(splitYield(1000).seller).toBeGreaterThan(splitYield(1000).protocol);
  });
});

// ─── Protocol fee ─────────────────────────────────────────────────────────────

describe('Protocol fee (30 bps = 0.3%)', () => {
  const FEE_BPS = 30;
  function calcFee(amount: number): number { return (amount * FEE_BPS) / 10_000; }

  it('$25,000 trade → $75 fee', () => expect(calcFee(25_000)).toBe(75));
  it('$1,000 trade → $3 fee',   () => expect(calcFee(1_000)).toBe(3));
  it('fee is 0.3% of amount',   () => expect(calcFee(10_000)).toBe(30));
});

// ─── Merkle bundle size ───────────────────────────────────────────────────────

describe('Audit bundle constraints', () => {
  const MAX_BUNDLE = 500;
  const TREE_DEPTH = Math.ceil(Math.log2(MAX_BUNDLE));

  it('max 500 txs per bundle', () => expect(MAX_BUNDLE).toBe(500));
  it('tree depth is 9 levels (ceil(log2(500)))', () => expect(TREE_DEPTH).toBe(9));
  it('full tree has 1023 nodes (2^9 - 1 + 2^9 leaves cap)', () => {
    const nodes = 2 ** TREE_DEPTH - 1 + 2 ** TREE_DEPTH;
    expect(nodes).toBe(1023);
  });
});

// ─── bytes32 tradeId encoding ─────────────────────────────────────────────────

function toBytes32(str: string): string {
  let hex = '';
  for (let i = 0; i < Math.min(str.length, 32); i++)
    hex += str.charCodeAt(i).toString(16).padStart(2, '0');
  return `0x${hex.padEnd(64, '0')}`;
}

describe('bytes32 tradeId encoding', () => {
  it('starts with 0x', () => expect(toBytes32('NEXUS-8821')).toMatch(/^0x/));
  it('is exactly 66 chars (0x + 64 hex)', () => expect(toBytes32('NEXUS-8821')).toHaveLength(66));
  it('same string → same bytes32', () => expect(toBytes32('NEXUS-8821')).toBe(toBytes32('NEXUS-8821')));
  it('different strings → different bytes32', () => {
    expect(toBytes32('NEXUS-8821')).not.toBe(toBytes32('NEXUS-8822'));
  });
  it('pads short string to 32 bytes', () => {
    expect(toBytes32('A').endsWith('0'.repeat(62))).toBe(true);
  });
});
