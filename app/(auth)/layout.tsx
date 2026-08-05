import GuestGuard from "@/components/auth/guest-guard";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <GuestGuard>
      <main className="min-h-screen" style={{ background: "var(--bg)" }}>
        {children}
      </main>
    </GuestGuard>
  );
}
