import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Demo Interactivo',
  description: 'Sigue el flujo completo de una Carta de Crédito B2B paso a paso: KYC → Escrow → LC-NFT → Yield → Settlement → Audit. 7 pasos · 5 agentes IA · <60s.',
  openGraph: {
    title:       'NEXUS LATAM — Demo Interactivo',
    description: 'Flujo completo: KYC · LC-NFT · Aave V3 · Settlement PIX/SPEI · Audit-NFT. Todo en menos de 60 segundos.',
  },
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
