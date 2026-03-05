import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Search, Loader2, X, Plus, Check, ChevronRight, Zap } from "lucide-react";
import { mockSearchResults, mockBooks, STORES, type Book } from "../data/mockData";

/* ── helpers ── */
function getLowest(book: Book) {
  const avail = book.listings.filter((l) => l.inStock && l.storeId !== "mercari");
  if (!avail.length) return null;
  return avail.reduce((a, b) =>
    a.price + a.shipping < b.price + b.shipping ? a : b
  );
}

/* ── ResultRow (Apple-style list row) ── */
function ResultRow({ book, onAdd, added }: { book: Book; onAdd: () => void; added: boolean }) {
  const lowest = getLowest(book);
  const isTomorrow = lowest?.deliveryDays === 1;
  const retailPrice = book.retailPrice;
  const pct = lowest
    ? Math.round(((retailPrice - (lowest.price + lowest.shipping)) / retailPrice) * 100)
    : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="flex items-center gap-3.5 px-4 py-3.5 active:bg-gray-50 transition-colors"
    >
      {/* Cover */}
      <div
        className="flex-shrink-0 rounded-lg overflow-hidden"
        style={{
          width: "52px",
          height: "78px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
        }}
      >
        <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-1.5 flex-wrap">
          <p
            className="leading-snug"
            style={{ fontSize: "0.9rem", fontWeight: 600, color: "#1C1C1E" }}
          >
            {book.title}
          </p>
          {isTomorrow && (
            <span
              className="flex items-center gap-0.5 rounded-full px-1.5 py-0.5 flex-shrink-0"
              style={{ backgroundColor: "#E8F7EE", color: "#34C759", fontSize: "0.55rem", fontWeight: 700 }}
            >
              <Zap className="w-2 h-2" />翌日
            </span>
          )}
        </div>
        <p style={{ fontSize: "0.75rem", color: "#8E8E93", marginTop: "1px" }}>{book.author}</p>

        {/* Prices */}
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          {lowest ? (
            <>
              <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#1C1C1E" }}>
                ¥{(lowest.price + lowest.shipping).toLocaleString()}
              </span>
              {pct > 0 && (
                <span
                  className="rounded-full px-1.5 py-0.5"
                  style={{ backgroundColor: "#E5F0FF", color: "#007AFF", fontSize: "0.58rem", fontWeight: 700 }}
                >
                  {pct}% OFF
                </span>
              )}
              <span style={{ fontSize: "0.68rem", color: "#C7C7CC", textDecoration: "line-through" }}>
                ¥{retailPrice.toLocaleString()}
              </span>
            </>
          ) : (
            <span style={{ fontSize: "0.75rem", color: "#C7C7CC" }}>在庫なし</span>
          )}
        </div>

        {/* Store chips */}
        <div className="flex gap-1.5 mt-1.5 flex-wrap">
          {book.listings
            .filter((l) => l.inStock && l.storeId !== "mercari")
            .sort((a, b) => a.price + a.shipping - (b.price + b.shipping))
            .slice(0, 2)
            .map((l) => {
              const s = STORES[l.storeId as keyof typeof STORES];
              return s ? (
                <span
                  key={l.storeId}
                  className="rounded-full px-2 py-0.5"
                  style={{ backgroundColor: s.bg, color: s.color, fontSize: "0.58rem", fontWeight: 600 }}
                >
                  {s.name}
                </span>
              ) : null;
            })}
        </div>
      </div>

      {/* Add button */}
      <button
        onClick={onAdd}
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90"
        style={{
          backgroundColor: added ? "#E5E5EA" : "#007AFF",
          color: added ? "#8E8E93" : "#FFFFFF",
        }}
      >
        {added ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
      </button>
    </motion.div>
  );
}

/* ── Search Page ── */
export default function SearchPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState<Book[]>([]);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set(mockBooks.map((b) => b.id)));

  useEffect(() => {
    if (params.get("q")) doSearch(params.get("q")!);
  }, []);

  const doSearch = (q: string) => {
    setQuery(q);
    setLoading(true);
    setSearched(false);
    setTimeout(() => {
      setResults(mockSearchResults);
      setLoading(false);
      setSearched(true);
    }, 1100);
  };

  const handleSubmit = () => {
    if (query.trim()) doSearch(query.trim());
  };

  return (
    <div className="space-y-5">
      {/* ── Page title ── */}
      <div className="pt-2">
        <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", color: "#1C1C1E" }}>
          検索
        </h1>
      </div>

      {/* ── iOS-style search bar ── */}
      <div
        className="flex items-center gap-2 rounded-xl px-3 py-2.5 transition-all"
        style={{
          backgroundColor: focused ? "#FFFFFF" : "rgba(118,118,128,0.12)",
          boxShadow: focused ? "0 0 0 4px rgba(0,122,255,0.15)" : "none",
        }}
      >
        <Search className="w-4 h-4 flex-shrink-0" style={{ color: "#8E8E93" }} />
        <input
          autoFocus
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="タイトル、著者名、気分を入力…"
          className="flex-1 bg-transparent focus:outline-none"
          style={{ fontSize: "0.9rem", color: "#1C1C1E" }}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "#C7C7CC" }}
          >
            <span style={{ color: "#fff", fontSize: "0.55rem", fontWeight: 700 }}>×</span>
          </button>
        )}
        {query && (
          <button
            onClick={handleSubmit}
            style={{ color: "#007AFF", fontSize: "0.85rem", fontWeight: 600, flexShrink: 0 }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" style={{ color: "#007AFF" }} /> : "検索"}
          </button>
        )}
      </div>

      {/* ── Loading ── */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-16 text-center space-y-3"
          >
            <Loader2 className="w-7 h-7 animate-spin mx-auto" style={{ color: "#007AFF" }} />
            <p style={{ fontSize: "0.82rem", color: "#8E8E93" }}>
              Amazon、メルカリ、楽天を検索中…
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Results ── */}
      <AnimatePresence>
        {searched && !loading && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p
              className="px-1 mb-2"
              style={{ fontSize: "0.72rem", color: "#8E8E93", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}
            >
              {results.length}件の結果
            </p>
            <div
              className="rounded-2xl overflow-hidden"
              style={{ backgroundColor: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
            >
              {results.map((book, i) => (
                <div
                  key={book.id}
                  style={{ borderTop: i > 0 ? "0.5px solid rgba(60,60,67,0.13)" : "none" }}
                >
                  <ResultRow
                    book={book}
                    added={addedIds.has(book.id)}
                    onAdd={() => setAddedIds((p) => new Set(p).add(book.id))}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Empty state ── */}
      {!loading && !searched && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl p-8 text-center space-y-2"
          style={{ backgroundColor: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
            style={{ backgroundColor: "#E5F0FF" }}
          >
            <Search className="w-7 h-7" style={{ color: "#007AFF" }} />
          </div>
          <p style={{ fontSize: "1rem", fontWeight: 600, color: "#1C1C1E" }}>
            本を探してみよう
          </p>
          <p style={{ fontSize: "0.8rem", color: "#8E8E93", lineHeight: 1.6 }}>
            タイトル・著者名・気分をそのまま入力してください
          </p>
        </motion.div>
      )}
    </div>
  );
}
