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

Mongli_Dao 2026
MIT — © 2026 NEXUS LATAM

## FIX_NOTES — frontend (rediseño /diseno, 2026-10-11)

- **El hero se cortaba en celular**: la línea "PROTOCOLO DE ___" era un flex sin wrap con `min-w-[280px]` y empujaba el hero a 455 px en una pantalla de 380, así que el badge, el párrafo y los botones quedaban truncados por la derecha. Ahora se apila en celular. El hero también tiene aire debajo de la barra fija y usa `100dvh`.
- **Cifras inventadas como si fueran reales**: el hero decía "$1.2M+ volumen 24h" en un despliegue de testnet. Ahora dice `Sepolia · Arbitrum testnet` y "<60s settlement objetivo". Los KPIs de Auditoría ($24.5M, 21,000+ tx) y de Yield (posiciones de ejemplo) llevan `DemoBadge`. "AuditAgent / ComplianceAgent / YieldAgent online" pasó a "· simulado", porque esos agentes no están desplegados (ya lo decía el propio `DemoBadge.tsx`).
- **Contraste**: 191 textos en `text-white/15…45` (entre ~1.6:1 y 4:1) subieron a `/55–/60` (≈6:1). "PROTOCOLO DE" pasó de cian al 33 % al 70 %.
- **Errores crudos**: "Failed to fetch" se ve ahora como "No se pudo conectar con la API de NEXUS…", con `role="alert"` y un botón **Reintentar** en Trades.
- **Emojis como íconos** (📊 ⚡ 📈 🤖 ⛓ 🔐 🌎 🎉): ahora son SVG de trazo (`components/Glyph.tsx`) que heredan el color de cada tarjeta.
- **Íconos que no existían**: el manifest pedía `icon-192.png`, `icon-512.png` y `screenshot-desktop.png` (404 en consola). Ya existen, además de `app/icon.png` y `app/apple-icon.png`. `screenshot-desktop.png` es una captura real de la home y también sirve de imagen OG.
- **Botones móviles**: los botones neón pasaron de 11 px de texto a 12 px y 44 px de alto, y el menú (☰) a 44×44, con `aria-expanded`.
- **SEO**: `metadataBase`, canonical, `og:url`, imagen OG, `robots.ts` y `sitemap.ts`. `theme-color` ahora es el fondo (#060D17) y no el cian.

## DESIGN_NOTES — frontend

- **Fondo 3D: el dado sacó la receta 2 (terreno de ondas en wireframe).** Es un océano de datos cian que ondula hacia el horizonte (las rutas del comercio B2B), con las filas lejanas en morado. Encima flotan **contenedores de carga en CSS 3D** con nervaduras y etiqueta de ruta (`MX→AR`, `LC-NFT`, `USDC`): lo que Nexus liquida. El puntero inclina la cámara del terreno y el scroll mueve cada capa a su velocidad (en píxeles; con `scrollYProgress` el fondo arrancaba como si ya hubieras hecho scroll hasta abajo). Es completo en `/` y tranquilo en las demás páginas (un contenedor, terreno al 60 %). En celular hay menos filas y columnas, DPR ≤ 2, pausa con la pestaña oculta y escena quieta con `prefers-reduced-motion`. `components/AmbientBackground.tsx`, montado en `layout.tsx`.
- Se quitó la cuadrícula `grid-bg` (genérica) y el `bg-[#060D17]` opaco de las 19 páginas, para que el fondo se vea en toda la app.
- **No se hizo modo claro.** El proyecto pinta sus colores con más de 800 hex/rgba inline, y 330 se arman concatenando alfa (`${color}20`, `#00D4FF30`). Un modo claro serio implica reescribir esos estilos a tokens, con riesgo alto de romper la UI. Queda como pendiente explícito.

### Checklist de 2 minutos en el celular

1. Abre la home: el hero se ve completo (badge, título, párrafo, botones), sin nada cortado a la derecha.
2. Abajo del hero ondula el terreno cian y flotan dos contenedores girando.
3. Las cifras dicen "Sepolia · Arbitrum testnet", ya no "$1.2M volumen".
4. Entra a Trades sin backend: aparece el aviso rojo con "Reintentar" y los datos de ejemplo etiquetados.
5. Abre el menú ☰: el botón se toca sin fallar.
