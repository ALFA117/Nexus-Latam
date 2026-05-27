'use client';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`rounded bg-[#ffffff08] overflow-hidden relative ${className}`}
      style={{ animation: 'skeleton-pulse 1.6s ease-in-out infinite' }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #ffffff06 50%, transparent 100%)',
          animation: 'skeleton-shimmer 1.6s ease-in-out infinite',
        }}
      />
    </div>
  );
}

export function TradeCardSkeleton() {
  return (
    <div className="glass clip-corner border-[#00D4FF08] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-5 w-16 rounded-sm" />
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

export function KPICardSkeleton() {
  return (
    <div className="glass clip-corner border-[#00D4FF08] p-5 space-y-2">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
}

export function ComplianceCardSkeleton() {
  return (
    <div className="glass clip-corner border-[#00D4FF08] p-5 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
        <Skeleton className="h-6 w-20 rounded-sm" />
      </div>
      <Skeleton className="h-1.5 w-full rounded-full" />
      <div className="flex gap-4">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}
