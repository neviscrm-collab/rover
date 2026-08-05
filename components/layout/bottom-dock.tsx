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
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", icon: House, label: "Home" },
  { href: "/discover", icon: Compass, label: "Discover" },
  { href: "/trips", icon: Suitcase, label: "Trips" },
  { href: "/community", icon: Users, label: "Community" },
  { href: "/profile", icon: UserCircle, label: "Profile" },
];

export default function BottomDock() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="glass-dark mx-3 mb-3 rounded-2xl">
        <div className="flex items-center justify-around px-2 py-3">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center gap-1 px-4 py-1"
              >
                <div className="relative">
                  {isActive && (
                    <motion.div
                      layoutId="dock-indicator"
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(6,182,212,0.2))",
                        border: "1px solid rgba(124,58,237,0.3)",
                      }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <div className="relative px-3 py-1.5">
                    <Icon
                      size={22}
                      weight={isActive ? "fill" : "regular"}
                      className={cn(
                        "transition-colors duration-200",
                        isActive ? "text-white" : "text-white/40"
                      )}
                    />
                  </div>
                </div>
                <span
                  className={cn(
                    "text-[10px] font-medium transition-colors duration-200",
                    isActive ? "text-white" : "text-white/35"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
