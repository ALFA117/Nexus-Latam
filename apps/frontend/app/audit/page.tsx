'use client';

import { AuditTrailTable } from '../../components/AuditTrailTable';
import Link                from 'next/link';

export default function AuditPage() {
  return (
    <div className="min-h-screen bg-[#0D1B2A] text-white font-mono p-6">
      <Link href="/" className="text-gray-500 text-sm hover:text-[#00D4FF]">← Dashboard</Link>
      <h2 className="text-2xl font-bold text-[#00D4FF] mt-2 mb-2">Trail de Auditoría On-Chain</h2>
      <p className="text-gray-400 text-sm mb-6">
        Registro inmutable de todas las operaciones. Cada 500 transacciones se acuña un Audit NFT consultable por reguladores.
      </p>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Bundles',     value: '12' },
          { label: 'Transacciones',     value: '6,000+' },
          { label: 'Último Bundle',     value: '#12' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-[#1A2840] rounded-xl p-4 border border-[#00D4FF22]">
            <p className="text-gray-400 text-xs uppercase">{kpi.label}</p>
            <p className="text-[#F7B731] text-2xl font-bold mt-1">{kpi.value}</p>
          </div>
        ))}
      </div>

      <AuditTrailTable />
    </div>
  );
}
