---
name: nexus-rare-integration
description: NEXUS LATAM usa @rareprotocol/rare-cli para acuñar NFTs de cumplimiento,
  Cartas de Crédito y bundles de auditoría. Usa este skill cuando trabajes con el
  RareProtocolService o necesites ejecutar comandos de la CLI directamente.
---

# NEXUS LATAM — Rare Protocol Integration

## Setup inicial
```bash
npm install -g @rareprotocol/rare-cli
rare configure --chain sepolia --private-key $PRIVATE_KEY --rpc-url $ARBITRUM_SEPOLIA_RPC
```

## Tipos de NFT en NEXUS

| Tipo           | Colección                    | Quién lo acuña   |
|----------------|------------------------------|------------------|
| ComplianceNFT  | NEXUS-COMPLIANCE-{COUNTRY}   | ComplianceAgent  |
| LC NFT         | NEXUS-LETTERS-OF-CREDIT      | TradeAgent       |
| Audit NFT      | NEXUS-AUDIT-TRAIL            | AuditAgent       |
| Settlement NFT | NEXUS-SETTLEMENTS            | TradeAgent       |

## Comandos frecuentes

### Desplegar colección de compliance
```bash
rare deploy erc721 "NEXUS-COMPLIANCE-MX" "NCMX" --max-tokens 1000000 --chain sepolia
```

### Acuñar ComplianceNFT
```bash
rare mint \
  --contract 0x... \
  --name "NC-RFC123456" \
  --description "Certificado KYC/AML NEXUS LATAM" \
  --attribute "score=876" \
  --attribute "tier=VERIFIED" \
  --attribute "country=MX" \
  --attribute "valid_until=2027-05-25" \
  --chain sepolia
```

### Acuñar Carta de Crédito
```bash
rare mint \
  --contract 0x... \
  --name "LC-#8821" \
  --description "Carta de Credito Programable NEXUS" \
  --attribute "amount_usdc=25000" \
  --attribute "status=ACTIVE" \
  --attribute "trade_id=8821" \
  --attribute "buyer=0x..." \
  --attribute "seller=0x..." \
  --chain sepolia
```

### Crear subasta de LC (mercado secundario)
```bash
rare auction create \
  --contract 0x... \
  --token-id 8821 \
  --starting-price 24500 \
  --duration 86400 \
  --chain sepolia
```

### Liquidar subasta al confirmar entrega
```bash
rare auction settle --contract 0x... --token-id 8821 --chain sepolia
```

### Acuñar Audit Bundle
```bash
rare mint \
  --contract 0x... \
  --name "NEXUS Audit Bundle #42" \
  --attribute "batch_number=42" \
  --attribute "transaction_count=500" \
  --attribute "merkle_root=0xabc..." \
  --attribute "total_volume_usdc=1250000" \
  --attribute "auditor=NEXUS_AUDIT_AGENT_V1" \
  --chain sepolia
```

### Buscar NFTs de auditoría
```bash
rare search tokens --query "NEXUS Audit Bundle" --take 10 --chain sepolia
```

## Service TypeScript → apps/agents/services/rare.service.ts
## Orchestrator → apps/agents/orchestrator/nexus.orchestrator.ts
