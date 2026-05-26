# ⚡ NEXUS LATAM

> **El primer protocolo autónomo de financiamiento comercial B2B para Latinoamérica.**
> Liquida, financia y audita operaciones en < 60 segundos — powered by Arbitrum Stylus, Claude AI y Bitso Business.

[![CI](https://github.com/ALFA117/Nexus-Latam/actions/workflows/ci.yml/badge.svg)](https://github.com/ALFA117/Nexus-Latam/actions/workflows/ci.yml)
[![Live](https://img.shields.io/badge/LIVE-Vercel-00D4FF?style=flat&logo=vercel)](https://nexus-latam-kappa.vercel.app)
[![Arbitrum](https://img.shields.io/badge/Arbitrum-Sepolia-9B30FF?style=flat)](https://sepolia.arbiscan.io)
[![ETH México](https://img.shields.io/badge/ETH%20México-2026-F7B731?style=flat)](https://ethmexicoconf.com)

---

## 🌎 El Problema

Las **40 millones de PYMEs de LATAM** necesitan acceso a financiamiento comercial para crecer, pero:

- Los bancos tardan **14–45 días** en procesar una Carta de Crédito
- Las comisiones bancarias oscilan entre **2–5%** por operación
- No existe trazabilidad inmutable de compliance KYC/AML
- Los pagos cross-border entre MX/BR/CO/AR son lentos e inconsistentes

---

## ✅ La Solución: NEXUS LATAM

Un protocolo de 5 agentes de IA que automatiza el ciclo completo de trade finance:

```
Solicitud → ComplianceNFT → Escrow on-chain → Carta de Crédito NFT
    → Yield en Aave V3 → Settlement SPEI/PIX/PSE/CVU → Audit NFT
```

**Todo en < 60 segundos. 0.3% de fee. 100% on-chain.**

---

## 🏗 Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                        NEXUS LATAM                              │
│                                                                 │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────────┐    │
│  │  Next.js 14  │   │  Express API │   │ Arbitrum Stylus  │    │
│  │  Dashboard   │◄──│  REST + WS   │◄──│  Smart Contracts │    │
│  └──────────────┘   └──────┬───────┘   └──────────────────┘    │
│                            │                                    │
│              ┌─────────────┼─────────────┐                     │
│              ▼             ▼             ▼                     │
│  ┌───────────────┐ ┌──────────────┐ ┌───────────────┐         │
│  │ NexusRouter   │ │Compliance    │ │ TradeAgent    │         │
│  │ (Orchestrator)│ │Agent         │ │ (LC + Escrow) │         │
│  └───────┬───────┘ └──────┬───────┘ └───────┬───────┘         │
│          │ Claude Opus 4.7│                  │                  │
│  ┌───────┴───────┐ ┌──────┴───────┐          │                  │
│  │  YieldAgent  │ │  AuditAgent  │◄──────────┘                  │
│  │  (Aave V3)   │ │  (Merkle)    │                             │
│  └──────────────┘ └──────────────┘                             │
│                                                                 │
│  External: Bitso Business API · Rare Protocol CLI · IPFS       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🤖 Los 5 Agentes

| Agente | Rol | Tecnología |
|--------|-----|------------|
| **NexusRouter** | Orquesta el flujo completo | Claude Opus 4.7 + Adaptive Thinking |
| **ComplianceAgent** | KYC/AML → ComplianceNFT | Claude + Bitso Business KYC API |
| **TradeAgent** | Cartas de Crédito → LC-NFT | Claude + Rare Protocol CLI |
| **YieldAgent** | Depósito en Aave V3 | Claude + NexusVault (Rust) |
| **AuditAgent** | Merkle bundles → Audit-NFT | Claude + Rare Protocol CLI |

Todos usan **prompt caching** ($0.30/1M tokens) y **adaptive thinking** de Claude Opus 4.7.

---

## 🦀 Smart Contracts (Arbitrum Stylus / Rust)

| Contrato | Descripción |
|----------|-------------|
| `TradeEscrow` | Gestiona estados PENDING→FUNDED→DELIVERED→SETTLED→DISPUTED |
| `BatchPayment` | Procesa hasta 500 pagos en 1 transacción |
| `NexusVault` | Integración Aave V3 para yield automático |
| `ComplianceRegistry` | Registro on-chain KYC con tiers BASIC/VERIFIED/PREMIUM |

> Gas savings vs Solidity: **~100x** gracias a Arbitrum Stylus.

---

## 🎴 NFT Ecosystem (Rare Protocol)

| NFT | Colección | Cuándo se acuña |
|-----|-----------|-----------------|
| **ComplianceNFT** | `NEXUS-COMPLIANCE-{COUNTRY}` | Al completar KYC/AML |
| **LC-NFT** | `NEXUS-LETTERS-OF-CREDIT` | Al crear Carta de Crédito |
| **Settlement-NFT** | `NEXUS-SETTLEMENTS` | Al liquidar operación |
| **Audit-NFT** | `NEXUS-AUDIT-TRAIL` | Cada 500 transacciones |

---

## 🌐 Multi-Rail LATAM

| País | Rail | Moneda |
|------|------|--------|
| 🇲🇽 México | SPEI | MXN → USDC |
| 🇧🇷 Brasil | PIX | BRL → USDC |
| 🇨🇴 Colombia | PSE | COP → USDC |
| 🇦🇷 Argentina | CVU | ARS → USDC |
| 🇵🇪 Perú | CCI | PEN → USDC |
| 🇨🇱 Chile | TEF | CLP → USDC |

---

## 🚀 Quick Start

```bash
# 1. Clonar
git clone https://github.com/ALFA117/Nexus-Latam.git
cd Nexus-Latam

# 2. Variables de entorno
cp .env.example .env
# Editar .env con tus claves

# 3. Frontend
cd apps/frontend
npm install
npm run dev
# → http://localhost:3000

# 4. API (otro terminal)
cd apps/api
npm install
npm run dev
# → http://localhost:3001

# 5. Contratos Rust (requiere Arbitrum Stylus toolchain)
cd apps/contracts
cargo stylus check
cargo stylus deploy --private-key $PRIVATE_KEY
```

---

## 📁 Estructura del Monorepo

```
nexus-latam/
├── apps/
│   ├── contracts/          # Rust — Arbitrum Stylus smart contracts
│   │   └── src/
│   │       ├── trade_escrow.rs
│   │       ├── batch_payment.rs
│   │       ├── nexus_vault.rs
│   │       └── compliance_registry.rs
│   ├── agents/             # TypeScript — 5 AI agents + services
│   │   ├── orchestrator/nexus.orchestrator.ts
│   │   └── services/
│   │       ├── bitso.service.ts
│   │       ├── rare.service.ts
│   │       └── arbitrum.service.ts
│   ├── api/                # Express REST API
│   └── frontend/           # Next.js 14 dashboard
│       ├── app/
│       │   ├── page.tsx          # Landing cyberpunk
│       │   ├── trades/           # Command center
│       │   ├── compliance/       # KYC registry
│       │   └── audit/            # Audit trail
│       └── components/
├── .github/workflows/ci.yml
├── vercel.json
└── .env.example
```

---

## 🛠 Tech Stack

| Capa | Tecnología |
|------|------------|
| Smart Contracts | Rust + Arbitrum Stylus SDK |
| AI Agents | Claude Opus 4.7 (Anthropic SDK) + Prompt Caching |
| Pagos | Bitso Business API (HMAC-SHA256) |
| NFTs | Rare Protocol CLI (`@rareprotocol/rare-cli`) |
| Yield | Aave V3 en Arbitrum |
| Frontend | Next.js 14 + Tailwind CSS + wagmi/viem |
| API | Express.js + TypeScript |
| Deploy | Vercel + GitHub Actions |

---

## 🏆 ETH México 2026

Proyecto presentado en el **Arbitrum Track** de ETH México 2026.

- **Problema**: Trade finance ineficiente para PYMEs LATAM
- **Solución**: Protocolo autónomo con IA + blockchain + pagos reales
- **Impacto**: 40M+ PYMEs con acceso a financiamiento en < 60s

---

## 📄 Licencia

MIT — © 2026 NEXUS LATAM
