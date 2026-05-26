import { execSync, exec } from 'child_process';
import { promisify } from 'util';
import * as fs   from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

export interface NFTMetadata {
  name:        string;
  description?: string;
  imagePath?:  string;
  attributes:  Array<{ trait_type: string; value: string }>;
}

export interface AuctionConfig {
  contractAddress:   string;
  tokenId:           string;
  startingPriceETH:  number;
  durationSeconds:   number;
}

export interface MintResult {
  tokenId:         string;
  txHash:          string;
  contractAddress: string;
  ipfsUri:         string;
}

export interface DeployResult {
  contractAddress: string;
  txHash:          string;
}

export class RareProtocolService {
  private chain: 'mainnet' | 'sepolia' | 'base';
  private deployedContracts: Map<string, string> = new Map();

  constructor(chain: 'mainnet' | 'sepolia' | 'base' = 'sepolia') {
    this.chain = chain;
    this.verifyInstallation();
  }

  private verifyInstallation(): void {
    try {
      execSync('rare --version', { stdio: 'pipe' });
    } catch {
      throw new Error(
        'rare-cli not installed. Run: npm install -g @rareprotocol/rare-cli'
      );
    }
  }

  async deployCollection(
    name: string,
    symbol: string,
    maxTokens?: number,
  ): Promise<DeployResult> {
    const maxFlag = maxTokens ? `--max-tokens ${maxTokens}` : '';
    const cmd     = `rare deploy erc721 "${name}" "${symbol}" ${maxFlag} --chain ${this.chain}`;

    console.log(`[RareService] Deploying: ${name}`);
    const { stdout } = await execAsync(cmd);
    const result     = JSON.parse(stdout);

    this.deployedContracts.set(name, result.contractAddress);
    console.log(`[RareService] Deployed at ${result.contractAddress}`);
    return { contractAddress: result.contractAddress, txHash: result.transactionHash };
  }

  async mintComplianceNFT(
    companyId:      string,
    kycScore:       number,
    tier:           'BASIC' | 'VERIFIED' | 'PREMIUM',
    countryCode:    string,
    documentsHash:  string,
  ): Promise<MintResult> {
    const collectionName = `NEXUS-COMPLIANCE-${countryCode}`;
    let contractAddress  = this.deployedContracts.get(collectionName);

    if (!contractAddress) {
      const dep      = await this.deployCollection(collectionName, `NC${countryCode}`, 1_000_000);
      contractAddress = dep.contractAddress;
    }

    const imagePath = await this.generateComplianceCertificate(companyId, kycScore, tier);

    const metadata: NFTMetadata = {
      name:        `NEXUS Compliance — ${companyId}`,
      description: `Certificado KYC/AML verificado por NEXUS LATAM. Empresa: ${companyId}`,
      imagePath,
      attributes: [
        { trait_type: 'company_id',     value: companyId },
        { trait_type: 'kyc_score',      value: kycScore.toString() },
        { trait_type: 'tier',           value: tier },
        { trait_type: 'country',        value: countryCode },
        { trait_type: 'documents_hash', value: documentsHash },
        { trait_type: 'issued_by',      value: 'NEXUS_LATAM_PROTOCOL' },
        { trait_type: 'valid_until',    value: this.expiryDate(365) },
      ],
    };

    return this.mintNFT(contractAddress, metadata);
  }

  async mintLetterOfCredit(
    tradeId:          string,
    buyerAddress:     string,
    sellerAddress:    string,
    amountUSDC:       number,
    currencyCode:     string,
    dueDateTimestamp: number,
    conditionsHash:   string,
  ): Promise<MintResult> {
    const collectionName = 'NEXUS-LETTERS-OF-CREDIT';
    let contractAddress  = this.deployedContracts.get(collectionName);

    if (!contractAddress) {
      const dep      = await this.deployCollection(collectionName, 'NLC');
      contractAddress = dep.contractAddress;
    }

    const imagePath = await this.generateLCImage(tradeId, amountUSDC);

    const metadata: NFTMetadata = {
      name:        `NEXUS LC #${tradeId}`,
      description: `Carta de Crédito Programable NEXUS LATAM. Monto: ${amountUSDC} USDC`,
      imagePath,
      attributes: [
        { trait_type: 'trade_id',        value: tradeId },
        { trait_type: 'buyer',           value: buyerAddress },
        { trait_type: 'seller',          value: sellerAddress },
        { trait_type: 'amount_usdc',     value: amountUSDC.toString() },
        { trait_type: 'currency',        value: currencyCode },
        { trait_type: 'due_date',        value: new Date(dueDateTimestamp * 1000).toISOString() },
        { trait_type: 'status',          value: 'ACTIVE' },
        { trait_type: 'conditions_hash', value: conditionsHash },
        { trait_type: 'protocol',        value: 'NEXUS_LATAM_V1' },
      ],
    };

    return this.mintNFT(contractAddress, metadata);
  }

  async mintAuditBundle(
    batchNumber:      number,
    transactionCount: number,
    merkleRoot:       string,
    totalVolume:      number,
    periodStart:      Date,
    periodEnd:        Date,
  ): Promise<MintResult> {
    const collectionName = 'NEXUS-AUDIT-TRAIL';
    let contractAddress  = this.deployedContracts.get(collectionName);

    if (!contractAddress) {
      const dep      = await this.deployCollection(collectionName, 'NAT');
      contractAddress = dep.contractAddress;
    }

    const metadata: NFTMetadata = {
      name:        `NEXUS Audit Bundle #${batchNumber}`,
      description: `Registro de auditoría inmutable. ${transactionCount} transacciones. Volumen: $${totalVolume} USDC`,
      attributes: [
        { trait_type: 'batch_number',        value: batchNumber.toString() },
        { trait_type: 'transaction_count',   value: transactionCount.toString() },
        { trait_type: 'merkle_root',         value: merkleRoot },
        { trait_type: 'total_volume_usdc',   value: totalVolume.toString() },
        { trait_type: 'period_start',        value: periodStart.toISOString() },
        { trait_type: 'period_end',          value: periodEnd.toISOString() },
        { trait_type: 'auditor',             value: 'NEXUS_AUDIT_AGENT_V1' },
        { trait_type: 'regulatory_standard', value: 'SAT_CFDI_4.0_AFIP_CVC_DIAN' },
      ],
    };

    return this.mintNFT(contractAddress, metadata);
  }

  async mintSettlementNFT(
    tradeId:    string,
    seller:     string,
    amountUSDC: number,
    txHash:     string,
  ): Promise<MintResult> {
    const collectionName = 'NEXUS-SETTLEMENTS';
    let contractAddress  = this.deployedContracts.get(collectionName);

    if (!contractAddress) {
      const dep      = await this.deployCollection(collectionName, 'NST');
      contractAddress = dep.contractAddress;
    }

    const metadata: NFTMetadata = {
      name:        `NEXUS Settlement #${tradeId}`,
      description: `Comprobante fiscal de liquidación NEXUS LATAM. Monto: ${amountUSDC} USDC`,
      attributes: [
        { trait_type: 'trade_id',     value: tradeId },
        { trait_type: 'seller',       value: seller },
        { trait_type: 'amount_usdc',  value: amountUSDC.toString() },
        { trait_type: 'settled_at',   value: new Date().toISOString() },
        { trait_type: 'tx_hash',      value: txHash },
        { trait_type: 'status',       value: 'SETTLED' },
      ],
    };

    return this.mintNFT(contractAddress, metadata);
  }

  async createLCAuction(config: AuctionConfig): Promise<{ auctionId: string; txHash: string }> {
    const cmd = [
      'rare auction create',
      `--contract ${config.contractAddress}`,
      `--token-id ${config.tokenId}`,
      `--starting-price ${config.startingPriceETH}`,
      `--duration ${config.durationSeconds}`,
      `--chain ${this.chain}`,
    ].join(' ');

    const { stdout } = await execAsync(cmd);
    const result     = JSON.parse(stdout);
    return { auctionId: result.auctionId, txHash: result.transactionHash };
  }

  async settleAuction(contractAddress: string, tokenId: string): Promise<{ txHash: string }> {
    const cmd = [
      'rare auction settle',
      `--contract ${contractAddress}`,
      `--token-id ${tokenId}`,
      `--chain ${this.chain}`,
    ].join(' ');

    const { stdout } = await execAsync(cmd);
    return { txHash: JSON.parse(stdout).transactionHash };
  }

  private async mintNFT(contractAddress: string, metadata: NFTMetadata): Promise<MintResult> {
    const attrFlags = metadata.attributes
      .map(a => `--attribute "${a.trait_type}=${a.value}"`)
      .join(' ');

    const imageFlag = metadata.imagePath ? `--image ${metadata.imagePath}` : '';

    const cmd = [
      'rare mint',
      `--contract ${contractAddress}`,
      `--name "${metadata.name}"`,
      `--description "${metadata.description ?? ''}"`,
      imageFlag,
      attrFlags,
      `--chain ${this.chain}`,
    ].filter(Boolean).join(' ');

    const { stdout } = await execAsync(cmd);
    const result     = JSON.parse(stdout);

    return {
      tokenId:         result.tokenId,
      txHash:          result.transactionHash,
      contractAddress,
      ipfsUri:         result.tokenUri,
    };
  }

  private expiryDate(daysFromNow: number): string {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    return d.toISOString();
  }

  private async generateComplianceCertificate(
    companyId: string,
    score:     number,
    tier:      string,
  ): Promise<string> {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
  <rect width="800" height="600" fill="#0D1B2A"/>
  <text x="400" y="100"  fill="#00D4FF" font-size="32" text-anchor="middle" font-family="monospace">NEXUS LATAM</text>
  <text x="400" y="160"  fill="white"   font-size="20" text-anchor="middle">Compliance Certificate</text>
  <rect x="100" y="190"  width="600" height="2" fill="#00D4FF33"/>
  <text x="400" y="280"  fill="#F7B731" font-size="48" text-anchor="middle" font-weight="bold">${score}/1000</text>
  <text x="400" y="340"  fill="white"   font-size="18" text-anchor="middle">${companyId}</text>
  <text x="400" y="400"  fill="#00D4FF" font-size="24" text-anchor="middle">[${tier}]</text>
  <text x="400" y="560"  fill="#555"    font-size="12" text-anchor="middle">Issued by NEXUS LATAM Protocol · ${new Date().toISOString().split('T')[0]}</text>
</svg>`;

    const filePath = path.join(process.env.TEMP ?? '/tmp', `compliance-${companyId}-${Date.now()}.svg`);
    fs.writeFileSync(filePath, svg);
    return filePath;
  }

  private async generateLCImage(tradeId: string, amount: number): Promise<string> {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
  <rect width="800" height="600" fill="#0D1B2A"/>
  <text x="400" y="100"  fill="#00D4FF" font-size="28" text-anchor="middle" font-family="monospace">NEXUS LETTER OF CREDIT</text>
  <text x="400" y="220"  fill="gray"    font-size="16" text-anchor="middle">PROGRAMMABLE TRADE FINANCE</text>
  <text x="400" y="310"  fill="#F7B731" font-size="52" text-anchor="middle" font-weight="bold">$${amount.toLocaleString()}</text>
  <text x="400" y="370"  fill="white"   font-size="18" text-anchor="middle">USDC</text>
  <text x="400" y="460"  fill="white"   font-size="14" text-anchor="middle">Trade ID: ${tradeId}</text>
  <text x="400" y="560"  fill="#555"    font-size="12" text-anchor="middle">NEXUS LATAM Protocol · Arbitrum Stylus</text>
</svg>`;

    const filePath = path.join(process.env.TEMP ?? '/tmp', `lc-${tradeId}-${Date.now()}.svg`);
    fs.writeFileSync(filePath, svg);
    return filePath;
  }
}
