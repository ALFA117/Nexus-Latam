import { Skeleton, KPICardSkeleton } from '../../components/Skeleton';

export default function AuditLoading() {
  return (
    <div className="min-h-screen bg-[#060D17] text-white grid-bg">
      <div className="h-16 border-b border-white/5" />

      <div className="page-inner px-4 sm:px-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="py-8 border-b border-[#FF6B3520] space-y-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-3 w-52" />
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-6">
          {[0, 1, 2, 3].map(i => <KPICardSkeleton key={i} />)}
        </div>

        {/* How it works bar */}
        <div className="glass clip-corner-lg p-5 mb-6 space-y-2">
          <Skeleton className="h-3 w-48" />
          <Skeleton className="h-4 w-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
          {/* Bundle list */}
          <div className="lg:col-span-2 space-y-3">
            <Skeleton className="h-3 w-36" />
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="glass clip-corner border-[#FF6B3515] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <Skeleton className="h-3 w-32" />
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[0, 1, 2].map(j => (
                    <div key={j} className="space-y-1">
                      <Skeleton className="h-4 w-16 mx-auto" />
                      <Skeleton className="h-3 w-10 mx-auto" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div>
              <Skeleton className="h-3 w-40 mb-3" />
              <div className="glass clip-corner border-[#FF6B3520] p-4 space-y-3">
                <Skeleton className="h-8 w-32 mx-auto rounded" />
                <Skeleton className="h-px w-full" />
                <div className="flex gap-2 justify-center">
                  {[0, 1].map(i => <Skeleton key={i} className="flex-1 h-6 rounded" />)}
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 16 }).map((_, i) => <Skeleton key={i} className="flex-1 h-3 rounded-sm" />)}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-32" />
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="glass p-3 space-y-1.5">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-3 w-36" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
