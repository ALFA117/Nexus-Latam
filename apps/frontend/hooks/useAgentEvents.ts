'use client';

import { useEffect, useState, useCallback } from 'react';

export interface AgentEvent {
  agent:    string;
  type:     'start' | 'progress' | 'success' | 'error' | 'connected';
  message:  string;
  tradeId?: string;
  ts:       number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export function useAgentEvents(maxEvents = 20) {
  const [events, setEvents]       = useState<AgentEvent[]>([]);
  const [connected, setConnected] = useState(false);

  const addEvent = useCallback((ev: AgentEvent) => {
    setEvents(prev => [ev, ...prev].slice(0, maxEvents));
  }, [maxEvents]);

  useEffect(() => {
    const es = new EventSource(`${API_URL}/api/v1/events`);

    es.onopen = () => setConnected(true);

    es.onmessage = (e) => {
      try {
        const data: AgentEvent = JSON.parse(e.data);
        if (data.type === 'connected') { setConnected(true); return; }
        addEvent(data);
      } catch { /* ignore malformed */ }
    };

    es.onerror = () => {
      setConnected(false);
      // EventSource auto-reconnects — no manual retry needed
    };

    return () => { es.close(); setConnected(false); };
  }, [addEvent]);

  return { events, connected };
}
