import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Command Center',
  description: 'Centro de operaciones de NEXUS LATAM (demo con datos de ejemplo): cartas de crédito B2B, estados de escrow, settlements SPEI/PIX y actividad de agentes IA.',
  openGraph: {
    title:       'NEXUS LATAM — Command Center · Demo de operaciones B2B',
    description: 'Dashboard de operaciones: escrow states, LC-NFT, settlement multi-rail (SPEI · PIX · PSE · CVU) y agentes IA en tiempo real.',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'NEXUS LATAM — Command Center',
    description: 'Operaciones B2B en tiempo real · Escrow · LC-NFT · Settlement SPEI/PIX · 5 agentes IA activos.',
  },
};

export default function TradesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
