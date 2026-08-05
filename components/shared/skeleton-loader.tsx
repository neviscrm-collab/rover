"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("rounded-lg animate-shimmer", className)}
      style={{ background: "rgba(255,255,255,0.04)" }}
    />
  );
}

export function ExperienceCardSkeleton() {
  return (
    <div className="w-64 flex-shrink-0 rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
      <Skeleton className="h-44 w-full rounded-none" />
      <div className="p-3 space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-4 w-full" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="flex items-center gap-2 pt-1 border-t border-white/5">
          <div className="flex -space-x-2">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="w-6 h-6 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="w-full" style={{ height: "100svh", maxHeight: "900px" }}>
      <Skeleton className="w-full h-full rounded-none" />
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="page-mobile px-4 pt-16 space-y-8">
      <HeroSkeleton />
      <div className="space-y-3">
        <Skeleton className="h-6 w-40" />
        <div className="flex gap-3 overflow-hidden">
          {[0, 1, 2].map((i) => (
            <ExperienceCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
