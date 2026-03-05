import { useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  BellOff, CheckCheck, Trash2, TrendingDown, Package,
  AlertCircle, Clock, ChevronRight,
} from "lucide-react";
import { mockNotifications, STORES, type Notification } from "../data/mockData";

/* ── helpers ── */
function timeAgo(ts: string) {
  const now = new Date("2026-03-04T12:00:00").getTime();
  const diff = Math.floor((now - new Date(ts).getTime()) / 1000);
  if (diff < 3600) return `${Math.floor(diff / 60)}分前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}時間前`;
  return `${Math.floor(diff / 86400)}日前`;
}

const TYPE_META = {
  price_drop:    { icon: TrendingDown, label: "価格ダウン",   color: "#007AFF", bg: "#E5F0FF" },
  in_stock:      { icon: Package,      label: "在庫あり",     color: "#FF9500", bg: "#FFF4E5" },
  alert_reached: { icon: AlertCircle,  label: "アラート達成", color: "#FF3B30", bg: "#FFE5E4" },
  reminder:      { icon: Clock,        label: "リマインダー", color: "#34C759", bg: "#E8F7EE" },
};

/* ── NotifRow (iOS-style notification row) ── */
function NotifRow({ n, onRead, onDelete }: {
  n: Notification;
  onRead: () => void;
  onDelete: () => void;
}) {
  const meta = TYPE_META[n.type];
  const Icon = meta.icon;
  const isUrgent = n.type === "alert_reached" && !n.read;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 40, height: 0 }}
      onClick={onRead}
      className="flex items-start gap-3 px-4 py-3.5 cursor-pointer active:bg-gray-50 transition-colors"
    >
      {/* Icon badge */}
      <div
        className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ backgroundColor: meta.bg }}
      >
        <Icon className="w-5 h-5" style={{ color: meta.color }} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              color: meta.color,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            {meta.label}
          </span>
          {!n.read && (
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: "#007AFF" }}
            />
          )}
        </div>
        <p
          style={{
            fontSize: "0.82rem",
            fontWeight: n.read ? 400 : 500,
            color: n.read ? "#8E8E93" : "#1C1C1E",
            lineHeight: 1.5,
          }}
        >
          {n.message}
        </p>
        <div className="flex items-center justify-between mt-1.5">
          <span style={{ fontSize: "0.68rem", color: "#C7C7CC" }}>
            {timeAgo(n.timestamp)}
          </span>
          <Link
            to={`/book/${n.bookId}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-0.5"
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: isUrgent ? "#FF3B30" : "#007AFF",
            }}
          >
            {isUrgent ? "今すぐ購入" : "詳細"}
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Delete */}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="flex-shrink-0 opacity-30 hover:opacity-60 transition-opacity mt-1"
      >
        <Trash2 className="w-4 h-4" style={{ color: "#8E8E93" }} />
      </button>
    </motion.div>
  );
}

/* ── Notifications Page ── */
export default function Notifications() {
  const [notifs, setNotifs] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unread = notifs.filter((n) => !n.read).length;
  const displayed = filter === "unread" ? notifs.filter((n) => !n.read) : notifs;

  const markRead = (id: string) =>
    setNotifs((p) => p.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAllRead = () => setNotifs((p) => p.map((n) => ({ ...n, read: true })));
  const del = (id: string) => setNotifs((p) => p.filter((n) => n.id !== id));

  return (
    <div className="space-y-5">
      {/* ── Page header ── */}
      <div className="flex items-end justify-between pt-2">
        <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", color: "#1C1C1E" }}>
          通知
        </h1>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 active:opacity-60 transition-opacity"
            style={{ color: "#007AFF", fontSize: "0.82rem", fontWeight: 600 }}
          >
            <CheckCheck className="w-4 h-4" />
            すべて既読
          </button>
        )}
      </div>

      {/* ── Filter (segmented) ── */}
      <div
        className="flex rounded-xl p-0.5"
        style={{ backgroundColor: "rgba(118,118,128,0.12)" }}
      >
        {(["all", "unread"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="flex-1 rounded-[10px] py-1.5 transition-all"
            style={{
              backgroundColor: filter === f ? "#FFFFFF" : "transparent",
              color: filter === f ? "#1C1C1E" : "#8E8E93",
              fontSize: "0.78rem",
              fontWeight: filter === f ? 600 : 400,
              boxShadow: filter === f ? "0 1px 3px rgba(0,0,0,0.12)" : "none",
            }}
          >
            {f === "all" ? "すべて" : `未読 ${unread > 0 ? `（${unread}）` : ""}`}
          </button>
        ))}
      </div>

      {/* ── List ── */}
      <AnimatePresence mode="popLayout">
        {displayed.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-20 text-center space-y-3"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
              style={{ backgroundColor: "#F2F2F7" }}
            >
              <BellOff className="w-8 h-8" style={{ color: "#C7C7CC" }} />
            </div>
            <p style={{ fontSize: "0.9rem", color: "#8E8E93" }}>通知はありません</p>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
          >
            {displayed.map((n, i) => (
              <div
                key={n.id}
                style={{ borderTop: i > 0 ? "0.5px solid rgba(60,60,67,0.13)" : "none" }}
              >
                <NotifRow
                  n={n}
                  onRead={() => markRead(n.id)}
                  onDelete={() => del(n.id)}
                />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
