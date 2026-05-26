#!/bin/bash
set -e

echo "=== NEXUS LATAM — Deploy to Arbitrum Sepolia ==="

# Verify env vars
: "${PRIVATE_KEY:?Need PRIVATE_KEY}"
: "${ARBITRUM_SEPOLIA_RPC:?Need ARBITRUM_SEPOLIA_RPC}"

RPC="https://sepolia-rollup.arbitrum.io/rpc"
CHAIN_ID=421614

echo "[1/4] Compiling contracts to WASM..."
cargo build --release --target wasm32-unknown-unknown

echo "[2/4] Deploying TradeEscrow..."
TRADE_ESCROW=$(cast stylus deploy \
  --private-key "$PRIVATE_KEY" \
  --rpc-url "$RPC" \
  --wasm-file ./target/wasm32-unknown-unknown/release/nexus.wasm \
  2>&1 | grep "Contract address:" | awk '{print $3}')
echo "TradeEscrow deployed at: $TRADE_ESCROW"

echo "[3/4] Deploying BatchPayment..."
BATCH_PAYMENT=$(cast stylus deploy \
  --private-key "$PRIVATE_KEY" \
  --rpc-url "$RPC" \
  --wasm-file ./target/wasm32-unknown-unknown/release/nexus.wasm \
  2>&1 | grep "Contract address:" | awk '{print $3}')
echo "BatchPayment deployed at: $BATCH_PAYMENT"

echo "[4/4] Verifying contracts on Arbiscan..."
cast stylus verify \
  --address "$TRADE_ESCROW" \
  --rpc-url "$RPC"

echo ""
echo "=== Deployment Complete ==="
echo "TradeEscrow:  $TRADE_ESCROW"
echo "BatchPayment: $BATCH_PAYMENT"
echo ""
echo "Arbiscan: https://sepolia.arbiscan.io/address/$TRADE_ESCROW"

# Save addresses to .env.contracts for the agents
cat > ../../.env.contracts <<EOF
TRADE_ESCROW_ADDRESS=$TRADE_ESCROW
BATCH_PAYMENT_ADDRESS=$BATCH_PAYMENT
ARBITRUM_CHAIN_ID=$CHAIN_ID
EOF
echo "Addresses saved to .env.contracts"
