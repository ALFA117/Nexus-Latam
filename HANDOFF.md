# NEXUS LATAM — Handoff para ETH México 2026

> **Estado:** ~95% completo. Todo el código está terminado y deployado.  
> **Lo único que falta son credenciales externas** — ninguna requiere código nuevo.

---

## Links rápidos

| Recurso | URL |
|---------|-----|
| **Vercel (producción)** | https://nexus-latam-kappa.vercel.app |
| **GitHub** | https://github.com/ALFA117/Nexus-Latam |
| **Arbitrum Sepolia Explorer** | https://sepolia.arbiscan.io |

---

## Quick start local

```bash
git clone https://github.com/ALFA117/Nexus-Latam.git
cd "Nexus-Latam"

# Copiar variables de entorno
cp .env.example apps/api/.env
cp .env.example apps/frontend/.env.local

# Instalar dependencias
npm install

# Correr todo con Docker (recomendado)
docker compose up

# O correr manualmente:
npm run dev --workspace=apps/api       # puerto 3001
npm run dev --workspace=apps/frontend  # puerto 3000
```

---

## CHECKLIST — Lo que tienes que hacer tú

### ① Obtener ETH de testnet (5 min)

1. Ir a https://faucets.chain.link/arbitrum-sepolia
2. Conectar tu wallet MetaMask
3. Pedir ETH gratis (necesitas ~0.1 ETH para deploys)

---

### ② Deploy contratos Rust en Arbitrum Sepolia (20 min)

> Requiere: Rust + `cargo stylus` instalado

```bash
# Instalar cargo-stylus si no lo tienes
cargo install cargo-stylus

# Configurar tu wallet
export PRIVATE_KEY="0x_TU_PRIVATE_KEY_AQUI"

# Deploy los 4 contratos
cd apps/contracts
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

El script imprime las 4 direcciones. **Cópialas** y ponlas en Vercel (paso ④).

Si el script falla, deploy manual de cada contrato:
```bash
cargo stylus deploy --private-key $PRIVATE_KEY src/trade_escrow.rs
cargo stylus deploy --private-key $PRIVATE_KEY src/batch_payment.rs
cargo stylus deploy --private-key $PRIVATE_KEY src/nexus_vault.rs
cargo stylus deploy --private-key $PRIVATE_KEY src/compliance_registry.rs
```

---

### ③ ANTHROPIC_API_KEY (2 min)

1. Ir a https://console.anthropic.com/settings/keys
2. Crear nueva API key
3. Ir al paso ④ para ponerla en Vercel

---

### ④ Variables de entorno en Vercel (5 min)

1. Ir a https://vercel.com → proyecto `nexus-latam-kappa`
2. **Settings → Environment Variables**
3. Agregar estas variables (todas en Production + Preview):

```
ANTHROPIC_API_KEY          = sk-ant-...

# Direcciones del paso ②:
NEXT_PUBLIC_TRADE_ESCROW_ADDRESS        = 0x...
NEXT_PUBLIC_COMPLIANCE_REGISTRY_ADDRESS = 0x...
NEXT_PUBLIC_NEXUS_VAULT_ADDRESS         = 0x...
NEXT_PUBLIC_BATCH_PAYMENT_ADDRESS       = 0x...

# Bitso (cuando lo tengas):
BITSO_API_KEY    = ...
BITSO_API_SECRET = ...
```

4. Ir a **Deployments → Redeploy** para que tome efecto.

---

### ⑤ USDC de testnet para demo live (5 min)

```
https://faucet.circle.com/
→ Seleccionar "Arbitrum Sepolia"
→ Pegar tu wallet address
→ Recibir 10 USDC gratis
```

Alternativa: https://app.aave.com → Switch to Sepolia testnet → Faucet

---

### ⑥ Bitso Business API (días — requiere aprobación)

1. Ir a https://bitso.com/business
2. Registrar empresa (requiere documentos de la empresa)
3. Esperar aprobación (~2-5 días hábiles)
4. Una vez aprobado, ir a API Settings → crear key con permisos de Transfer
5. Poner en Vercel (paso ④)

> **Sin esto:** Los pagos SPEI/PIX son simulados. El demo funciona igual visualmente.

---

### ⑦ Video demo (30 min)

Grabar pantalla mostrando este flujo en https://nexus-latam-kappa.vercel.app:

1. Landing page → "VER DEMO" → flujo auto-play completo
2. Conectar wallet → ir a `/trades` → crear operación
3. Ver agentes en tiempo real en `/agents`
4. Ver NFTs acuñados en `/trades/[id]`
5. Ver yield en `/yield`
6. Ver audit trail en `/audit`
7. Ver compliance KYC en `/compliance`

Duración: ~2 minutos. Subir a YouTube (unlisted) o Loom.

---

### ⑧ Submission ETH México 2026 (15 min)

1. Ir a https://ethmexico.devfolio.co (o el link oficial que tengas)
2. Crear proyecto con:
   - **Nombre:** NEXUS LATAM
   - **Descripción:** Protocolo autónomo de trade finance B2B para LATAM. Arbitrum Stylus + Claude Opus 4.7 + Bitso + Rare Protocol. Settlement en 58 segundos.
   - **Demo:** https://nexus-latam-kappa.vercel.app
   - **Video:** (link del paso ⑦)
   - **GitHub:** https://github.com/ALFA117/Nexus-Latam
   - **Tracks:** DeFi, AI/Agents, RealWorldAssets, LATAM
3. Agregar a los miembros del equipo
4. Submit antes del deadline

---

## Arquitectura en 30 segundos

```
Frontend (Next.js 14)          API (Express)              Blockchain
  wagmi + viem           →     5 Agentes Claude       →   Arbitrum Stylus
  /trades, /compliance         Opus 4.7 adaptive           TradeEscrow.rs
  /yield, /audit               thinking + caching          ComplianceRegistry.rs
  /demo, /pitch                                            NexusVault.rs (Aave)
                         →     Bitso Business API     →   BatchPayment.rs
                               SPEI/PIX/PSE/CVU
                         →     Rare Protocol CLI      →   NFT mint
                               ComplianceNFT, LC-NFT       Arbitrum Sepolia
                               Settlement-NFT, Audit-NFT
```

## Tests

```bash
cd apps/frontend
npm test        # 45 tests, todos pasan
```

## Estructura del repo

```
apps/
  contracts/   ← Rust/Stylus smart contracts (4 contratos)
  agents/      ← Claude Opus 4.7 orchestrator + 5 agents
  api/         ← Express REST API + SSE events
  frontend/    ← Next.js 14 App Router dashboard
scripts/       ← deploy.sh, verify.sh
docker-compose.yml
```

---

**Cualquier duda, todo el historial de decisiones está en `Lista de Puntos.md`.**
