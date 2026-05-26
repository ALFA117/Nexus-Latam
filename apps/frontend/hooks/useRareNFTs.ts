import { useState, useCallback } from 'react';

export interface RareNFT {
  tokenId:         string;
  contractAddress: string;
  name:            string;
  ipfsUri:         string;
  attributes:      Array<{ trait_type: string; value: string }>;
}

export function useRareNFTs() {
  const [nfts, setNfts]       = useState<RareNFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const fetchNFTsByAddress = useCallback(async (address: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/v1/nfts?address=${encodeURIComponent(address)}`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json() as RareNFT[];
      setNfts(data);
      return data;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error fetching NFTs';
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchComplianceNFTs = useCallback(async (countryCode: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/v1/nfts/compliance?country=${encodeURIComponent(countryCode)}`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json() as RareNFT[];
      setNfts(data);
      return data;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error fetching compliance NFTs';
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearNFTs = useCallback(() => setNfts([]), []);

  return {
    nfts,
    loading,
    error,
    fetchNFTsByAddress,
    fetchComplianceNFTs,
    clearNFTs,
  };
}
