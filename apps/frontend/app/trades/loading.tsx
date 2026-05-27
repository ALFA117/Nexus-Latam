import { KPICardSkeleton, TradeCardSkeleton } from '../../components/Skeleton';

export default function TradesLoading() {
  return (
    <div className="min-h-screen bg-[#060D17] text-white grid-bg">
      {/* Navbar placeholder */}
      <div className="h-16 border-b border-[#00D4FF10]" />

      <div className="px-4 sm:px-6 max-w-7xl mx-auto" style={{ paddingTop: '80px' }}>
        {/* Header skeleton */}
        <div className="py-8 border-b border-[#00D4FF12] space-y-2">
          <div className="h-3 w-24 rounded bg-[#ffffff08]" />
          <div className="h-8 w-56 rounded bg-[#ffffff08]" />
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-6">
          {Array.from({ length: 4 }).map((_, i) => <KPICardSkeleton key={i} />)}
        </div>

        {/* Trade list */}
        <div className="space-y-3 mt-4">
          {Array.from({ length: 5 }).map((_, i) => <TradeCardSkeleton key={i} />)}
        </div>
      </div>
    </div>
  );
}
