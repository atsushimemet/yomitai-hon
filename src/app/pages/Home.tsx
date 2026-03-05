import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Search, Plus, Trash2, CheckCircle2, Zap,
  ChevronRight, TrendingDown,
} from "lucide-react";
import { mockBooks, mockNotifications, type Book } from "../data/mockData";

/* ── helpers ── */
function getLowest(book: Book) {
  const avail = book.listings.filter((l) => l.inStock && l.storeId !== "mercari");
  if (!avail.length) return null;
  return avail.reduce((a, b) =>
    a.price + a.shipping < b.price + b.shipping ? a : b
  );
}
function savings(book: Book) {
  const l = getLowest(book);
  if (!l) return 0;
  return Math.round(((book.retailPrice - (l.price + l.shipping)) / book.retailPrice) * 100);
}

/* ── BookCover (vertical card like Apple Books) ── */
function BookCover({ book, onRemove }: { book: Book; onRemove: () => void }) {
  const lowest = getLowest(book);
  const pct = savings(book);
  const isPurchased = book.status === "purchased";
  const isAlert = book.status === "alert";
  const isTomorrow = lowest?.deliveryDays === 1 && !isPurchased;

  return (
    <motion.div
      whileTap={{ scale: 0.96 }}
      className="relative flex-shrink-0"
      style={{ width: "120px" }}
    >
      <Link to={`/book/${book.id}`} className="block">
        {/* Cover */}
        <div
          className="relative rounded-xl overflow-hidden"
          style={{
            boxShadow: "0 4px 16px rgba(0,0,0,0.18), 0 1px 3px rgba(0,0,0,0.12)",
            aspectRatio: "2/3",
          }}
        >
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-full h-full object-cover"
          />
          {/* Spine gradient */}
          <div
            className="absolute inset-y-0 left-0 w-1"
            style={{ backgroundColor: book.spineColor, opacity: 0.9 }}
          />
          {/* Badge overlay */}
          {isTomorrow && (
            <div
              className="absolute top-2 left-2 flex items-center gap-0.5 rounded-full px-1.5 py-0.5"
              style={{ backgroundColor: "#34C759", fontSize: "0.5rem", fontWeight: 700, color: "#fff" }}
            >
              <Zap className="w-2 h-2" />
              翌日
            </div>
          )}
          {isPurchased && (
            <div className="absolute inset-0 flex items-center justify-center"
              style={{ backgroundColor: "rgba(0,0,0,0.35)" }}>
              <CheckCircle2 className="w-8 h-8 text-white opacity-90" />
            </div>
          )}
          {isAlert && (
            <div
              className="absolute top-2 right-2 rounded-full px-1.5 py-0.5"
              style={{ backgroundColor: "#FF9500", fontSize: "0.5rem", fontWeight: 700, color: "#fff" }}
            >
              アラート
            </div>
          )}
        </div>

        {/* Title + price */}
        <div className="mt-2 px-0.5">
          <p
            className="truncate"
            style={{ fontSize: "0.75rem", fontWeight: 600, color: "#1C1C1E", lineHeight: 1.3 }}
          >
            {book.title}
          </p>
          <p
            className="truncate mt-0.5"
            style={{ fontSize: "0.65rem", color: "#8E8E93" }}
          >
            {book.author}
          </p>
          {lowest && !isPurchased && (
            <div className="flex items-center gap-1 mt-1">
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#1C1C1E" }}>
                ¥{(lowest.price + lowest.shipping).toLocaleString()}
              </span>
              {pct > 0 && (
                <span
                  className="rounded-full px-1.5 py-0.5"
                  style={{ backgroundColor: "#E5F0FF", color: "#007AFF", fontSize: "0.5rem", fontWeight: 700 }}
                >
                  {pct}%OFF
                </span>
              )}
            </div>
          )}
          {isPurchased && (
            <p style={{ fontSize: "0.65rem", color: "#34C759", marginTop: "4px", fontWeight: 600 }}>購入済み</p>
          )}
        </div>
      </Link>

      {/* Remove button */}
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(); }}
        className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center"
        style={{ backgroundColor: "#8E8E93", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
      >
        <span style={{ color: "white", fontSize: "0.7rem", lineHeight: 1, fontWeight: 700 }}>×</span>
      </button>
    </motion.div>
  );
}

/* ── AlertBanner ── */
function AlertBanner({ books }: { books: Book[] }) {
  if (!books.length) return null;
  const book = books[0];
  const lowest = getLowest(book);
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
    >
      <div
        className="flex items-center gap-3 px-4 py-3.5"
        style={{ borderLeft: "4px solid #FF9500" }}
      >
        <TrendingDown className="w-5 h-5 flex-shrink-0" style={{ color: "#FF9500" }} />
        <div className="flex-1 min-w-0">
          <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "#1C1C1E" }}>
            アラート価格達成
          </p>
          <p className="truncate" style={{ fontSize: "0.7rem", color: "#8E8E93" }}>
            「{book.title}」
            {lowest ? ` — ¥${(lowest.price + lowest.shipping).toLocaleString()}` : ""}
          </p>
        </div>
        <Link
          to={`/book/${book.id}`}
          className="flex items-center gap-0.5 flex-shrink-0"
          style={{ color: "#007AFF", fontSize: "0.78rem", fontWeight: 600 }}
        >
          見る <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}

/* ── Segmented Control ── */
function SegmentedControl<T extends string>({
  options, value, onChange,
}: {
  options: { value: T; label: string; count: number }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div
      className="flex rounded-xl p-0.5"
      style={{ backgroundColor: "rgba(118,118,128,0.12)" }}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className="flex-1 rounded-[10px] py-1.5 transition-all"
          style={{
            backgroundColor: value === opt.value ? "#FFFFFF" : "transparent",
            color: value === opt.value ? "#1C1C1E" : "#8E8E93",
            fontSize: "0.72rem",
            fontWeight: value === opt.value ? 600 : 400,
            boxShadow: value === opt.value ? "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)" : "none",
          }}
        >
          {opt.label}
          {opt.count > 0 && (
            <span
              className="ml-1"
              style={{ color: value === opt.value ? "#8E8E93" : "#C7C7CC", fontSize: "0.65rem" }}
            >
              {opt.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

/* ── HomePage ── */
export default function Home() {
  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [inputVal, setInputVal] = useState("");
  const [focused, setFocused] = useState(false);
  const [filter, setFilter] = useState<"all" | "watching" | "purchased">("all");
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const alertBooks = books.filter((b) => b.status === "alert");
  const unread = mockNotifications.filter((n) => !n.read).length;

  const filtered = filter === "all" ? books : books.filter((b) => b.status === filter);

  const handleSearch = () => {
    if (inputVal.trim()) navigate(`/search?q=${encodeURIComponent(inputVal.trim())}`);
    else navigate("/search");
  };

  const filterOptions = [
    { value: "all" as const, label: "すべて", count: books.length },
    { value: "watching" as const, label: "監視中", count: books.filter((b) => b.status === "watching").length },
    { value: "purchased" as const, label: "購入済み", count: books.filter((b) => b.status === "purchased").length },
  ];

  return (
    <div className="space-y-6">
      {/* ── Page header ── */}
      <div className="flex items-end justify-between pt-2">
        <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", color: "#1C1C1E" }}>
          読みたい本
        </h1>
        <div className="flex items-center gap-2">
          {unread > 0 && (
            <Link
              to="/notifications"
              className="relative"
            >
              <span
                className="flex items-center justify-center w-6 h-6 rounded-full text-white"
                style={{ backgroundColor: "#FF3B30", fontSize: "0.6rem", fontWeight: 700 }}
              >
                {unread}
              </span>
            </Link>
          )}
          <button
            onClick={() => navigate("/search")}
            className="flex items-center gap-1.5 rounded-full px-4 py-2 text-white transition-all active:scale-95"
            style={{ backgroundColor: "#007AFF", fontSize: "0.8rem", fontWeight: 600 }}
          >
            <Plus className="w-4 h-4" />
            追加
          </button>
        </div>
      </div>

      {/* ── iOS search bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 transition-all"
          style={{
            backgroundColor: focused ? "#FFFFFF" : "rgba(118,118,128,0.12)",
            boxShadow: focused ? "0 0 0 4px rgba(0,122,255,0.15)" : "none",
          }}
        >
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: "#8E8E93" }} />
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="タイトル、著者名、気分を入力…"
            className="flex-1 bg-transparent focus:outline-none"
            style={{
              fontSize: "0.9rem",
              color: "#1C1C1E",
            }}
          />
          {inputVal && (
            <button
              onClick={() => setInputVal("")}
              className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#C7C7CC" }}
            >
              <span style={{ color: "#fff", fontSize: "0.55rem", fontWeight: 700 }}>×</span>
            </button>
          )}
        </div>
        {inputVal && (
          <button
            onClick={handleSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-3 py-1 text-white active:scale-95"
            style={{ backgroundColor: "#007AFF", fontSize: "0.75rem", fontWeight: 600 }}
          >
            検索
          </button>
        )}
      </motion.div>

      {/* ── Alert banner ── */}
      {alertBooks.length > 0 && <AlertBanner books={alertBooks} />}

      {/* ── My library ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700, letterSpacing: "-0.02em", color: "#1C1C1E" }}>
            読みたい本
          </h2>
          <span style={{ fontSize: "0.75rem", color: "#8E8E93" }}>{filtered.length}冊</span>
        </div>

        {/* Segmented control */}
        <SegmentedControl
          options={filterOptions}
          value={filter}
          onChange={setFilter}
        />

        {/* Book grid */}
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-16 text-center rounded-2xl"
              style={{ backgroundColor: "#FFFFFF" }}
            >
              <p style={{ fontSize: "0.9rem", color: "#8E8E93" }}>本がありません</p>
              <Link
                to="/search"
                className="inline-block mt-3"
                style={{ fontSize: "0.82rem", color: "#007AFF", fontWeight: 600 }}
              >
                本を追加する
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              className="grid gap-x-5 gap-y-6"
              style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
            >
              {filtered.map((book, i) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <BookCover
                    book={book}
                    onRemove={() => setBooks((p) => p.filter((b) => b.id !== book.id))}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}