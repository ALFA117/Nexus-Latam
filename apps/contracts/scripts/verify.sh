#!/bin/bash
set -e

: "${CONTRACT_ADDRESS:?Need CONTRACT_ADDRESS}"

RPC="https://sepolia-rollup.arbitrum.io/rpc"

echo "=== Verifying NEXUS contract on Arbitrum Sepolia ==="
echo "Address: $CONTRACT_ADDRESS"

cast stylus verify \
  --address "$CONTRACT_ADDRESS" \
  --rpc-url "$RPC"

echo ""
echo "Verified! View on Arbiscan:"
echo "https://sepolia.arbiscan.io/address/$CONTRACT_ADDRESS"
