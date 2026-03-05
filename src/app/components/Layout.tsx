import { Link, useLocation } from "react-router";
import { BookOpen, Search, Bell } from "lucide-react";
import { mockNotifications } from "../data/mockData";

const NAV = [
  { path: "/", label: "読みたい本", icon: BookOpen },
  { path: "/search", label: "検索", icon: Search },
  { path: "/notifications", label: "通知", icon: Bell },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const loc = useLocation();
  const unread = mockNotifications.filter((n) => !n.read).length;

  const active = (path: string) =>
    path === "/" ? loc.pathname === "/" : loc.pathname.startsWith(path);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F2F2F7" }}>
      {/* ── Main content ── */}
      <main className="max-w-2xl mx-auto px-4 pt-6 pb-28">
        {children}
      </main>

      {/* ── iOS Tab Bar ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 flex"
        style={{
          backgroundColor: "rgba(249,249,249,0.92)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderTop: "0.5px solid rgba(60,60,67,0.2)",
        }}
      >
        {NAV.map((item) => {
          const isActive = active(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex-1 flex flex-col items-center gap-0.5 py-2"
              style={{ color: isActive ? "#007AFF" : "#8E8E93" }}
            >
              <div className="relative">
                <item.icon
                  className="w-6 h-6"
                  strokeWidth={isActive ? 2.2 : 1.8}
                  fill={isActive ? "rgba(0,122,255,0.1)" : "none"}
                />
                {item.path === "/notifications" && unread > 0 && (
                  <span
                    className="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full flex items-center justify-center text-white px-1"
                    style={{ backgroundColor: "#FF3B30", fontSize: "0.55rem", fontWeight: 700 }}
                  >
                    {unread}
                  </span>
                )}
              </div>
              <span
                style={{
                  fontSize: "0.625rem",
                  fontWeight: isActive ? 600 : 400,
                  letterSpacing: "0.01em",
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
        {/* Home indicator safe area */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        />
      </nav>
    </div>
  );
}