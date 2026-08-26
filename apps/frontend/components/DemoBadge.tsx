'use client';

/**
 * The backend/agents (apps/agents, apps/api) aren't deployed anywhere — only
 * apps/frontend ships to Vercel (see vercel.json). Every "live" number, agent
 * trace, and trade this component's siblings render is a scripted client-side
 * simulation, not a real API/on-chain call. This is the one shared, honest
 * label for all of them, styled like AgentStatusPanel's existing "· sim" tag
 * so it reads as one consistent house style, not a bolted-on disclaimer.
 */
export function DemoBadge({ label = 'DATOS DE DEMO' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-mono">
      <span className="w-1.5 h-1.5 rounded-full bg-[#F7B731]" />
      <span className="text-[#F7B731]">{label}</span>
    </span>
  );
}
