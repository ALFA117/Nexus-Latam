import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Yield Vault',
  description: 'Yield Vault de NEXUS LATAM — Fondos en escrow generando rendimiento en Aave V3 durante el período de trade. 20% del yield para el protocolo, 80% para el seller.',
  openGraph: {
    title:       'NEXUS LATAM — Yield Vault · Aave V3 Integration',
    description: 'Fondos B2B generando APY en Aave V3. Split 80/20: seller recibe el 80% del yield acumulado al settlement. TVL en tiempo real.',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'NEXUS LATAM — Yield Vault',
    description: 'Aave V3 · Split 80/20 · APY en USDC · Fondos B2B trabajando mientras esperan settlement.',
  },
};

export default function YieldLayout({ children }: { children: React.ReactNode }) {
  return children;
}
