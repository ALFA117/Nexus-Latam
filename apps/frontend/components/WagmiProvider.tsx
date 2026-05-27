'use client';

import dynamic from 'next/dynamic';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

/* Wagmi must be client-only — no SSR */
const WagmiCore = dynamic(
  () => import('wagmi').then(m => m.WagmiProvider),
  { ssr: false }
);

import { wagmiConfig } from '../lib/wagmi-config';

export function WagmiProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <WagmiCore config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiCore>
  );
}
