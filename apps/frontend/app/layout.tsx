import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, JetBrains_Mono, Orbitron } from 'next/font/google';
import './globals.css';
import { WagmiProvider }   from '../components/WagmiProvider';
import { ToastProvider }   from '../components/ToastProvider';
import { AmbientBackground } from '../components/AmbientBackground';

// Self-hosted at build time: no runtime request to fonts.googleapis.com, which
// the CSP (connect-src) blocked once the PWA service worker took over the page,
// so returning visitors fell back to system fonts.
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--font-space-grotesk', display: 'swap' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-jetbrains-mono', display: 'swap' });
const orbitron = Orbitron({ subsets: ['latin'], weight: ['400', '700', '900'], variable: '--font-orbitron', display: 'swap' });

export const viewport: Viewport = {
  themeColor: '#060D17',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://nexus-latam-kappa.vercel.app'),
  alternates:   { canonical: '/' },
  title: {
    default:  'NEXUS LATAM — Protocolo Autónomo de Financiamiento Comercial',
    template: '%s | NEXUS LATAM',
  },
  description: 'El primer protocolo de IA que liquida, financia y audita el comercio B2B de LATAM en menos de 60 segundos. Powered by Arbitrum Stylus + Claude AI + Bitso Business.',
  keywords:    ['DeFi', 'LATAM', 'Trade Finance', 'Arbitrum', 'Bitso', 'NFT', 'AI Agents', 'ETH México', 'Hackathon', 'B2B', 'KYC', 'Carta de Crédito'],
  authors:     [{ name: 'NEXUS LATAM Team' }],
  creator:     'NEXUS LATAM',
  openGraph: {
    title:       'NEXUS LATAM — Protocolo B2B Autónomo para LATAM',
    description: '5 agentes IA que liquidan, financian y auditan comercio B2B en <60s. Arbitrum Stylus + Claude AI + Bitso Business. ETH México 2026.',
    type:        'website',
    locale:      'es_MX',
    siteName:    'NEXUS LATAM',
    url:         'https://nexus-latam-kappa.vercel.app',
    images:      [{ url: '/screenshot-desktop.png', width: 1280, height: 720, alt: 'NEXUS LATAM' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'NEXUS LATAM — Trade Finance Autónomo para LATAM',
    description: '5 agentes IA + Arbitrum Stylus + Bitso. Settlement en <60s. ETH México 2026 Hackathon.',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable:          true,
    statusBarStyle:   'black-translucent',
    title:            'NEXUS LATAM',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`dark ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${orbitron.variable}`}>
      <body>
        <AmbientBackground />
        <WagmiProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
