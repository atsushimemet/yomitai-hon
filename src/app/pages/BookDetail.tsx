import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  ChevronLeft, Bell, BellOff, ShoppingCart,
  Zap, Check, Edit2, Search, ExternalLink,
} from "lucide-react";
import { mockBooks, STORES, type StoreId, type PriceListing } from "../data/mockData";

/* ── Condition color ── */
const COND_COLOR: Record<string, string> = {
  "非常に良い": "#34C759",
  "目立った傷や汚れなし": "#34C759",
  "良い": "#FF9500",
  "やや傷や汚れあり": "#FF6B00",
  "可": "#FF3B30",
};

/* ── ListingRow ── */
function ListingRow({
  listing, isLowest, onBuy, bought, bookTitle, bookAuthor,
}: {
  listing: PriceListing;
  isLowest: boolean;
  onBuy: () => void;
  bought: boolean;
  bookTitle: string;
  bookAuthor: string;
}) {
  const s = STORES[listing.storeId];
  const isMercari = listing.storeId === "mercari";
  const total = listing.price + listing.shipping;
  const condColor = COND_COLOR[listing.condition] ?? "#8E8E93";

  const mercariSearchUrl = `https://jp.mercari.com/search?keyword=${encodeURIComponent(
    `${bookTitle} ${bookAuthor}`
  )}`;

  return (
    <div
      className={`flex items-center justify-between gap-3 px-4 py-3.5 ${!listing.inStock && !isMercari ? "opacity-40" : ""}`}
      style={{ backgroundColor: isLowest ? "rgba(0,122,255,0.04)" : "transparent" }}
    >
      {/* Store icon + info */}
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: s.bg }}
        >
          <span style={{ color: s.color, fontSize: "0.6rem", fontWeight: 800 }}>
            {s.name.slice(0, 2)}
          </span>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "#1C1C1E" }}>
              {s.name}
            </span>
            {isLowest && !isMercari && (
              <span
                className="rounded-full px-1.5 py-0.5"
                style={{ backgroundColor: "#E5F0FF", color: "#007AFF", fontSize: "0.58rem", fontWeight: 700 }}
              >
                最安値
              </span>
            )}
            {!listing.inStock && !isMercari && (
              <span style={{ fontSize: "0.62rem", color: "#C7C7CC" }}>売切れ</span>
            )}
          </div>

          {isMercari ? (
            <p style={{ fontSize: "0.7rem", color: "#8E8E93", marginTop: "1px" }}>
              メルカリで直接確認
            </p>
          ) : (
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: condColor }}
              />
              <span style={{ fontSize: "0.7rem", color: "#8E8E93" }}>{listing.condition}</span>
              {listing.inStock && (
                <>
                  <span style={{ color: "#E5E5EA" }}>·</span>
                  <span
                    className="flex items-center gap-0.5"
                    style={{
                      fontSize: "0.7rem",
                      color: listing.deliveryDays === 1 ? "#34C759" : "#8E8E93",
                      fontWeight: listing.deliveryDays === 1 ? 600 : 400,
                    }}
                  >
                    {listing.deliveryDays === 1 && <Zap className="w-2.5 h-2.5" />}
                    {listing.deliveryDays === 1 ? "翌日配送" : `${listing.deliveryDays}日以内`}
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Price + action */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {isMercari ? (
          <a
            href={mercariSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full px-4 py-2 active:scale-95 transition-all"
            style={{ backgroundColor: s.bg, fontSize: "0.78rem", fontWeight: 600, color: s.color }}
          >
            <Search className="w-3.5 h-3.5" />
            調べる
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        ) : listing.inStock ? (
          <>
            <div className="text-right">
              <p style={{ fontWeight: 700, fontSize: "1.05rem", color: "#1C1C1E" }}>
                ¥{total.toLocaleString()}
              </p>
              <p style={{ fontSize: "0.6rem", color: "#C7C7CC" }}>
                ¥{listing.price.toLocaleString()} + 送料¥{listing.shipping}
              </p>
            </div>
            <button
              onClick={onBuy}
              className="flex items-center gap-1 rounded-full px-3.5 py-2 transition-all active:scale-95"
              style={{
                backgroundColor: bought ? "#E5E5EA" : "#007AFF",
                color: bought ? "#8E8E93" : "#FFFFFF",
                fontSize: "0.75rem",
                fontWeight: 600,
              }}
            >
              {bought ? (
                <><Check className="w-3.5 h-3.5" />済み</>
              ) : (
                <><ShoppingCart className="w-3.5 h-3.5" />購入</>
              )}
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}

/* ── Section card wrapper ── */
function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl overflow-hidden ${className}`}
      style={{ backgroundColor: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
    >
      {children}
    </div>
  );
}

/* ── BookDetail Page ── */
export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const book = mockBooks.find((b) => b.id === id);

  const [alertOn, setAlertOn] = useState(true);
  const [alertPrice, setAlertPrice] = useState(book?.alertPrice ?? 0);
  const [editAlert, setEditAlert] = useState(false);
  const [tmpPrice, setTmpPrice] = useState(String(book?.alertPrice ?? 0));
  const [boughtStore, setBoughtStore] = useState<StoreId | null>(null);

  if (!book) {
    return (
      <div className="py-20 text-center" style={{ color: "#8E8E93" }}>
        <p style={{ fontSize: "1rem" }}>本が見つかりませんでした</p>
        <button onClick={() => navigate("/")} className="mt-4" style={{ color: "#007AFF", fontSize: "0.9rem", fontWeight: 600 }}>
          読みたい本へ戻る
        </button>
      </div>
    );
  }

  const nonMercari = [...book.listings]
    .filter((l) => l.storeId !== "mercari")
    .sort((a, b) => (a.price + a.shipping) - (b.price + b.shipping));
  const mercariListings = book.listings.filter((l) => l.storeId === "mercari");
  const sorted = [...nonMercari, ...mercariListings];
  const lowestAvail = nonMercari.find((l) => l.inStock);

  const savingsPct = lowestAvail
    ? Math.round(
        (Math.max(0, book.retailPrice - (lowestAvail.price + lowestAvail.shipping)) /
          book.retailPrice) * 100
      )
    : 0;

  return (
    <div className="space-y-5 pb-4">
      {/* ── Back button (iOS style) ── */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 -ml-1 active:opacity-60 transition-opacity"
        style={{ color: "#007AFF", fontSize: "1rem", fontWeight: 400 }}
      >
        <ChevronLeft className="w-5 h-5" />
        読みたい本
      </button>

      {/* ── Hero: cover + info ── */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-5"
      >
        {/* Cover */}
        <div className="flex-shrink-0">
          <div
            className="rounded-xl overflow-hidden"
            style={{
              width: "112px",
              height: "168px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2), 0 2px 6px rgba(0,0,0,0.12)",
            }}
          >
            <img
              src={book.coverUrl}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 pt-1">
          <span
            className="inline-block rounded-full px-2.5 py-0.5 mb-2"
            style={{ backgroundColor: "#E5F0FF", color: "#007AFF", fontSize: "0.62rem", fontWeight: 600 }}
          >
            {book.genre}
          </span>
          <h1
            style={{
              fontSize: "1.15rem",
              fontWeight: 700,
              color: "#1C1C1E",
              lineHeight: 1.3,
              letterSpacing: "-0.02em",
            }}
          >
            {book.title}
          </h1>
          <p style={{ fontSize: "0.82rem", color: "#8E8E93", marginTop: "3px" }}>{book.author}</p>
          <p style={{ fontSize: "0.7rem", color: "#C7C7CC", marginTop: "1px" }}>
            {book.publisher} · {book.publishedYear}
          </p>

          <div className="flex items-baseline gap-2 mt-4 flex-wrap">
            {lowestAvail ? (
              <>
                <span style={{ fontWeight: 800, fontSize: "1.5rem", color: "#1C1C1E", letterSpacing: "-0.02em" }}>
                  ¥{(lowestAvail.price + lowestAvail.shipping).toLocaleString()}
                </span>
                <span style={{ fontSize: "0.72rem", color: "#C7C7CC", textDecoration: "line-through" }}>
                  ¥{book.retailPrice.toLocaleString()}
                </span>
                {savingsPct > 0 && (
                  <span
                    className="rounded-full px-2 py-0.5"
                    style={{ backgroundColor: "#E5F0FF", color: "#007AFF", fontSize: "0.62rem", fontWeight: 700 }}
                  >
                    {savingsPct}% OFF
                  </span>
                )}
              </>
            ) : (
              <span style={{ fontSize: "0.88rem", color: "#C7C7CC" }}>在庫なし</span>
            )}
          </div>
        </div>
      </motion.section>

      {/* ── Synopsis ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.06 }}
      >
        <SectionCard>
          <div className="p-4 space-y-3">
            <p
              style={{
                fontSize: "0.85rem",
                color: "#3C3C43",
                lineHeight: 1.75,
              }}
            >
              {book.synopsis}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1" style={{ borderTop: "0.5px solid rgba(60,60,67,0.13)" }}>
              {book.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full px-2.5 py-0.5"
                  style={{ backgroundColor: "#F2F2F7", color: "#8E8E93", fontSize: "0.65rem" }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </SectionCard>
      </motion.div>

      {/* ── Price Alert ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.08 }}
      >
        <SectionCard>
          <div className="flex items-center justify-between px-4 py-3.5">
            <div className="flex items-center gap-3">
              {alertOn ? (
                <Bell className="w-5 h-5" style={{ color: "#007AFF" }} />
              ) : (
                <BellOff className="w-5 h-5" style={{ color: "#C7C7CC" }} />
              )}
              <div>
                <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "#1C1C1E" }}>価格アラート</p>
                {alertOn && !editAlert && (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span style={{ fontSize: "0.72rem", color: "#8E8E93" }}>
                      ¥{alertPrice.toLocaleString()} 以下で通知
                    </span>
                    <button onClick={() => setEditAlert(true)}>
                      <Edit2 className="w-3 h-3" style={{ color: "#007AFF" }} />
                    </button>
                  </div>
                )}
                {alertOn && editAlert && (
                  <div className="flex items-center gap-2 mt-1">
                    <span style={{ fontSize: "0.78rem", color: "#8E8E93" }}>¥</span>
                    <input
                      autoFocus
                      type="number"
                      value={tmpPrice}
                      onChange={(e) => setTmpPrice(e.target.value)}
                      className="w-20 rounded-lg px-2 py-1 focus:outline-none"
                      style={{
                        fontSize: "0.82rem",
                        border: "1.5px solid #007AFF",
                        backgroundColor: "#F2F2F7",
                        color: "#1C1C1E",
                      }}
                    />
                    <button
                      onClick={() => {
                        const v = parseInt(tmpPrice);
                        if (!isNaN(v) && v > 0) setAlertPrice(v);
                        setEditAlert(false);
                      }}
                      className="rounded-lg px-3 py-1 text-white"
                      style={{ backgroundColor: "#007AFF", fontSize: "0.75rem", fontWeight: 600 }}
                    >
                      保存
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* iOS Toggle */}
            <button
              onClick={() => setAlertOn(!alertOn)}
              className="relative flex-shrink-0 transition-all"
              style={{
                width: "51px",
                height: "31px",
                borderRadius: "15.5px",
                backgroundColor: alertOn ? "#34C759" : "#E5E5EA",
              }}
            >
              <span
                className="absolute bg-white rounded-full shadow-md transition-all duration-200"
                style={{
                  width: "27px",
                  height: "27px",
                  top: "2px",
                  left: alertOn ? "22px" : "2px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.25)",
                }}
              />
            </button>
          </div>
        </SectionCard>
      </motion.div>

      {/* ── Market comparison ── */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="space-y-2"
      >
        <p
          className="px-1"
          style={{
            fontSize: "0.72rem",
            fontWeight: 600,
            color: "#8E8E93",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          マーケット比較
        </p>

        <SectionCard>
          {sorted.map((listing, i) => (
            <div
              key={listing.storeId}
              style={{ borderTop: i > 0 ? "0.5px solid rgba(60,60,67,0.13)" : "none" }}
            >
              <ListingRow
                listing={listing}
                isLowest={i === 0 && listing.inStock && listing.storeId !== "mercari"}
                onBuy={() => setBoughtStore(listing.storeId)}
                bought={boughtStore === listing.storeId}
                bookTitle={book.title}
                bookAuthor={book.author}
              />
            </div>
          ))}
        </SectionCard>
      </motion.section>
    </div>
  );
}
