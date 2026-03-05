import { useState } from "react";
import { Link } from "react-router";
import { Bell, BellOff, ExternalLink, ShoppingCart, Trash2, Eye } from "lucide-react";
import { Book, mockPriceOffers } from "../data/mockData";
import { PriceTag } from "./PriceTag";

interface BookCardProps {
  book: Book;
  onRemove?: (id: string) => void;
  onToggleAlert?: (id: string) => void;
  showActions?: boolean;
}

const statusConfig = {
  watching: { label: "ウォッチ中", color: "bg-blue-100 text-blue-700" },
  purchased: { label: "購入済み", color: "bg-green-100 text-green-700" },
  reading: { label: "読書中", color: "bg-amber-100 text-amber-700" },
  read: { label: "読了", color: "bg-gray-100 text-gray-600" },
};

export function BookCard({ book, onRemove, onToggleAlert, showActions = true }: BookCardProps) {
  const [imgError, setImgError] = useState(false);
  const offers = mockPriceOffers[book.id] ?? [];
  const lowestOffer = offers.length > 0 ? offers.reduce((a, b) => (a.price + a.shipping < b.price + b.shipping ? a : b)) : null;
  const lowestTotal = lowestOffer ? lowestOffer.price + lowestOffer.shipping : null;
  const savings = lowestTotal ? book.newPrice - lowestTotal : 0;
  const savingsPercent = lowestTotal ? Math.round((savings / book.newPrice) * 100) : 0;
  const status = statusConfig[book.status];
  const hasAlert = book.alertEnabled;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
      <div className="flex gap-3 p-4">
        {/* Cover */}
        <Link to={`/book/${book.id}`} className="shrink-0">
          <div className="w-16 h-[88px] rounded-lg overflow-hidden bg-gray-100 shadow-sm">
            {!imgError ? (
              <img
                src={book.coverUrl}
                alt={book.title}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2D4B73] to-[#1a3452]">
                <span className="text-white text-xs text-center px-1" style={{ fontSize: "0.6rem" }}>{book.title}</span>
              </div>
            )}
          </div>
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <Link to={`/book/${book.id}`} className="hover:text-[#2D4B73] transition-colors">
              <h3 className="text-gray-900 line-clamp-2" style={{ fontSize: "0.9rem", fontWeight: 600, lineHeight: 1.4 }}>
                {book.title}
              </h3>
            </Link>
            <span className={`shrink-0 px-2 py-0.5 rounded-full ${status.color}`} style={{ fontSize: "0.7rem", fontWeight: 600, whiteSpace: "nowrap" }}>
              {status.label}
            </span>
          </div>

          <p className="text-gray-500 mt-0.5" style={{ fontSize: "0.78rem" }}>{book.author}</p>
          <p className="text-gray-400 mt-0.5" style={{ fontSize: "0.72rem" }}>{book.genre}</p>

          <div className="mt-2 flex items-end gap-3">
            {lowestTotal !== null ? (
              <div className="flex items-center gap-2">
                <PriceTag price={lowestTotal} size="md" />
                {savingsPercent > 0 && (
                  <span className="bg-red-50 text-red-600 px-1.5 py-0.5 rounded" style={{ fontSize: "0.7rem", fontWeight: 700 }}>
                    {savingsPercent}%OFF
                  </span>
                )}
              </div>
            ) : (
              <span className="text-gray-400" style={{ fontSize: "0.8rem" }}>価格情報なし</span>
            )}
          </div>

          {lowestOffer && (
            <p className="text-gray-400 mt-0.5" style={{ fontSize: "0.72rem" }}>
              {lowestOffer.storeName} · {lowestOffer.condition} · {lowestOffer.shippingDays === 1 ? "🚀 翌日配送" : `${lowestOffer.shippingDays}日配送`}
            </p>
          )}

          {book.alertEnabled && book.alertPrice && (
            <p className="text-amber-600 mt-0.5 flex items-center gap-1" style={{ fontSize: "0.7rem" }}>
              <Bell size={10} />
              ¥{book.alertPrice.toLocaleString()}以下で通知
            </p>
          )}
        </div>
      </div>

      {showActions && (
        <div className="border-t border-gray-50 px-4 py-2.5 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-1">
            <Link
              to={`/book/${book.id}`}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors"
              style={{ fontSize: "0.78rem" }}
            >
              <Eye size={13} />
              比較する
            </Link>
            {lowestOffer && (
              <a
                href={lowestOffer.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#2D4B73] text-white hover:bg-[#1a3452] transition-colors"
                style={{ fontSize: "0.78rem", fontWeight: 600 }}
              >
                <ShoppingCart size={13} />
                購入する
              </a>
            )}
          </div>
          <div className="flex items-center gap-1">
            {onToggleAlert && (
              <button
                onClick={() => onToggleAlert(book.id)}
                className={`p-1.5 rounded-lg transition-colors ${hasAlert ? "text-amber-500 hover:bg-amber-50" : "text-gray-400 hover:bg-gray-200"}`}
                title={hasAlert ? "通知をオフにする" : "価格通知を設定する"}
              >
                {hasAlert ? <Bell size={15} /> : <BellOff size={15} />}
              </button>
            )}
            {onRemove && (
              <button
                onClick={() => onRemove(book.id)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                title="リストから削除"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
