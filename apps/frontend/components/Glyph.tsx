/**
 * Íconos de las tarjetas. Antes eran emojis (📊 ⚡ 📈 🤖 ⛓ 🔐 🌎 🎉), que se ven
 * distinto en cada sistema y rompen el estilo neón. Este componente recibe el
 * mismo string de siempre y dibuja un SVG de trazo que hereda el color; los
 * glifos geométricos de la casa (◈ ⬡ ◉) pasan tal cual.
 */
const PATHS: Record<string, JSX.Element> = {
  '📊': <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>,
  '⚡': <><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" /></>,
  '📈': <><path d="m3 17 6-6 4 4 8-8" /><path d="M15 7h6v6" /></>,
  '🤖': <><rect x="4" y="8" width="16" height="12" rx="3" /><path d="M12 4v4M9 13h.01M15 13h.01M9 17h6" /></>,
  '⛓': <><path d="M10 14a4 4 0 0 1 0-5.66l2.34-2.34a4 4 0 0 1 5.66 5.66L16.5 13" /><path d="M14 10a4 4 0 0 1 0 5.66l-2.34 2.34a4 4 0 0 1-5.66-5.66L7.5 11" /></>,
  '🔐': <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3M12 15v2" /></>,
  '🌎': <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" /></>,
  '🎉': <><path d="m4 20 4.5-12L16 15.5 4 20Z" /><path d="M14 4l1 2M20 10l-2 1M18 3l-1 3M21 6l-3 1" /></>,
};

export function Glyph({ icon, className = 'w-5 h-5' }: { icon: string; className?: string }) {
  const key = icon.replace(/️/g, '');
  const path = PATHS[key];
  if (!path) return <>{icon}</>;
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {path}
    </svg>
  );
}
