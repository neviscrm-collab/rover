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
  SignOut,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
  { href: "/app", icon: House, label: "Home" },
  { href: "/discover", icon: Compass, label: "Discover" },
  { href: "/app/trips", icon: Suitcase, label: "Trips" },
  { href: "/app/community", icon: Users, label: "Community" },
  { href: "/app/profile", icon: UserCircle, label: "Profile" },
];

export default function DesktopSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  return (
    <aside
      className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-60 z-50 py-6 px-3"
      style={{
        background: "rgba(8,4,20,0.95)",
        borderRight: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Logo */}
      <Link href="/app" className="flex items-center gap-2.5 px-3 mb-8">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)" }}
        >
          R
        </div>
        <span className="text-base font-bold" style={{ color: "var(--text)" }}>
          ROVER
        </span>
      </Link>

      {/* Nav items */}
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/app"
              ? pathname === "/app"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer",
                  isActive ? "" : "hover:bg-white/5"
                )}
                style={
                  isActive
                    ? {
                        background:
                          "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.1))",
                        border: "1px solid rgba(124,58,237,0.25)",
                      }
                    : {}
                }
              >
                <Icon
                  size={20}
                  weight={isActive ? "fill" : "regular"}
                  className={isActive ? "text-violet-400" : "text-white/40"}
                />
                <span
                  className={cn(
                    "text-sm font-medium",
                    isActive ? "text-white" : "text-white/50"
                  )}
                >
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div
        className="mt-4 pt-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center gap-3 px-3 mb-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)" }}
          >
            {user?.name?.[0] ?? "T"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>
              {user?.name ?? "Explorer"}
            </p>
            <p className="text-xs truncate" style={{ color: "var(--text-faint)" }}>
              {user?.email ?? ""}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all hover:bg-white/5"
          style={{ color: "var(--text-faint)" }}
        >
          <SignOut size={18} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
