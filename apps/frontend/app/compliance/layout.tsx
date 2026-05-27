import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KYC Registry',
  description: 'Registro de Compliance KYC on-chain de NEXUS LATAM. Verifica identidad de wallets con tiers BASIC · VERIFIED · PREMIUM. ComplianceNFT emitido por el ComplianceAgent vía Bitso Business.',
  openGraph: {
    title:       'NEXUS LATAM — KYC Registry · Compliance On-Chain',
    description: 'ComplianceNFT · Tiers BASIC/VERIFIED/PREMIUM · KYC/AML vía Bitso Business · Registro inmutable en Arbitrum.',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'NEXUS LATAM — KYC Registry',
    description: 'Compliance KYC on-chain · ComplianceNFT · Bitso Business API · Arbitrum Stylus.',
  },
};

export default function ComplianceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
