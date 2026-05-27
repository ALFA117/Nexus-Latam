import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pitch Deck',
  description: 'NEXUS LATAM — El primer protocolo autónomo de financiamiento comercial B2B para LATAM. Problema de $350B, solución con 5 agentes IA, Arbitrum Stylus y Bitso Business. ETH México 2026.',
  openGraph: {
    title:       'NEXUS LATAM — Pitch Deck · ETH México 2026',
    description: 'Protocolo autónomo que resuelve el gap de $350B en financiamiento B2B de LATAM. 5 agentes IA + Arbitrum Stylus + Bitso. Settlement en <60s.',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'NEXUS LATAM Pitch — ETH México 2026 Hackathon',
    description: '$350B problema · 5 agentes IA · <60s settlement · Arbitrum Stylus + Bitso Business.',
  },
};

export default function PitchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
