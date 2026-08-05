"use client";

import Image from "next/image";
import type { Traveler } from "@/lib/types";

interface TravelerStackProps {
  travelers: Traveler[];
  max?: number;
  size?: "sm" | "md";
  showCount?: boolean;
  totalCount?: number;
}

export default function TravelerStack({
  travelers,
  max = 4,
  size = "sm",
  showCount = true,
  totalCount,
}: TravelerStackProps) {
  const visible = travelers.slice(0, max);
  const extra = totalCount
    ? totalCount - visible.length
    : travelers.length - visible.length;

  const dim = size === "sm" ? 24 : 32;
  const dimCls = size === "sm" ? "w-6 h-6" : "w-8 h-8";
  const textCls = size === "sm" ? "text-[10px]" : "text-xs";
  const offsetCls = size === "sm" ? "-ml-2 first:ml-0" : "-ml-2.5 first:ml-0";

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {visible.map((traveler, idx) => (
          <div
            key={traveler.id}
            className={`${dimCls} ${offsetCls} relative rounded-full ring-2 ring-black/50 overflow-hidden flex-shrink-0`}
            style={{ zIndex: max - idx }}
            title={traveler.name}
          >
            <Image
              src={traveler.avatar}
              alt={traveler.name}
              width={dim}
              height={dim}
              className="object-cover w-full h-full"
            />
          </div>
        ))}
        {extra > 0 && (
          <div
            className={`${dimCls} ${offsetCls} rounded-full ring-2 ring-black/50 flex items-center justify-center flex-shrink-0`}
            style={{
              background: "rgba(124,58,237,0.3)",
              backdropFilter: "blur(8px)",
            }}
          >
            <span className={`${textCls} font-semibold text-white`}>
              +{extra}
            </span>
          </div>
        )}
      </div>
      {showCount && travelers.length > 0 && (
        <span className="text-[11px] text-white/50">
          {totalCount ?? travelers.length} going
        </span>
      )}
    </div>
  );
}
