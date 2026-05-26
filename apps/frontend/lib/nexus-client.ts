const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error((err as { error: string }).error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export interface CreateTradePayload {
  buyerAddress:       string;
  sellerAddress:      string;
  amount:             number;
  currency:           string;
  destinationCountry: string;
  deadline?:          number;
  terms?:             string;
}

export const nexusClient = {
  createTrade: (data: CreateTradePayload) =>
    request<unknown>('/trades', {
      method: 'POST',
      body:   JSON.stringify(data),
    }),

  getTrades: () =>
    request<unknown[]>('/trades'),

  getTradeStatus: (id: string) =>
    request<unknown>(`/trades/${encodeURIComponent(id)}`),

  fundTrade: (id: string) =>
    request<unknown>(`/trades/${encodeURIComponent(id)}/fund`, { method: 'POST' }),

  getComplianceNFT: (address: string) =>
    request<unknown>(`/compliance/${encodeURIComponent(address)}`),

  getFXQuote: (from: string, to: string, amount: number) =>
    request<unknown>(`/fx/quote?from=${from}&to=${to}&amount=${amount}`),

  getAuditTrail: (tradeId: string) =>
    request<unknown>(`/audit/${encodeURIComponent(tradeId)}`),

  healthCheck: () =>
    request<{ status: string; version: string }>('/health'),
};
