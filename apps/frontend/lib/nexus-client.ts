const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

// Exponential back-off retry for transient network errors
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 2,
  baseDelayMs = 400,
): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options);
      // Only retry on 5xx or network errors, not 4xx (client error)
      if (res.ok || res.status < 500) return res;
      if (attempt === retries) return res; // give up, return last response
    } catch (err) {
      if (attempt === retries) throw err;
    }
    await new Promise(r => setTimeout(r, baseDelayMs * 2 ** attempt));
  }
  // unreachable but satisfies TS
  return fetch(url, options);
}

async function request<T>(
  path: string,
  options?: RequestInit & { signal?: AbortSignal },
): Promise<T> {
  const res = await fetchWithRetry(
    `${BASE_URL}${path}`,
    {
      headers: { 'Content-Type': 'application/json', ...((options?.headers) ?? {}) },
      ...options,
    },
  );
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

export interface PaginatedTrades {
  data: unknown[];
  meta: {
    page:       number;
    limit:      number;
    total:      number;
    totalPages: number;
    hasNext:    boolean;
    hasPrev:    boolean;
  };
}

export const nexusClient = {
  createTrade: (data: CreateTradePayload, signal?: AbortSignal) =>
    request<unknown>('/trades', {
      method: 'POST',
      body:   JSON.stringify(data),
      signal,
    }),

  getTrades: (params?: { page?: number; limit?: number; state?: string }, signal?: AbortSignal) => {
    const qs = new URLSearchParams();
    if (params?.page)  qs.set('page',  String(params.page));
    if (params?.limit) qs.set('limit', String(params.limit));
    if (params?.state) qs.set('state', params.state);
    const query = qs.toString() ? `?${qs}` : '';
    return request<PaginatedTrades>(`/trades${query}`, { signal });
  },

  getTradeStatus: (id: string, signal?: AbortSignal) =>
    request<unknown>(`/trades/${encodeURIComponent(id)}`, { signal }),

  fundTrade: (id: string, signal?: AbortSignal) =>
    request<unknown>(`/trades/${encodeURIComponent(id)}/fund`, { method: 'POST', signal }),

  getComplianceNFT: (address: string, signal?: AbortSignal) =>
    request<unknown>(`/compliance/${encodeURIComponent(address)}`, { signal }),

  getFXQuote: (from: string, to: string, amount: number, signal?: AbortSignal) =>
    request<unknown>(`/fx/quote?from=${from}&to=${to}&amount=${amount}`, { signal }),

  getAuditTrail: (tradeId: string, signal?: AbortSignal) =>
    request<unknown>(`/audit/${encodeURIComponent(tradeId)}`, { signal }),

  healthCheck: (signal?: AbortSignal) =>
    request<{ status: string; version: string }>('/health', { signal }),
};
