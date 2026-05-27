import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agentes IA',
  description: '5 agentes IA autónomos que orquestan el protocolo NEXUS LATAM: Compliance, Trade, Yield, Audit y Router. Powered by Claude Opus 4.7 con adaptive thinking y prompt caching.',
  openGraph: {
    title:       'NEXUS LATAM — Intelligence Layer: 5 Agentes IA',
    description: 'ComplianceAgent · TradeAgent · YieldAgent · AuditAgent · NexusRouter. Todos powered by Claude Opus 4.7 con adaptive thinking.',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'NEXUS LATAM — 5 Agentes IA Autónomos',
    description: 'Claude Opus 4.7 · Adaptive thinking · Prompt caching · 5 agentes especializados en trade finance B2B.',
  },
};

export default function AgentsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
