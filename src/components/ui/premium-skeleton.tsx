import { cn } from "@/lib/utils";

interface PremiumSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circle" | "card" | "stat";
}

function PremiumSkeleton({ className, variant = "text", ...props }: PremiumSkeletonProps) {
  const variants = {
    text: "h-4 w-full rounded-md skeleton-shimmer",
    circle: "rounded-full skeleton-shimmer",
    card: "h-32 w-full rounded-lg skeleton-shimmer",
    stat: "h-20 w-full rounded-lg skeleton-shimmer",
  };

  return (
    <div
      className={cn(variants[variant], className)}
      {...props}
    />
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 max-w-7xl animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <PremiumSkeleton className="h-8 w-56" />
        <PremiumSkeleton className="h-4 w-80" />
      </div>

      {/* Business card */}
      <PremiumSkeleton variant="card" className="h-24" />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <PremiumSkeleton key={i} variant="stat" className={`stagger-${i + 1}`} />
        ))}
      </div>

      {/* Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <PremiumSkeleton key={i} className={`h-20 stagger-${i + 1}`} />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <PremiumSkeleton key={i} variant="stat" className={`stagger-${i + 1}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

function OrdersSkeleton() {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between">
        <PremiumSkeleton className="h-8 w-48" />
        <PremiumSkeleton className="h-10 w-32" />
      </div>
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <PremiumSkeleton key={i} className="h-9 w-28 rounded-full" />
        ))}
      </div>
      <div className="space-y-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <PremiumSkeleton key={i} className={`h-20 stagger-${i + 1}`} />
        ))}
      </div>
    </div>
  );
}

export { PremiumSkeleton, DashboardSkeleton, OrdersSkeleton };
