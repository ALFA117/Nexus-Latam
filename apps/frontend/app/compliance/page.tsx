'use client';

import { useState }              from 'react';
import { ComplianceNFTCard }     from '../../components/ComplianceNFTCard';
import { useNexusAPI }           from '../../hooks/useNexusAPI';
import Link                      from 'next/link';

export default function CompliancePage() {
  const [address, setAddress] = useState('');
  const [result, setResult]   = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const { getComplianceNFT }  = useNexusAPI();

  const lookup = async () => {
    if (!address) return;
    setLoading(true);
    try {
      const data = await getComplianceNFT(address);
      setResult(data as Record<string, unknown>);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1B2A] text-white font-mono p-6">
      <Link href="/" className="text-gray-500 text-sm hover:text-[#00D4FF]">← Dashboard</Link>
      <h2 className="text-2xl font-bold text-[#00D4FF] mt-2 mb-6">Certificados de Cumplimiento</h2>

      <div className="bg-[#1A2840] rounded-xl p-6 border border-[#00D4FF22] max-w-xl mb-8">
        <p className="text-gray-400 text-sm mb-4">
          Consulta el NFT de cumplimiento KYC/AML de cualquier empresa registrada en NEXUS LATAM.
        </p>
        <div className="flex gap-3">
          <input
            className="flex-1 bg-[#0D1B2A] border border-[#00D4FF44] rounded-lg px-4 py-2 text-[#00D4FF] text-sm placeholder-gray-600 focus:outline-none focus:border-[#00D4FF]"
            placeholder="0x... wallet address"
            value={address}
            onChange={e => setAddress(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && lookup()}
          />
          <button
            onClick={lookup}
            disabled={loading || !address}
            className="bg-[#00D4FF] text-[#0D1B2A] font-bold px-5 py-2 rounded-lg hover:bg-[#00B8D9] disabled:opacity-40 transition-colors text-sm"
          >
            {loading ? '...' : 'Buscar'}
          </button>
        </div>
      </div>

      {result && <ComplianceNFTCard data={result} />}
    </div>
  );
}
