import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Command Center',
  description: 'Centro de operaciones en tiempo real de NEXUS LATAM. Monitorea cartas de crédito B2B, estados de escrow, settlements SPEI/PIX y actividad de agentes IA en vivo.',
  openGraph: {
    title:       'NEXUS LATAM — Command Center · Operaciones B2B en Vivo',
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
