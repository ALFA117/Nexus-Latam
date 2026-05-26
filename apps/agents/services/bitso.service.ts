import axios, { AxiosInstance } from 'axios';
import crypto from 'crypto';

export type LATAMRail     = 'SPEI' | 'PIX' | 'PSE' | 'CVU' | 'CBU';
export type LATAMCurrency = 'MXN' | 'BRL' | 'COP' | 'ARS' | 'USDC' | 'MXNB';

export interface PayoutRequest {
  amount:           number;
  currency:         LATAMCurrency;
  destinationRail:  LATAMRail;
  clabe?:           string;  // Mexico SPEI
  pixKey?:          string;  // Brazil PIX
  accountNumber?:   string;  // Colombia PSE
  bankCode?:        string;
  cvu?:             string;  // Argentina CVU
  reference:        string;  // NEXUS operation ID
  nexusTradeId:     string;
}

export interface PayoutResponse {
  payoutId:                 string;
  status:                   'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  estimatedSettlementTime:  string;
  txHash?:                  string;
}

export interface FXQuote {
  fromCurrency: LATAMCurrency;
  toCurrency:   LATAMCurrency;
  rate:         number;
  fee:          number;
  validUntil:   Date;
  quoteId:      string;
}

export interface OptimalRoute {
  rail:          LATAMRail;
  currency:      LATAMCurrency;
  estimatedCost: number;
  settleTime:    string;
}

export class NexusBitsoService {
  private client:    AxiosInstance;
  private apiKey:    string;
  private apiSecret: string;

  constructor(apiKey: string, apiSecret: string, sandbox = false) {
    this.apiKey    = apiKey;
    this.apiSecret = apiSecret;

    this.client = axios.create({
      baseURL: sandbox
        ? 'https://api-sandbox.bitso.com/v3'
        : 'https://api.bitso.com/v3',
      headers: { 'Content-Type': 'application/json' },
      timeout: 10_000,
    });

    // Sign every request with HMAC-SHA256
    this.client.interceptors.request.use((config) => {
      const timestamp = Date.now().toString();
      const nonce     = crypto.randomBytes(8).toString('hex');
      const method    = config.method?.toUpperCase() ?? 'GET';
      const path      = new URL(config.url!, config.baseURL!).pathname;
      const body      = config.data ? JSON.stringify(config.data) : '';

      const message   = `${timestamp}${nonce}${method}${path}${body}`;
      const signature = crypto
        .createHmac('sha256', this.apiSecret)
        .update(message)
        .digest('hex');

      config.headers['Authorization'] =
        `Bitso ${this.apiKey}:${nonce}:${timestamp}:${signature}`;
      return config;
    });
  }

  async getFXQuote(
    from: LATAMCurrency,
    to: LATAMCurrency,
    amount: number,
  ): Promise<FXQuote> {
    const res = await this.client.get('/fx/quote', {
      params: { origin_currency: from, dest_currency: to, amount },
    });
    return res.data.payload;
  }

  async executePayout(request: PayoutRequest): Promise<PayoutResponse> {
    const payload = this.buildPayoutPayload(request);
    const res     = await this.client.post('/business/payouts', payload);
    return {
      payoutId:                res.data.payload.payout_id,
      status:                  res.data.payload.status,
      estimatedSettlementTime: res.data.payload.estimated_settlement,
      txHash:                  res.data.payload.blockchain_tx_hash,
    };
  }

  async getOptimalRoute(
    amount: number,
    fromCurrency: LATAMCurrency,
    destinationCountry: 'MX' | 'BR' | 'CO' | 'AR',
  ): Promise<OptimalRoute> {
    const railMap: Record<string, LATAMRail> = {
      MX: 'SPEI', BR: 'PIX', CO: 'PSE', AR: 'CVU',
    };
    const currencyMap: Record<string, LATAMCurrency> = {
      MX: 'MXN', BR: 'BRL', CO: 'COP', AR: 'ARS',
    };

    const rail       = railMap[destinationCountry];
    const toCurrency = currencyMap[destinationCountry];
    const quote      = await this.getFXQuote(fromCurrency, toCurrency, amount);

    return {
      rail,
      currency:      toCurrency,
      estimatedCost: quote.fee,
      settleTime:    destinationCountry === 'MX' || destinationCountry === 'BR' ? '<10s' : '<60s',
    };
  }

  async convertToMXNB(usdcAmount: number): Promise<{ mxnbAmount: number; txHash: string }> {
    const res = await this.client.post('/business/stablecoin/convert', {
      from_currency: 'USDC',
      to_currency:   'MXNB',
      amount:        usdcAmount,
    });
    return {
      mxnbAmount: res.data.payload.dest_amount,
      txHash:     res.data.payload.tx_hash,
    };
  }

  async getPayoutStatus(payoutId: string): Promise<PayoutResponse> {
    const res = await this.client.get(`/business/payouts/${payoutId}`);
    return res.data.payload;
  }

  async getBalances(): Promise<Array<{ currency: string; available: number; locked: number }>> {
    const res = await this.client.get('/balance');
    return res.data.payload.balances;
  }

  private buildPayoutPayload(request: PayoutRequest): object {
    const base = {
      amount:   request.amount,
      currency: request.currency,
      reference: request.reference,
      metadata: { nexus_trade_id: request.nexusTradeId },
    };

    switch (request.destinationRail) {
      case 'SPEI':
        return { ...base, method: 'spei', destination: { clabe: request.clabe } };
      case 'PIX':
        return { ...base, method: 'pix',  destination: { pix_key: request.pixKey } };
      case 'PSE':
        return { ...base, method: 'pse',  destination: { account_number: request.accountNumber, bank_code: request.bankCode } };
      case 'CVU':
        return { ...base, method: 'cvu',  destination: { cvu: request.cvu } };
      case 'CBU':
        return { ...base, method: 'cbu',  destination: { cbu: request.cvu } };
      default:
        throw new Error(`Unsupported rail: ${request.destinationRail}`);
    }
  }
}
