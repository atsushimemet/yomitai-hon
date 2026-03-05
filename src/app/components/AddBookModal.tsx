import { useState } from "react";
import { X, Search, BookPlus, Loader2 } from "lucide-react";
import { searchResults } from "../data/mockData";

interface AddBookModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (bookId: string, title: string, author: string) => void;
}

export function AddBookModal({ open, onClose, onAdd }: AddBookModalProps) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [manualTitle, setManualTitle] = useState("");
  const [manualAuthor, setManualAuthor] = useState("");
  const [tab, setTab] = useState<"search" | "manual">("search");

  if (!open) return null;

  const handleSearch = () => {
    if (!query.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setSearched(true);
    }, 800);
  };

  const filteredResults = searchResults.filter(
    (b) =>
      b.title.toLowerCase().includes(query.toLowerCase()) ||
      b.author.toLowerCase().includes(query.toLowerCase())
  );

  const handleManualAdd = () => {
    if (!manualTitle.trim()) return;
    onAdd(`manual-${Date.now()}`, manualTitle, manualAuthor);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }} className="text-gray-900">本をリストに追加</h2>
            <p className="text-gray-500 mt-0.5" style={{ fontSize: "0.8rem" }}>タイトルや著者名で検索するか、手動で入力してください</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          {(["search", "manual"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 text-sm transition-colors ${tab === t ? "border-b-2 border-[#2D4B73] text-[#2D4B73]" : "text-gray-500 hover:text-gray-700"}`}
              style={{ fontWeight: tab === t ? 600 : 400 }}
            >
              {t === "search" ? "🔍 検索して追加" : "✏️ 手動で入力"}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {tab === "search" && (
            <div>
              <div className="flex gap-2 mb-4">
                <div className="flex-1 relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="タイトル・著者名・ISBN..."
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#2D4B73] focus:ring-2 focus:ring-[#2D4B73]/10 transition-all"
                    style={{ fontSize: "0.9rem" }}
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={isSearching || !query.trim()}
                  className="px-4 py-2.5 bg-[#2D4B73] text-white rounded-lg hover:bg-[#1a3452] disabled:opacity-50 transition-colors"
                  style={{ fontSize: "0.85rem", fontWeight: 600 }}
                >
                  {isSearching ? <Loader2 size={16} className="animate-spin" /> : "検索"}
                </button>
              </div>

              {isSearching && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 size={28} className="animate-spin text-[#2D4B73]" />
                </div>
              )}

              {searched && !isSearching && (
                <div className="space-y-2">
                  {filteredResults.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p style={{ fontSize: "0.9rem" }}>該当する本が見つかりませんでした</p>
                      <p style={{ fontSize: "0.8rem" }} className="mt-1">手動で入力タブから追加してください</p>
                    </div>
                  ) : (
                    filteredResults.map((book) => (
                      <div key={book.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-[#2D4B73]/30 hover:bg-blue-50/30 transition-all group">
                        <img
                          src={book.coverUrl}
                          alt={book.title}
                          className="w-10 h-14 object-cover rounded-lg shadow-sm"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-900 line-clamp-1" style={{ fontSize: "0.88rem", fontWeight: 600 }}>{book.title}</p>
                          <p className="text-gray-500" style={{ fontSize: "0.78rem" }}>{book.author}</p>
                          <p className="text-gray-400" style={{ fontSize: "0.72rem" }}>定価 ¥{book.newPrice.toLocaleString()}</p>
                        </div>
                        <button
                          onClick={() => { onAdd(book.id, book.title, book.author); onClose(); }}
                          className="flex items-center gap-1 px-3 py-1.5 bg-[#2D4B73] text-white rounded-lg hover:bg-[#1a3452] transition-colors opacity-0 group-hover:opacity-100"
                          style={{ fontSize: "0.78rem", fontWeight: 600 }}
                        >
                          <BookPlus size={13} />
                          追加
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {!searched && !isSearching && (
                <div className="text-center py-8 text-gray-400">
                  <Search size={32} className="mx-auto mb-2 opacity-40" />
                  <p style={{ fontSize: "0.85rem" }}>タイトルや著者名を入力して検索</p>
                </div>
              )}
            </div>
          )}

          {tab === "manual" && (
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1.5" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                  タイトル <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder="例: 嫌われる勇気"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#2D4B73] focus:ring-2 focus:ring-[#2D4B73]/10 transition-all"
                  style={{ fontSize: "0.9rem" }}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1.5" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                  著者名
                </label>
                <input
                  type="text"
                  value={manualAuthor}
                  onChange={(e) => setManualAuthor(e.target.value)}
                  placeholder="例: 岸見一郎"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#2D4B73] focus:ring-2 focus:ring-[#2D4B73]/10 transition-all"
                  style={{ fontSize: "0.9rem" }}
                />
              </div>
              <button
                onClick={handleManualAdd}
                disabled={!manualTitle.trim()}
                className="w-full py-3 bg-[#2D4B73] text-white rounded-xl hover:bg-[#1a3452] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                style={{ fontWeight: 600 }}
              >
                <BookPlus size={18} />
                リストに追加する
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
