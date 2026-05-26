import { useState, useCallback } from 'react';
import { nexusClient }           from '../lib/nexus-client';

export function useNexusAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const wrap = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => {
    setLoading(true);
    setError(null);
    try {
      return await fn();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTrade = useCallback(
    (data: Parameters<typeof nexusClient.createTrade>[0]) =>
      wrap(() => nexusClient.createTrade(data)),
    [wrap],
  );

  const getTrades = useCallback(
    () => wrap(() => nexusClient.getTrades()),
    [wrap],
  );

  const getTradeStatus = useCallback(
    (id: string) => wrap(() => nexusClient.getTradeStatus(id)),
    [wrap],
  );

  const fundTrade = useCallback(
    (id: string) => wrap(() => nexusClient.fundTrade(id)),
    [wrap],
  );

  const getComplianceNFT = useCallback(
    (address: string) => wrap(() => nexusClient.getComplianceNFT(address)),
    [wrap],
  );

  const getFXQuote = useCallback(
    (from: string, to: string, amount: number) =>
      wrap(() => nexusClient.getFXQuote(from, to, amount)),
    [wrap],
  );

  const getAuditTrail = useCallback(
    (tradeId: string) => wrap(() => nexusClient.getAuditTrail(tradeId)),
    [wrap],
  );

  return {
    loading,
    error,
    createTrade,
    getTrades,
    getTradeStatus,
    fundTrade,
    getComplianceNFT,
    getFXQuote,
    getAuditTrail,
  };
}
