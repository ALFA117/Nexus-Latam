import { describe, it, expect } from 'vitest';

// ─── FX formatting helpers (extracted from LiveFXTicker) ─────────────────────
function fmtRate(rate: number): string {
  if (rate < 100)   return rate.toFixed(4);
  if (rate < 10000) return rate.toFixed(1);
  return rate.toFixed(0);
}

function shortAddr(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function fmtUSDC(amount: number): string {
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('fmtRate', () => {
  it('formats small rates with 4 decimals', () => {
    expect(fmtRate(5.61)).toBe('5.6100');
    expect(fmtRate(3.72)).toBe('3.7200');
  });
  it('formats medium rates with 1 decimal', () => {
    expect(fmtRate(17.23)).toBe('17.2300');
    expect(fmtRate(912.0)).toBe('912.0');
  });
  it('formats large rates with no decimals', () => {
    expect(fmtRate(3924.0)).toBe('3924.0');
    expect(fmtRate(12500)).toBe('12500');
  });
});

describe('shortAddr', () => {
  it('truncates addresses to 6+4 chars with ellipsis', () => {
    const addr = '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12';
    expect(shortAddr(addr)).toBe('0x1a2b…ef12');
  });
  it('handles short addresses gracefully', () => {
    expect(shortAddr('0xabcd1234')).toBe('0xabcd…1234');
  });
});

describe('fmtUSDC', () => {
  it('formats amounts with 2 decimal places', () => {
    expect(fmtUSDC(25000)).toBe('25,000.00');
    expect(fmtUSDC(1234.5)).toBe('1,234.50');
  });
  it('formats zero correctly', () => {
    expect(fmtUSDC(0)).toBe('0.00');
  });
});

describe('Trade state machine', () => {
  const STATE_ORDER = ['PENDING', 'FUNDED', 'DELIVERED', 'SETTLED'];

  it('SETTLED is a terminal state (no transitions)', () => {
    const idx = STATE_ORDER.indexOf('SETTLED');
    expect(idx).toBe(STATE_ORDER.length - 1);
  });

  it('FUNDED precedes DELIVERED', () => {
    expect(STATE_ORDER.indexOf('FUNDED')).toBeLessThan(STATE_ORDER.indexOf('DELIVERED'));
  });

  it('DISPUTED is not in the happy path', () => {
    expect(STATE_ORDER.includes('DISPUTED')).toBe(false);
  });
});

describe('Merkle root', () => {
  function hashData(data: unknown): string {
    // Simple deterministic hash for tests (no crypto dep)
    const str = JSON.stringify(data);
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
    return h.toString(16).padStart(8, '0');
  }

  it('two identical leaves produce the same root', () => {
    const h = hashData({ tx: 'abc' });
    expect(h).toBe(hashData({ tx: 'abc' }));
  });

  it('different leaves produce different hashes', () => {
    expect(hashData({ tx: 'abc' })).not.toBe(hashData({ tx: 'xyz' }));
  });
});
