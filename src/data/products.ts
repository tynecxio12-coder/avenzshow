const optimizeImageUrl = (url?: string | null) => {
  const fallback = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=75&w=900&auto=format&fit=crop";
  if (!url) return fallback;

  if (url.includes("images.unsplash.com")) {
    const clean = url.split("?")[0];
    return `${clean}?q=75&w=900&auto=format&fit=crop`;
  }

  return url;
};
export type ProductColor = {
  name: string;
  hex: string;
};

export type ProductReview = {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  verified: boolean;
  date: string;
};

export type Product = {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  brand: string;
  description: string;
  price: number;
  oldPrice: number | null;
  discount: number;
  currency: string;
  stock: number;
  sku: string;
  image_url: string;
  images: string[];
  featured: boolean;
  bestSeller: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  isTrending: boolean;
  rating: number;
  reviewsCount: number;
  category: string;
  gender: string;
  tags: string[];
  colors: ProductColor[];
  sizes: number[];
  features: string[];
};

export const products: Product[] = [];

export const categories = [
  "sneakers",
  "formal",
  "boots",
  "sports",
  "casual",
  "sandals",
];

export const categoryLabels: Record<string, string> = {
  sneakers: "Sneakers",
  formal: "Formal Shoes",
  boots: "Boots",
  sports: "Sports Shoes",
  casual: "Casual Shoes",
  sandals: "Sandals",
};

export const genders = ["men", "women", "unisex"];

export const reviews: ProductReview[] = [];

const normalizeCategory = (value?: string | null) => {
  const raw = (value || "").trim().toLowerCase();

  if (!raw) return "";

  if (["sneaker", "sneakers", "running", "running shoes", "sneakers shoes"].includes(raw)) {
    return "sneakers";
  }

  if (["formal", "formal shoes", "office", "leather formal", "loafer", "oxford", "derby"].includes(raw)) {
    return "formal";
  }

  if (["boot", "boots"].includes(raw)) {
    return "boots";
  }

  if (["sport", "sports", "sports shoes", "sportswear", "trainer", "athletic"].includes(raw)) {
    return "sports";
  }

  if (["casual", "casual shoes"].includes(raw)) {
    return "casual";
  }

  if (["sandal", "sandals", "slide", "slippers"].includes(raw)) {
    return "sandals";
  }

  return "";
};

const inferCategory = (name: string, slug: string) => {
  const text = `${name} ${slug}`.toLowerCase();

  if (text.includes("boot")) return "boots";
  if (text.includes("sandal") || text.includes("slide") || text.includes("slipper")) return "sandals";

  if (
    text.includes("formal") ||
    text.includes("oxford") ||
    text.includes("loafer") ||
    text.includes("derby")
  ) {
    return "formal";
  }

  if (
    text.includes("sport") ||
    text.includes("running") ||
    text.includes("trainer") ||
    text.includes("athletic")
  ) {
    return "sports";
  }

  if (text.includes("casual")) return "casual";

  return "sneakers";
};

const normalizeGender = (value?: string | null) => {
  const raw = (value || "").trim().toLowerCase();

  if (["men", "male", "man", "gents", "gent"].includes(raw)) return "men";
  if (["women", "female", "woman", "ladies", "lady"].includes(raw)) return "women";
  if (["unisex", "all"].includes(raw)) return "unisex";

  return "";
};

const inferGender = (name: string, brand: string) => {
  const text = `${name} ${brand}`.toLowerCase();

  if (text.includes("women") || text.includes("ladies")) return "women";
  if (text.includes("men") || text.includes("gent")) return "men";

  return "unisex";
};

const buildColors = (name: string): ProductColor[] => {
  const text = name.toLowerCase();

  if (text.includes("gold")) {
    return [
      { name: "Gold", hex: "#D4AF37" },
      { name: "Black", hex: "#111111" },
      { name: "White", hex: "#F5F5F5" },
    ];
  }

  if (text.includes("black")) {
    return [
      { name: "Black", hex: "#111111" },
      { name: "White", hex: "#F5F5F5" },
      { name: "Gray", hex: "#6B7280" },
    ];
  }

  if (text.includes("brown")) {
    return [
      { name: "Brown", hex: "#7C4A2D" },
      { name: "Tan", hex: "#C19A6B" },
      { name: "Black", hex: "#111111" },
    ];
  }

  return [
    { name: "Black", hex: "#111111" },
    { name: "White", hex: "#F5F5F5" },
    { name: "Gray", hex: "#6B7280" },
  ];
};

export const mapSupabaseProduct = (row: any): Product => {
  const price = Number(row.price || 0);

  const oldPrice =
    row.old_price !== null && row.old_price !== undefined
      ? Number(row.old_price)
      : null;

  const discount =
    oldPrice && oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : 0;

  // 🔥 IMPORTANT FIX: USE DB VALUE FIRST, THEN FALLBACK TO INFERENCE
  const category =
    normalizeCategory(row.category) || inferCategory(row.name || "", row.slug || "");

  const gender =
    normalizeGender(row.gender) || inferGender(row.name || "", row.brand || "");

  const colors = buildColors(row.name || "");

  const mainImage = optimizeImageUrl(row.image_url || row.thumbnail);
const secondImage = optimizeImageUrl(row.image_url_2 || row.image_url || row.thumbnail);
const thirdImage = optimizeImageUrl(row.image_url_3 || row.image_url || row.thumbnail);
  

  return {
    id: row.id,
    category_id: row.category_id ?? null,
    name: row.name ?? "Untitled Product",
    slug: row.slug ?? row.id,
    brand: row.brand ?? "AvenzShoe",
    description: row.description ?? "Premium footwear for everyday luxury.",
    price,
    oldPrice,
    discount,
    currency: row.currency ?? "BDT",
    stock: Number(row.stock ?? 0),
    sku: row.sku ?? "N/A",
    image_url: mainImage,
    images: [mainImage, secondImage, thirdImage],
    featured: Boolean(row.featured),
    bestSeller: Boolean(row.best_seller),
    isNew: Boolean(row.new_arrival),
    isBestSeller: Boolean(row.best_seller),
    isTrending: Boolean(row.featured),
    rating: Number(row.rating ?? 4.5),
    reviewsCount: Number(row.reviews_count ?? 12),
    category,
    gender,
    tags: [
      (row.name ?? "").toLowerCase(),
      (row.brand ?? "").toLowerCase(),
      category,
      gender,
      ...(Array.isArray(row.tags) ? row.tags.map((t: string) => t.toLowerCase()) : []),
    ].filter(Boolean),
    colors,
    sizes: Array.isArray(row.sizes) && row.sizes.length ? row.sizes : [39, 40, 41, 42, 43, 44],
    features: Array.isArray(row.features) && row.features.length
      ? row.features
      : [
          "Premium upper material",
          "Comfort-focused cushioned sole",
          "Durable outsole for daily wear",
          "Stylish modern silhouette",
        ],
  };
};
