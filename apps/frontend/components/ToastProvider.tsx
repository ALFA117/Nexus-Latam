'use client';

import { createContext, useContext, useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastItem {
  id:       string;
  type:     ToastType;
  title:    string;
  message?: string;
}

interface ToastCtx {
  toast: (type: ToastType, title: string, message?: string) => void;
}

const ToastContext = createContext<ToastCtx>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const STYLE: Record<ToastType, { border: string; text: string; bg: string; icon: string }> = {
  success: { border: '#00FF94', text: '#00FF94', bg: 'rgba(0,255,148,0.08)',   icon: '✓' },
  error:   { border: '#FF3366', text: '#FF3366', bg: 'rgba(255,51,102,0.08)',  icon: '✕' },
  info:    { border: '#00D4FF', text: '#00D4FF', bg: 'rgba(0,212,255,0.08)',   icon: '◈' },
  warning: { border: '#F7B731', text: '#F7B731', bg: 'rgba(247,183,49,0.08)', icon: '⚠' },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts(prev => [...prev.slice(-4), { id, type, title, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4200);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Toast tray — fixed bottom-right */}
      <div
        className="fixed bottom-6 right-4 sm:right-6 z-[9999] flex flex-col gap-2 pointer-events-none"
        style={{ maxWidth: 360, width: 'calc(100vw - 32px)' }}
      >
        {toasts.map(t => {
          const s = STYLE[t.type];
          return (
            <div
              key={t.id}
              className="pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-lg clip-corner"
              style={{
                background:  s.bg,
                border:      `1px solid ${s.border}50`,
                boxShadow:   `0 0 24px ${s.border}18, 0 4px 20px rgba(0,0,0,0.4)`,
                animation:   'toastIn 0.3s ease forwards',
                backdropFilter: 'blur(12px)',
              }}
            >
              <span
                className="font-orbitron font-black text-base leading-none mt-0.5 shrink-0"
                style={{ color: s.text }}
              >
                {s.icon}
              </span>
              <div className="min-w-0">
                <p
                  className="font-orbitron text-xs font-black uppercase tracking-wide leading-tight"
                  style={{ color: s.text }}
                >
                  {t.title}
                </p>
                {t.message && (
                  <p className="text-white/50 text-xs font-mono mt-0.5 leading-relaxed">
                    {t.message}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
