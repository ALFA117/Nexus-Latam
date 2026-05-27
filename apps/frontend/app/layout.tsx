import type { Metadata } from 'next';
import './globals.css';
import { WagmiProvider } from '../components/WagmiProvider';

export const metadata: Metadata = {
  title:       'NEXUS LATAM — Protocolo Autónomo de Financiamiento Comercial',
  description: 'El primer protocolo de IA que liquida, financia y audita el comercio B2B de LATAM en menos de 60 segundos. Powered by Arbitrum + Bitso + Claude AI.',
  keywords:    ['DeFi', 'LATAM', 'Trade Finance', 'Arbitrum', 'Bitso', 'NFT', 'AI Agents'],
  openGraph: {
    title:       'NEXUS LATAM',
    description: 'Protocolo Autónomo de Financiamiento Comercial para LATAM',
    type:        'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Orbitron:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <WagmiProvider>
          {children}
        </WagmiProvider>
      </body>
    </html>
  );
}
