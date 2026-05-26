import { useEffect, useCallback, useRef } from 'react';

export interface ArbitrumEvent {
  type:    'TradeCreated' | 'TradeFunded' | 'TradeSettled' | 'BatchExecuted';
  tradeId: string;
  data:    Record<string, unknown>;
}

export function useArbitrumEvents(onEvent: (event: ArbitrumEvent) => void) {
  const wsRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:3001/events';

    try {
      const ws = new WebSocket(wsUrl);

      ws.onmessage = (msg) => {
        try {
          const event = JSON.parse(msg.data) as ArbitrumEvent;
          onEvent(event);
        } catch {
          // ignore malformed messages
        }
      };

      ws.onerror = () => {
        // Reconnect after 3s on error
        setTimeout(connect, 3000);
      };

      wsRef.current = ws;
    } catch {
      // WebSocket not available (SSR), skip
    }
  }, [onEvent]);

  useEffect(() => {
    connect();
    return () => {
      wsRef.current?.close();
    };
  }, [connect]);
}
