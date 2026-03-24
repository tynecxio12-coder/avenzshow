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

export const genders = ["men", "women", "unisex"];

export const reviews: ProductReview[] = [];

const inferCategory = (name: string, slug: string) => {
  const text = `${name} ${slug}`.toLowerCase();

  if (text.includes("boot")) return "boots";
  if (text.includes("sandal") || text.includes("slide")) return "sandals";
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

  const category = inferCategory(row.name || "", row.slug || "");
  const gender = inferGender(row.name || "", row.brand || "");
  const colors = buildColors(row.name || "");
  const mainImage =
    row.image_url ||
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff";

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
    images: [mainImage, mainImage, mainImage],
    featured: Boolean(row.featured),
    bestSeller: Boolean(row.best_seller),
    isNew: Boolean(row.new_arrival),
    isBestSeller: Boolean(row.best_seller),
    isTrending: Boolean(row.featured),
    rating: Number(row.rating ?? 0),
    reviewsCount: Number(row.reviews_count ?? 0),
    category,
    gender,
    tags: [
      (row.name ?? "").toLowerCase(),
      (row.brand ?? "").toLowerCase(),
      category,
      gender,
    ].filter(Boolean),
    colors,
    sizes: [39, 40, 41, 42, 43, 44],
    features: [
      "Premium upper material",
      "Comfort-focused cushioned sole",
      "Durable outsole for daily wear",
      "Stylish modern silhouette",
    ],
  };
};
