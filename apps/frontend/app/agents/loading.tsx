import { Skeleton } from '../../components/Skeleton';

export default function AgentsLoading() {
  return (
    <div className="min-h-screen bg-[#060D17] text-white grid-bg">
      <div className="h-16 border-b border-[#9B30FF10]" />

      <div className="px-4 sm:px-6 max-w-7xl mx-auto pb-16" style={{ paddingTop: '80px' }}>
        {/* Header */}
        <div className="py-8 border-b border-[#9B30FF20] space-y-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-3 w-80" />
        </div>

        {/* Agent tabs */}
        <div className="flex gap-2 py-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-32 rounded-lg" />
          ))}
        </div>

        {/* Agent detail */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-40 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-lg" />)}
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-56 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
