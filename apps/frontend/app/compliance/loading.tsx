import { Skeleton, ComplianceCardSkeleton, KPICardSkeleton } from '../../components/Skeleton';

export default function ComplianceLoading() {
  return (
    <div className="min-h-screen bg-[#060D17] text-white grid-bg">
      {/* Navbar placeholder */}
      <div className="h-16 border-b border-white/5" />

      <div className="page-inner px-4 sm:px-6 max-w-5xl mx-auto">
        {/* Header skeleton */}
        <div className="py-8 border-b border-[#9B30FF20] space-y-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-3 w-48" />
        </div>

        {/* Tier legend */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-6">
          {[0, 1, 2].map(i => (
            <div key={i} className="glass clip-corner-sm p-3 flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-36" />
              </div>
            </div>
          ))}
        </div>

        {/* Search box skeleton */}
        <div className="glass clip-corner p-6 mb-6 border-[#9B30FF25] space-y-3">
          <Skeleton className="h-3 w-72" />
          <div className="flex gap-3">
            <Skeleton className="flex-1 h-11 rounded-lg" />
            <Skeleton className="h-11 w-32 rounded-lg" />
          </div>
        </div>

        {/* Sample wallets */}
        <div className="mb-12 space-y-3">
          <Skeleton className="h-3 w-48" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[0, 1, 2].map(i => <ComplianceCardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
