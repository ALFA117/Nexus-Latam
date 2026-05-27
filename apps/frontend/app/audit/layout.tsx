import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Audit Trail',
  description: 'Trail de auditoría inmutable de NEXUS LATAM. Bundles de hasta 500 transacciones comprimidas en Merkle trees. Audit-NFT acuñado on-chain en Arbitrum con Merkle root verificable.',
  openGraph: {
    title:       'NEXUS LATAM — Audit Trail · Merkle Bundles On-Chain',
    description: 'Bundles de 500 txs · Merkle tree · Audit-NFT inmutable · Trazabilidad completa de operaciones B2B en Arbitrum.',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'NEXUS LATAM — Audit Trail',
    description: 'Merkle bundles · Audit-NFT · 500 txs por bundle · Trazabilidad inmutable en Arbitrum.',
  },
};

export default function AuditLayout({ children }: { children: React.ReactNode }) {
  return children;
}
