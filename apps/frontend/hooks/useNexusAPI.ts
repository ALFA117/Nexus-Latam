'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { nexusClient }                               from '../lib/nexus-client';

export function useNexusAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const abortRef              = useRef<AbortController | null>(null);

  // Cancel any in-flight request when component unmounts
  useEffect(() => () => { abortRef.current?.abort(); }, []);

  const wrap = useCallback(async <T>(fn: (signal: AbortSignal) => Promise<T>): Promise<T> => {
    // Cancel previous request
    abortRef.current?.abort();
    const controller   = new AbortController();
    abortRef.current   = controller;

    setLoading(true);
    setError(null);
    try {
      return await fn(controller.signal);
    } catch (e: unknown) {
      // Ignore intentional aborts
      if (e instanceof Error && e.name === 'AbortError') throw e;
      const msg = e instanceof Error ? e.message : 'Unknown error';
      setError(msg);
      throw e;
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, []);

  const createTrade = useCallback(
    (data: Parameters<typeof nexusClient.createTrade>[0]) =>
      wrap(signal => nexusClient.createTrade(data, signal)),
    [wrap],
  );

  const getTrades = useCallback(
    (params?: Parameters<typeof nexusClient.getTrades>[0]) =>
      wrap(signal => nexusClient.getTrades(params, signal)),
    [wrap],
  );

  const getTradeStatus = useCallback(
    (id: string) => wrap(signal => nexusClient.getTradeStatus(id, signal)),
    [wrap],
  );

  const fundTrade = useCallback(
    (id: string) => wrap(signal => nexusClient.fundTrade(id, signal)),
    [wrap],
  );

  const getComplianceNFT = useCallback(
    (address: string) => wrap(signal => nexusClient.getComplianceNFT(address, signal)),
    [wrap],
  );

  const getFXQuote = useCallback(
    (from: string, to: string, amount: number) =>
      wrap(signal => nexusClient.getFXQuote(from, to, amount, signal)),
    [wrap],
  );

  const getAuditTrail = useCallback(
    (tradeId: string) => wrap(signal => nexusClient.getAuditTrail(tradeId, signal)),
    [wrap],
  );

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    setLoading(false);
  }, []);

  return {
    loading,
    error,
    cancel,
    createTrade,
    getTrades,
    getTradeStatus,
    fundTrade,
    getComplianceNFT,
    getFXQuote,
    getAuditTrail,
  };
}
