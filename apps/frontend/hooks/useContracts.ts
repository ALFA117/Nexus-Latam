'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { arbitrumSepolia } from '../lib/wagmi-config';

// ─── Contract addresses (set via env vars when deployed) ─────────────────────
const ADDRESSES = {
  tradeEscrow:        (process.env.NEXT_PUBLIC_TRADE_ESCROW_ADDRESS        ?? '0x0000000000000000000000000000000000000000') as `0x${string}`,
  complianceRegistry: (process.env.NEXT_PUBLIC_COMPLIANCE_REGISTRY_ADDRESS ?? '0x0000000000000000000000000000000000000000') as `0x${string}`,
  nexusVault:         (process.env.NEXT_PUBLIC_NEXUS_VAULT_ADDRESS          ?? '0x0000000000000000000000000000000000000000') as `0x${string}`,
  batchPayment:       (process.env.NEXT_PUBLIC_BATCH_PAYMENT_ADDRESS        ?? '0x0000000000000000000000000000000000000000') as `0x${string}`,
};

// The Stylus contracts have never been deployed (no NEXT_PUBLIC_*_ADDRESS is
// set), so every address above is the zero address. Reading it only sent RPC
// calls to address(0) from each visitor's browser and left the UI on "..."
// until they timed out; writing to it would ask a connected wallet to sign a
// transaction to address(0). Hooks are disabled until a real address exists.
const ZERO = '0x0000000000000000000000000000000000000000';
const isDeployed = (addr: string) => /^0x[0-9a-fA-F]{40}$/.test(addr) && addr.toLowerCase() !== ZERO;

export const DEPLOYED = {
  tradeEscrow:        isDeployed(ADDRESSES.tradeEscrow),
  complianceRegistry: isDeployed(ADDRESSES.complianceRegistry),
  nexusVault:         isDeployed(ADDRESSES.nexusVault),
  batchPayment:       isDeployed(ADDRESSES.batchPayment),
};

/** True only when every protocol contract has a real address configured. */
export const CONTRACTS_DEPLOYED = Object.values(DEPLOYED).every(Boolean);

// Minimal ABIs — only the functions we actually call from the frontend
const TRADE_ESCROW_ABI = [
  { name: 'getState',   type: 'function', stateMutability: 'view',       inputs: [{ name: 'tradeId', type: 'bytes32' }], outputs: [{ name: '', type: 'uint8' }] },
  { name: 'getAmount',  type: 'function', stateMutability: 'view',       inputs: [{ name: 'tradeId', type: 'bytes32' }], outputs: [{ name: '', type: 'uint256' }] },
  { name: 'confirmDelivery', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'tradeId', type: 'bytes32' }], outputs: [] },
] as const;

const COMPLIANCE_ABI = [
  { name: 'getComplianceScore', type: 'function', stateMutability: 'view', inputs: [{ name: 'wallet', type: 'address' }], outputs: [{ name: '', type: 'uint256' }] },
  { name: 'getTier',            type: 'function', stateMutability: 'view', inputs: [{ name: 'wallet', type: 'address' }], outputs: [{ name: '', type: 'uint8' }] },
  { name: 'isCompliant',        type: 'function', stateMutability: 'view', inputs: [{ name: 'wallet', type: 'address' }], outputs: [{ name: '', type: 'bool' }] },
] as const;

const NEXUS_VAULT_ABI = [
  { name: 'getTVL',       type: 'function', stateMutability: 'view', inputs: [],                                                outputs: [{ name: '', type: 'uint256' }] },
  { name: 'getAPY',       type: 'function', stateMutability: 'view', inputs: [],                                                outputs: [{ name: '', type: 'uint256' }] },
  { name: 'getPosition',  type: 'function', stateMutability: 'view', inputs: [{ name: 'tradeId', type: 'bytes32' }],           outputs: [{ name: '', type: 'uint256' }] },
] as const;

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useTradeState(tradeId: `0x${string}` | undefined) {
  const STATE_LABELS = ['PENDING', 'FUNDED', 'DELIVERED', 'SETTLED', 'DISPUTED'] as const;

  const { data, isLoading, error } = useReadContract({
    address:      ADDRESSES.tradeEscrow,
    abi:          TRADE_ESCROW_ABI,
    functionName: 'getState',
    args:         tradeId ? [tradeId] : undefined,
    chainId:      arbitrumSepolia.id,
    query: { enabled: DEPLOYED.tradeEscrow && Boolean(tradeId) },
  });

  return {
    stateNum:   data as number | undefined,
    stateLabel: data !== undefined ? (STATE_LABELS[data as number] ?? 'UNKNOWN') : undefined,
    isLoading,
    error,
  };
}

export function useComplianceStatus(walletAddress: `0x${string}` | undefined) {
  const TIER_LABELS = ['NONE', 'BASIC', 'VERIFIED', 'PREMIUM'] as const;

  const { data: score,    isLoading: loadingScore }    = useReadContract({
    address: ADDRESSES.complianceRegistry, abi: COMPLIANCE_ABI, functionName: 'getComplianceScore',
    args: walletAddress ? [walletAddress] : undefined, chainId: arbitrumSepolia.id,
    query: { enabled: DEPLOYED.complianceRegistry && Boolean(walletAddress) },
  });

  const { data: tierNum,  isLoading: loadingTier }     = useReadContract({
    address: ADDRESSES.complianceRegistry, abi: COMPLIANCE_ABI, functionName: 'getTier',
    args: walletAddress ? [walletAddress] : undefined, chainId: arbitrumSepolia.id,
    query: { enabled: DEPLOYED.complianceRegistry && Boolean(walletAddress) },
  });

  const { data: compliant, isLoading: loadingCompliant } = useReadContract({
    address: ADDRESSES.complianceRegistry, abi: COMPLIANCE_ABI, functionName: 'isCompliant',
    args: walletAddress ? [walletAddress] : undefined, chainId: arbitrumSepolia.id,
    query: { enabled: DEPLOYED.complianceRegistry && Boolean(walletAddress) },
  });

  return {
    score:     score as bigint | undefined,
    tier:      tierNum !== undefined ? (TIER_LABELS[tierNum as number] ?? 'UNKNOWN') : undefined,
    compliant: compliant as boolean | undefined,
    isLoading: loadingScore || loadingTier || loadingCompliant,
  };
}

export function useVaultStats() {
  const { data: tvl,  isLoading: loadingTvl }  = useReadContract({
    address: ADDRESSES.nexusVault, abi: NEXUS_VAULT_ABI, functionName: 'getTVL', chainId: arbitrumSepolia.id,
    query: { enabled: DEPLOYED.nexusVault },
  });
  const { data: apy,  isLoading: loadingApy }  = useReadContract({
    address: ADDRESSES.nexusVault, abi: NEXUS_VAULT_ABI, functionName: 'getAPY', chainId: arbitrumSepolia.id,
    query: { enabled: DEPLOYED.nexusVault },
  });

  return {
    tvlRaw:    tvl  as bigint | undefined,
    apyBps:    apy  as bigint | undefined,
    tvlUSDC:   tvl  ? Number(tvl)  / 1e6 : undefined,
    apyPct:    apy  ? Number(apy)  / 100  : undefined,
    isLoading: loadingTvl || loadingApy,
  };
}

export function useConfirmDelivery() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const confirm = (tradeId: `0x${string}`) => {
    if (!DEPLOYED.tradeEscrow) throw new Error('TradeEscrow no está desplegado');
    writeContract({
      address:      ADDRESSES.tradeEscrow,
      abi:          TRADE_ESCROW_ABI,
      functionName: 'confirmDelivery',
      args:         [tradeId],
      chainId:      arbitrumSepolia.id,
    });
  };

  return { confirm, available: DEPLOYED.tradeEscrow, hash, isPending: isPending || isConfirming, isSuccess, error };
}
