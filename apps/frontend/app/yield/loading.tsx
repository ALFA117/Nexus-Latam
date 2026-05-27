import { Skeleton, KPICardSkeleton } from '../../components/Skeleton';

export default function YieldLoading() {
  return (
    <div className="min-h-screen bg-[#060D17] text-white grid-bg">
      <div className="h-16 border-b border-white/5" />

      <div className="page-inner px-4 sm:px-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="py-8 border-b border-[#00FF9420] space-y-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-3 w-40" />
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-6">
          {[0, 1, 2, 3].map(i => <KPICardSkeleton key={i} />)}
        </div>

        {/* Flow bar */}
        <div className="glass clip-corner-lg p-5 mb-6 space-y-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-4 w-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
          {/* Positions */}
          <div className="lg:col-span-2 space-y-3">
            <Skeleton className="h-3 w-40" />
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="glass clip-corner border-[#00FF9415] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {[0, 1, 2, 3].map(j => (
                    <div key={j} className="space-y-1">
                      <Skeleton className="h-3 w-14" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
                <Skeleton className="h-1.5 w-full rounded-full" />
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="glass clip-corner border-[#00FF9420] p-5 space-y-3">
              <Skeleton className="h-3 w-36" />
              <Skeleton className="h-10 w-full rounded-lg" />
              <div className="flex gap-2">
                {[0, 1, 2, 3].map(i => <Skeleton key={i} className="flex-1 h-8 rounded" />)}
              </div>
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
            <Skeleton className="h-3 w-36" />
            <div className="glass clip-corner border-[#00FF9415] divide-y divide-[#ffffff05]">
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} className="px-4 py-3 space-y-1.5">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-3 w-32" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
