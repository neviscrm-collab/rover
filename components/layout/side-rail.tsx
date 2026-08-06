"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  House,
  Compass,
  Suitcase,
  Users,
  UserCircle,
  NavigationArrow,
  Gear,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", icon: House, label: "Home" },
  { href: "/discover", icon: Compass, label: "Discover" },
  { href: "/app/trips", icon: Suitcase, label: "Trips" },
  { href: "/app/community", icon: Users, label: "Community" },
  { href: "/app/profile", icon: UserCircle, label: "Profile" },
];

export default function SideRail() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed left-0 top-0 bottom-0 z-50 hidden lg:flex flex-col items-center py-6 px-3 gap-6"
      style={{ width: "var(--side-rail-width)" }}
    >
      {/* Logo */}
      <Link href="/" className="group flex items-center justify-center">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
          style={{
            background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
          }}
        >
          <NavigationArrow size={20} weight="fill" className="text-white" />
        </div>
      </Link>

      {/* Divider */}
      <div className="w-8 h-px bg-white/10" />

      {/* Nav Items */}
      <div className="flex flex-col items-center gap-1 flex-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/" || pathname === "/app"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className="relative group"
            >
              {isActive && (
                <motion.div
                  layoutId="rail-indicator"
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(6,182,212,0.15))",
                    border: "1px solid rgba(124,58,237,0.3)",
                  }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <div
                className={cn(
                  "relative w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-200",
                  !isActive && "hover:bg-white/5"
                )}
              >
                <Icon
                  size={20}
                  weight={isActive ? "fill" : "regular"}
                  className={cn(
                    "transition-colors duration-200",
                    isActive ? "text-white" : "text-white/40 group-hover:text-white/70"
                  )}
                />
              </div>

              {/* Tooltip */}
              <div className="pointer-events-none absolute left-14 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
                <div className="glass px-3 py-1.5 rounded-lg whitespace-nowrap">
                  <span className="text-xs font-medium text-white">{item.label}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bottom */}
      <div className="flex flex-col items-center gap-2">
        <Link
          href="/agency"
          title="Agency Studio"
          className="group relative w-11 h-11 flex items-center justify-center rounded-xl hover:bg-white/5 transition-colors"
        >
          <Gear size={18} weight="regular" className="text-white/30 group-hover:text-white/60 transition-colors" />
          <div className="pointer-events-none absolute left-14 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
            <div className="glass px-3 py-1.5 rounded-lg whitespace-nowrap">
              <span className="text-xs font-medium text-white">Agency Studio</span>
            </div>
          </div>
        </Link>
      </div>
    </nav>
  );
}
