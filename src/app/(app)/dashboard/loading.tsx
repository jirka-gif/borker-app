import { Skeleton } from "@/components/ui";

/** Skeleton loading dashboardu – žádné spinnery přes celý screen. */
export default function DashboardLoading() {
  return (
    <div className="space-y-7">
      {/* Hero */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-40 rounded-full" />
        <Skeleton className="h-8 w-80" />
      </div>

      {/* Revenue panel */}
      <Skeleton className="h-32 rounded-2xl" />

      {/* Drafty (horizontální karty) */}
      <div>
        <Skeleton className="mb-3 h-5 w-56" />
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-[280px] shrink-0 rounded-2xl" />
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[88px] rounded-2xl" />
        ))}
      </div>

      {/* Katalog */}
      <div>
        <Skeleton className="mb-3 h-5 w-40" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
