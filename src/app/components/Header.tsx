import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Bell, BookOpen, Search, List, Home, Menu, X } from "lucide-react";
import { mockNotifications } from "../data/mockData";

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  const navItems = [
    { path: "/", label: "ホーム", icon: Home },
    { path: "/search", label: "本を探す", icon: Search },
    { path: "/wishlist", label: "読みたいリスト", icon: List },
    { path: "/notifications", label: "通知", icon: Bell, badge: unreadCount },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-[#2D4B73] rounded-lg flex items-center justify-center group-hover:bg-[#1a3452] transition-colors">
              <BookOpen size={18} className="text-white" />
            </div>
            <span className="text-[#2D4B73] hidden sm:block" style={{ fontWeight: 700, fontSize: "1.1rem", letterSpacing: "-0.01em" }}>
              今読みたい
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors relative ${
                  isActive(item.path)
                    ? "bg-[#2D4B73]/10 text-[#2D4B73]"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
                style={{ fontWeight: isActive(item.path) ? 600 : 400 }}
              >
                <item.icon size={16} />
                {item.label}
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center" style={{ fontSize: "0.65rem", fontWeight: 700 }}>
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Right: Avatar + mobile menu */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#E8A87C] rounded-full flex items-center justify-center cursor-pointer" title="ゲストユーザー">
              <span className="text-white" style={{ fontSize: "0.75rem", fontWeight: 700 }}>G</span>
            </div>
            <button
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-colors relative ${
                isActive(item.path)
                  ? "bg-[#2D4B73]/10 text-[#2D4B73]"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              style={{ fontWeight: isActive(item.path) ? 600 : 400 }}
            >
              <item.icon size={18} />
              {item.label}
              {item.badge && item.badge > 0 && (
                <span className="ml-auto w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center" style={{ fontSize: "0.7rem", fontWeight: 700 }}>
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
