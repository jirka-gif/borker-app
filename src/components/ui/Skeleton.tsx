import { cn } from "@/lib/utils";

/** Skeleton blok – využívá .skeleton shimmer z globals.css. */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("skeleton rounded-lg", className)}
      aria-hidden="true"
      {...props}
    />
  );
}

/** Skeleton ve tvaru karty draftu – pro loading state dashboardu. */
export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <Skeleton className="mt-4 h-1.5 w-full" />
      <div className="mt-4 flex items-center justify-between">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>
    </div>
  );
}
