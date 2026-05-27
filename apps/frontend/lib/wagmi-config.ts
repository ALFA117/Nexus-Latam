import { createConfig, http } from 'wagmi';
import { arbitrum, arbitrumSepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

const PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? 'nexus-latam-dev';

export const wagmiConfig = createConfig({
  chains:     [arbitrumSepolia, arbitrum],
  connectors: [
    injected(),
    /* metaMask y walletConnect se añaden cuando los env vars estén configurados */
  ],
  transports: {
    [arbitrumSepolia.id]: http(process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC ?? 'https://sepolia-rollup.arbitrum.io/rpc'),
    [arbitrum.id]:        http(process.env.NEXT_PUBLIC_ARBITRUM_RPC        ?? 'https://arb1.arbitrum.io/rpc'),
  },
  ssr: true,
});

export { arbitrum, arbitrumSepolia };
export { PROJECT_ID };
