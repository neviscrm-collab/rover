"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  SquaresFour,
  CompassTool,
  CalendarCheck,
  Users,
  ChatsCircle,
  CurrencyDollar,
  FolderOpen,
  Gear,
  SignOut,
  ArrowLeft,
} from "@phosphor-icons/react";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import Image from "next/image";

const NAV_ITEMS = [
  { href: "/studio", label: "Overview", icon: SquaresFour, exact: true },
  { href: "/studio/experiences", label: "Experiences", icon: CompassTool },
  { href: "/studio/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/studio/travelers", label: "Travelers", icon: Users },
  { href: "/studio/chat", label: "Chat", icon: ChatsCircle },
  { href: "/studio/payments", label: "Payments", icon: CurrencyDollar },
  { href: "/studio/documents", label: "Documents", icon: FolderOpen },
  { href: "/studio/settings", label: "Settings", icon: Gear },
];

export default function StudioSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname.startsWith(href);

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <>
      {/* ── Desktop Sidebar ───────────────────────────────────────────────── */}
      <aside
        className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-60 z-40"
        style={{
          background: "rgba(10,8,20,0.92)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(24px)",
        }}
      >
        {/* Logo */}
        <div className="px-5 pt-6 pb-5 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)" }}
            >
              R
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-none">ROVER</p>
              <p className="text-[10px] text-white/30 uppercase tracking-wider mt-0.5">Studio</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href, item.exact);
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ x: 2 }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors relative"
                  style={{
                    background: active ? "rgba(124,58,237,0.15)" : "transparent",
                    color: active ? "white" : "rgba(255,255,255,0.45)",
                  }}
                >
                  {active && (
                    <motion.div
                      layoutId="studio-nav-indicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                      style={{ background: "#7C3AED" }}
                    />
                  )}
                  <Icon
                    size={17}
                    weight={active ? "fill" : "regular"}
                    style={{ color: active ? "#7C3AED" : undefined }}
                  />
                  <span className="text-sm font-medium">{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Agency Profile + Logout */}
        <div className="px-3 pb-5 pt-3 border-t border-white/5 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2.5">
            <div className="w-8 h-8 rounded-xl overflow-hidden flex-shrink-0 bg-white/10">
              {user?.avatar && (
                <Image src={user.avatar} alt={user.name} width={32} height={32} className="object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-white/30 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:text-white/70 transition-colors"
          >
            <SignOut size={17} />
            <span className="text-sm">Sign out</span>
          </button>
        </div>
      </aside>

      {/* ── Mobile Bottom Nav ─────────────────────────────────────────────── */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-2 pb-safe"
        style={{
          background: "rgba(10,8,20,0.95)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(24px)",
          paddingBottom: "max(env(safe-area-inset-bottom), 12px)",
        }}
      >
        <div className="flex items-center justify-around py-2">
          {NAV_ITEMS.slice(0, 5).map((item) => {
            const active = isActive(item.href, item.exact);
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <div className="flex flex-col items-center gap-1 px-2 py-1">
                  <Icon
                    size={20}
                    weight={active ? "fill" : "regular"}
                    style={{ color: active ? "#7C3AED" : "rgba(255,255,255,0.35)" }}
                  />
                  <span
                    className="text-[9px] font-medium"
                    style={{ color: active ? "#7C3AED" : "rgba(255,255,255,0.35)" }}
                  >
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
