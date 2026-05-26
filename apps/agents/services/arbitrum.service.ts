import { ethers } from 'ethers';

// Minimal ABIs for cross-contract interaction
const TRADE_ESCROW_ABI = [
  'function create_trade(address seller, uint256 amount_usdc, uint256 compliance_nft_id, uint256 deadline_seconds) returns (uint256)',
  'function fund_trade(uint256 trade_id)',
  'function set_lc_nft(uint256 trade_id, uint256 lc_nft_id)',
  'function confirm_delivery(uint256 trade_id, bytes32 delivery_hash)',
  'function get_trade_state(uint256 trade_id) view returns (uint8)',
  'function get_trade_count() view returns (uint256)',
  'event TradeCreated(uint256 indexed trade_id, address indexed buyer, address indexed seller, uint256 amount)',
  'event TradeSettled(uint256 indexed trade_id, address indexed seller, uint256 amount, uint256 yield_earned, bytes32 delivery_hash)',
];

const BATCH_PAYMENT_ABI = [
  'function execute_batch(tuple(address recipient, uint256 amount, uint8 currency_code, bytes32 reference)[] payments, bytes32 batch_root) returns (uint256)',
  'function get_batch_count() view returns (uint256)',
  'function get_total_volume() view returns (uint256)',
  'event BatchExecuted(uint256 indexed batch_id, uint256 payment_count, uint256 total_volume, bytes32 batch_root)',
];

const ERC20_ABI = [
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function balanceOf(address account) view returns (uint256)',
];

export interface CreateTradeParams {
  seller:          string;
  amountUSDC:      number;
  complianceNftId?: number;
  deadlineSeconds: number;
}

export interface TradeReceipt {
  tradeId: string;
  txHash:  string;
}

export interface ContractAddresses {
  tradeEscrow:   string;
  batchPayment:  string;
  nexusVault:    string;
  complianceReg: string;
  usdc:          string;
  mxnb:          string;
}

export class ArbitrumService {
  private provider: ethers.JsonRpcProvider;
  private signer:   ethers.Wallet;
  private addresses: Partial<ContractAddresses> = {};

  constructor(rpcUrl: string) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.signer   = new ethers.Wallet(process.env.PRIVATE_KEY!, this.provider);

    this.addresses = {
      tradeEscrow:   process.env.TRADE_ESCROW_ADDRESS,
      batchPayment:  process.env.BATCH_PAYMENT_ADDRESS,
      nexusVault:    process.env.NEXUS_VAULT_ADDRESS,
      complianceReg: process.env.COMPLIANCE_REGISTRY_ADDRESS,
      usdc:          process.env.USDC_ADDRESS,
      mxnb:          process.env.MXNB_ADDRESS,
    };
  }

  async createTradeEscrow(params: CreateTradeParams): Promise<TradeReceipt> {
    const contract = new ethers.Contract(
      this.addresses.tradeEscrow!,
      TRADE_ESCROW_ABI,
      this.signer,
    );

    const amountWei     = ethers.parseUnits(params.amountUSDC.toString(), 6); // USDC = 6 decimals
    const complianceNft = params.complianceNftId ?? 0;

    // Approve USDC spend before funding
    await this.approveUSDC(this.addresses.tradeEscrow!, params.amountUSDC);

    const tx = await contract.create_trade(
      params.seller,
      amountWei,
      complianceNft,
      params.deadlineSeconds,
    );
    const receipt = await tx.wait();

    // Parse TradeCreated event to get trade_id
    const event   = receipt.logs
      .map((log: ethers.Log) => {
        try { return contract.interface.parseLog(log); } catch { return null; }
      })
      .find((e: ethers.LogDescription | null) => e?.name === 'TradeCreated');

    return {
      tradeId: event?.args.trade_id.toString() ?? '0',
      txHash:  receipt.hash,
    };
  }

  async fundTrade(tradeId: string): Promise<{ txHash: string }> {
    const contract = new ethers.Contract(
      this.addresses.tradeEscrow!,
      TRADE_ESCROW_ABI,
      this.signer,
    );
    const tx      = await contract.fund_trade(tradeId);
    const receipt = await tx.wait();
    return { txHash: receipt.hash };
  }

  async setLcNft(tradeId: string, lcNftId: string): Promise<{ txHash: string }> {
    const contract = new ethers.Contract(
      this.addresses.tradeEscrow!,
      TRADE_ESCROW_ABI,
      this.signer,
    );
    const tx      = await contract.set_lc_nft(tradeId, lcNftId);
    const receipt = await tx.wait();
    return { txHash: receipt.hash };
  }

  async confirmDelivery(tradeId: string, deliveryHash: string): Promise<{ txHash: string }> {
    const contract = new ethers.Contract(
      this.addresses.tradeEscrow!,
      TRADE_ESCROW_ABI,
      this.signer,
    );
    const hashBytes = ethers.zeroPadValue(ethers.toUtf8Bytes(deliveryHash), 32);
    const tx        = await contract.confirm_delivery(tradeId, hashBytes);
    const receipt   = await tx.wait();
    return { txHash: receipt.hash };
  }

  async getTradeState(tradeId: string): Promise<number> {
    const contract = new ethers.Contract(
      this.addresses.tradeEscrow!,
      TRADE_ESCROW_ABI,
      this.provider,
    );
    return Number(await contract.get_trade_state(tradeId));
  }

  async getUSDCBalance(address: string): Promise<number> {
    const usdc    = new ethers.Contract(this.addresses.usdc!, ERC20_ABI, this.provider);
    const balance = await usdc.balanceOf(address);
    return Number(ethers.formatUnits(balance, 6));
  }

  async getGasPrice(): Promise<{ gwei: string; estimatedCostUSD: number }> {
    const feeData  = await this.provider.getFeeData();
    const gweiStr  = ethers.formatUnits(feeData.gasPrice ?? 0n, 'gwei');
    // Arbitrum gas is extremely cheap (~0.1 gwei)
    const estimatedCostUSD = parseFloat(gweiStr) * 0.000021; // ~21k gas units
    return { gwei: gweiStr, estimatedCostUSD };
  }

  async listenToTradeEvents(callback: (event: { type: string; tradeId: string; data: unknown }) => void): Promise<void> {
    const contract = new ethers.Contract(
      this.addresses.tradeEscrow!,
      TRADE_ESCROW_ABI,
      this.provider,
    );

    contract.on('TradeCreated', (tradeId, buyer, seller, amount) => {
      callback({ type: 'TradeCreated', tradeId: tradeId.toString(), data: { buyer, seller, amount } });
    });

    contract.on('TradeSettled', (tradeId, seller, amount, yieldEarned) => {
      callback({ type: 'TradeSettled', tradeId: tradeId.toString(), data: { seller, amount, yieldEarned } });
    });
  }

  private async approveUSDC(spender: string, amount: number): Promise<void> {
    const usdc      = new ethers.Contract(this.addresses.usdc!, ERC20_ABI, this.signer);
    const amountWei = ethers.parseUnits(amount.toString(), 6);
    const tx        = await usdc.approve(spender, amountWei);
    await tx.wait();
  }
}
