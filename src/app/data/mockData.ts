export type BookStatus = "watching" | "alert" | "purchased";
export type StoreId = "amazon" | "mercari" | "rakuten" | "yahoo";

export interface PriceListing {
  storeId: StoreId;
  storeName: string;
  price: number;
  condition: string;
  shipping: number;
  deliveryDays: number;
  url: string;
  inStock: boolean;
}

export interface PriceHistory {
  date: string;
  amazon: number | null;
  mercari: number | null;
  rakuten: number | null;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  publishedYear: number;
  genre: string;
  coverUrl: string;
  synopsis: string;
  moodTagline: string;
  spineColor: string;
  retailPrice: number;
  alertPrice: number;
  status: BookStatus;
  addedAt: string;
  listings: PriceListing[];
  priceHistory: PriceHistory[];
  tags: string[];
}

export interface Notification {
  id: string;
  bookId: string;
  bookTitle: string;
  type: "price_drop" | "in_stock" | "alert_reached" | "reminder";
  message: string;
  timestamp: string;
  read: boolean;
  storeId?: StoreId;
  price?: number;
}

export const STORES: Record<StoreId, { name: string; color: string; bg: string }> = {
  amazon: { name: "Amazon", color: "#B45309", bg: "#FEF3C7" },
  mercari: { name: "メルカリ", color: "#BE185D", bg: "#FCE7F3" },
  rakuten: { name: "楽天", color: "#9F1239", bg: "#FFE4E6" },
  yahoo: { name: "Yahoo!", color: "#1D4ED8", bg: "#DBEAFE" },
};

export const mockBooks: Book[] = [
  {
    id: "1",
    title: "思考の整理学",
    author: "外山 滋比古",
    isbn: "978-4-480-02053-7",
    publisher: "筑摩書房",
    publishedYear: 1986,
    genre: "思想・哲学",
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=560&fit=crop",
    synopsis: "東大・京大で一番読まれた本として話題になった、思考・発想に関する名著。アイデアが自然と生まれるための思考法を解説する。",
    moodTagline: "頭の中を、静かに整えたいとき。",
    spineColor: "#C17A52",
    retailPrice: 660,
    alertPrice: 200,
    status: "alert",
    addedAt: "2026-02-20",
    tags: ["思考法", "自己啓発", "ベストセラー"],
    listings: [
      { storeId: "amazon", storeName: "Amazon", price: 185, condition: "良い", shipping: 0, deliveryDays: 1, url: "#", inStock: true },
      { storeId: "mercari", storeName: "メルカリ", price: 150, condition: "目立った傷や汚れなし", shipping: 210, deliveryDays: 2, url: "#", inStock: true },
      { storeId: "rakuten", storeName: "楽天市場", price: 220, condition: "良い", shipping: 0, deliveryDays: 2, url: "#", inStock: true },
      { storeId: "yahoo", storeName: "Yahoo!オークション", price: 130, condition: "やや傷や汚れあり", shipping: 198, deliveryDays: 3, url: "#", inStock: true },
    ],
    priceHistory: [
      { date: "2/3", amazon: 280, mercari: 200, rakuten: 300 },
      { date: "2/10", amazon: 250, mercari: 180, rakuten: 280 },
      { date: "2/17", amazon: 220, mercari: 165, rakuten: 260 },
      { date: "2/24", amazon: 200, mercari: 155, rakuten: 240 },
      { date: "3/3", amazon: 185, mercari: 150, rakuten: 220 },
    ],
  },
  {
    id: "2",
    title: "嫌われる勇気",
    author: "岸見 一郎 / 古賀 史健",
    isbn: "978-4-478-02581-9",
    publisher: "ダイヤモンド社",
    publishedYear: 2013,
    genre: "心理学",
    coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=560&fit=crop",
    synopsis: "アドラー心理学の哲人と青年の対話形式で、自由に生きるための哲学を解説。300万部超のベストセラー。",
    moodTagline: "他人の目を、手放す夜に。",
    spineColor: "#4A7C59",
    retailPrice: 1650,
    alertPrice: 400,
    status: "watching",
    addedAt: "2026-02-25",
    tags: ["心理学", "アドラー", "人間関係"],
    listings: [
      { storeId: "amazon", storeName: "Amazon", price: 580, condition: "良い", shipping: 0, deliveryDays: 1, url: "#", inStock: true },
      { storeId: "mercari", storeName: "メルカリ", price: 450, condition: "目立った傷や汚れなし", shipping: 210, deliveryDays: 2, url: "#", inStock: true },
      { storeId: "rakuten", storeName: "楽天市場", price: 620, condition: "非常に良い", shipping: 0, deliveryDays: 2, url: "#", inStock: false },
      { storeId: "yahoo", storeName: "Yahoo!オークション", price: 390, condition: "やや傷や汚れあり", shipping: 198, deliveryDays: 4, url: "#", inStock: true },
    ],
    priceHistory: [
      { date: "2/3", amazon: 750, mercari: 600, rakuten: 800 },
      { date: "2/10", amazon: 700, mercari: 550, rakuten: 750 },
      { date: "2/17", amazon: 650, mercari: 510, rakuten: 700 },
      { date: "2/24", amazon: 610, mercari: 470, rakuten: 650 },
      { date: "3/3", amazon: 580, mercari: 450, rakuten: 620 },
    ],
  },
  {
    id: "3",
    title: "1984年",
    author: "ジョージ・オーウェル",
    isbn: "978-4-15-011600-5",
    publisher: "早川書房",
    publishedYear: 1949,
    genre: "SF・ディストピア",
    coverUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=560&fit=crop",
    synopsis: "全体主義国家の恐怖を描いたディストピア小説の傑作。「ビッグ・ブラザー」「二重思考」などの概念を生み出した。",
    moodTagline: "自由の意味を、問い直したい夜に。",
    spineColor: "#2C4A6E",
    retailPrice: 1210,
    alertPrice: 300,
    status: "watching",
    addedAt: "2026-03-01",
    tags: ["SF", "古典", "ディストピア"],
    listings: [
      { storeId: "amazon", storeName: "Amazon", price: 480, condition: "良い", shipping: 0, deliveryDays: 1, url: "#", inStock: true },
      { storeId: "mercari", storeName: "メルカリ", price: 380, condition: "目立った傷や汚れなし", shipping: 210, deliveryDays: 2, url: "#", inStock: true },
      { storeId: "rakuten", storeName: "楽天市場", price: 520, condition: "良い", shipping: 0, deliveryDays: 3, url: "#", inStock: true },
      { storeId: "yahoo", storeName: "Yahoo!オークション", price: 310, condition: "可", shipping: 198, deliveryDays: 5, url: "#", inStock: false },
    ],
    priceHistory: [
      { date: "2/3", amazon: 600, mercari: 500, rakuten: 650 },
      { date: "2/10", amazon: 580, mercari: 470, rakuten: 620 },
      { date: "2/17", amazon: 550, mercari: 440, rakuten: 590 },
      { date: "2/24", amazon: 510, mercari: 410, rakuten: 550 },
      { date: "3/3", amazon: 480, mercari: 380, rakuten: 520 },
    ],
  },
  {
    id: "4",
    title: "FACTFULNESS",
    author: "ハンス・ロスリング",
    isbn: "978-4-8222-8767-7",
    publisher: "日経BP",
    publishedYear: 2018,
    genre: "教養・ノンフィクション",
    coverUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&h=560&fit=crop",
    synopsis: "思い込みを手放し、データを元に世界を正しく見る方法を解説。Bill Gates推薦の世界的ベストセラー。",
    moodTagline: "世界を、正しく見たくなったとき。",
    spineColor: "#8B5A2B",
    retailPrice: 1980,
    alertPrice: 500,
    status: "purchased",
    addedAt: "2026-01-15",
    tags: ["データ", "世界", "思い込み"],
    listings: [
      { storeId: "amazon", storeName: "Amazon", price: 890, condition: "非常に良い", shipping: 0, deliveryDays: 1, url: "#", inStock: true },
      { storeId: "mercari", storeName: "メルカリ", price: 720, condition: "目立った傷や汚れなし", shipping: 210, deliveryDays: 2, url: "#", inStock: true },
      { storeId: "rakuten", storeName: "楽天市場", price: 950, condition: "良い", shipping: 0, deliveryDays: 2, url: "#", inStock: true },
      { storeId: "yahoo", storeName: "Yahoo!オークション", price: 680, condition: "やや傷や汚れあり", shipping: 198, deliveryDays: 3, url: "#", inStock: true },
    ],
    priceHistory: [
      { date: "2/3", amazon: 1100, mercari: 900, rakuten: 1150 },
      { date: "2/10", amazon: 1050, mercari: 850, rakuten: 1100 },
      { date: "2/17", amazon: 980, mercari: 800, rakuten: 1050 },
      { date: "2/24", amazon: 930, mercari: 760, rakuten: 1000 },
      { date: "3/3", amazon: 890, mercari: 720, rakuten: 950 },
    ],
  },
  {
    id: "5",
    title: "夜と霧",
    author: "ヴィクトール・フランクル",
    isbn: "978-4-622-03876-5",
    publisher: "みすず書房",
    publishedYear: 1947,
    genre: "心理学・哲学",
    coverUrl: "https://images.unsplash.com/photo-1718049411547-fb7fbb7a8e68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodCUyMGZvZyUyMGRhcmslMjBhdG1vc3BoZXJpYyUyMGJvb2t8ZW58MXx8fHwxNzcyNTkwODUwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    synopsis: "精神科医がナチスの強制収容所での体験を綴った人類の名著。生きる意味を問う深い洞察が読む者の心を打つ。",
    moodTagline: "それでも、生きる意味を信じたいとき。",
    spineColor: "#6B4C8A",
    retailPrice: 1540,
    alertPrice: 350,
    status: "watching",
    addedAt: "2026-03-02",
    tags: ["哲学", "戦争", "実存主義"],
    listings: [
      { storeId: "amazon", storeName: "Amazon", price: 620, condition: "良い", shipping: 0, deliveryDays: 1, url: "#", inStock: true },
      { storeId: "mercari", storeName: "メルカリ", price: 510, condition: "目立った傷や汚れなし", shipping: 210, deliveryDays: 2, url: "#", inStock: true },
      { storeId: "rakuten", storeName: "楽天市場", price: 680, condition: "非常に良い", shipping: 0, deliveryDays: 2, url: "#", inStock: false },
    ],
    priceHistory: [
      { date: "2/3", amazon: 800, mercari: 680, rakuten: 850 },
      { date: "2/10", amazon: 770, mercari: 650, rakuten: 810 },
      { date: "2/17", amazon: 730, mercari: 610, rakuten: 770 },
      { date: "2/24", amazon: 680, mercari: 560, rakuten: 730 },
      { date: "3/3", amazon: 620, mercari: 510, rakuten: 680 },
    ],
  },
];

export const mockNotifications: Notification[] = [
  {
    id: "n1",
    bookId: "1",
    bookTitle: "思考の整理学",
    type: "alert_reached",
    message: "「思考の整理学」がアラート価格（¥200）以下になりました！メルカリで¥150で出品されています。",
    timestamp: "2026-03-04T09:30:00",
    read: false,
    storeId: "mercari",
    price: 150,
  },
  {
    id: "n2",
    bookId: "2",
    bookTitle: "嫌われる勇気",
    type: "price_drop",
    message: "「嫌われる勇気」の価格が下がりました。Yahoo!オークションで¥390（送料込み¥588）で購入できます。",
    timestamp: "2026-03-04T08:15:00",
    read: false,
    storeId: "yahoo",
    price: 390,
  },
  {
    id: "n3",
    bookId: "3",
    bookTitle: "1984年",
    type: "in_stock",
    message: "「1984年」がメルカリに新しく出品されました。¥380（送料別）で購入できます。",
    timestamp: "2026-03-03T20:45:00",
    read: true,
    storeId: "mercari",
    price: 380,
  },
  {
    id: "n4",
    bookId: "1",
    bookTitle: "思考の整理学",
    type: "price_drop",
    message: "「思考の整理学」Amazonで¥185（翌日配送）。過去30日で最安値です！",
    timestamp: "2026-03-03T14:00:00",
    read: true,
    storeId: "amazon",
    price: 185,
  },
  {
    id: "n5",
    bookId: "5",
    bookTitle: "夜と霧",
    type: "reminder",
    message: "「夜と霧」をリストに追加して3日経ちました。最安値¥510（メルカリ）で購入できます。",
    timestamp: "2026-03-02T10:00:00",
    read: true,
    storeId: "mercari",
    price: 510,
  },
];

export const mockSearchResults: Book[] = [
  {
    id: "s1",
    title: "ハーバードの人生を変える授業",
    author: "タル・ベン・シャハー",
    isbn: "978-4-04-601600-8",
    publisher: "大和書房",
    publishedYear: 2010,
    genre: "自己啓発",
    coverUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=560&fit=crop",
    synopsis: "ハーバード大学で最多受講者を記録した「幸福学」講義を書籍化。人生を豊かにする52の教えを収録。",
    moodTagline: "幸せの定義を、もう一度考えたい朝に。",
    spineColor: "#C17A52",
    retailPrice: 1650,
    alertPrice: 400,
    status: "watching",
    addedAt: "",
    tags: ["幸福", "自己啓発", "心理学"],
    listings: [
      { storeId: "amazon", storeName: "Amazon", price: 520, condition: "良い", shipping: 0, deliveryDays: 1, url: "#", inStock: true },
      { storeId: "mercari", storeName: "メルカリ", price: 380, condition: "目立った傷や汚れなし", shipping: 210, deliveryDays: 2, url: "#", inStock: true },
    ],
    priceHistory: [],
  },
  {
    id: "s2",
    title: "人を動かす",
    author: "デール・カーネギー",
    isbn: "978-4-422-10098-9",
    publisher: "創元社",
    publishedYear: 1936,
    genre: "自己啓発",
    coverUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=560&fit=crop",
    synopsis: "人間関係の古典的名著。80年以上読み継がれる自己啓発書の原点。コミュニケーション術の基礎を学べる。",
    moodTagline: "誰かと、もっとうまくつながりたいとき。",
    spineColor: "#4A7C59",
    retailPrice: 1760,
    alertPrice: 400,
    status: "watching",
    addedAt: "",
    tags: ["コミュニケーション", "古典", "人間関係"],
    listings: [
      { storeId: "amazon", storeName: "Amazon", price: 480, condition: "良い", shipping: 0, deliveryDays: 1, url: "#", inStock: true },
      { storeId: "mercari", storeName: "メルカリ", price: 350, condition: "やや傷や汚れあり", shipping: 210, deliveryDays: 2, url: "#", inStock: true },
    ],
    priceHistory: [],
  },
  {
    id: "s3",
    title: "ゼロ・トゥ・ワン",
    author: "ピーター・ティール",
    isbn: "978-4-16-390191-4",
    publisher: "NHK出版",
    publishedYear: 2014,
    genre: "ビジネス",
    coverUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=560&fit=crop",
    synopsis: "PayPal共同創業者が語る、スタートアップが成功するための逆張り思考。独創的なアイデアで未来を切り拓く方法。",
    moodTagline: "まだ誰も見ていない未来を、先に見たいとき。",
    spineColor: "#2C4A6E",
    retailPrice: 1980,
    alertPrice: 500,
    status: "watching",
    addedAt: "",
    tags: ["ビジネス", "スタートアップ", "起業"],
    listings: [
      { storeId: "amazon", storeName: "Amazon", price: 680, condition: "非常に良い", shipping: 0, deliveryDays: 1, url: "#", inStock: true },
      { storeId: "mercari", storeName: "メルカリ", price: 500, condition: "目立った傷や汚れなし", shipping: 210, deliveryDays: 2, url: "#", inStock: true },
    ],
    priceHistory: [],
  },
];