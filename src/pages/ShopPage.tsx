import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Grid3X3, List, SlidersHorizontal, X } from "lucide-react";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/ProductCard";
import { categories, genders, Product, mapSupabaseProduct } from "@/data/products";
import { useStore } from "@/contexts/StoreContext";
import { supabase } from "@/lib/supabase";

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Most Popular", value: "popular" },
  { label: "Top Rated", value: "rating" },
];

const priceRanges = [
  { label: "Under ৳2,000", min: 0, max: 2000 },
  { label: "৳2,000 - ৳4,000", min: 2000, max: 4000 },
  { label: "৳4,000 - ৳6,000", min: 4000, max: 6000 },
  { label: "Over ৳6,000", min: 6000, max: Infinity },
];

export default function ShopPage() {
  const [params] = useSearchParams();
  const { searchQuery } = useStore();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [sort, setSort] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState(params.get("category") || "");
  const [selectedGender, setSelectedGender] = useState(params.get("gender") || "");
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [gridView, setGridView] = useState(true);

  const filter = params.get("filter") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setErrorMessage(error.message);
      } else {
        setAllProducts((data || []).map(mapSupabaseProduct));
      }

      setLoading(false);
    };

    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    let result = [...allProducts];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q))
      );
    }

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (selectedGender) {
      result = result.filter(
        (p) => p.gender === selectedGender || p.gender === "unisex"
      );
    }

    if (selectedPrice !== null) {
      const range = priceRanges[selectedPrice];
      result = result.filter((p) => p.price >= range.min && p.price < range.max);
    }

    if (filter === "new") result = result.filter((p) => p.isNew);
    if (filter === "bestseller") result = result.filter((p) => p.isBestSeller);
    if (filter === "trending") result = result.filter((p) => p.isTrending);
    if (filter === "sale") result = result.filter((p) => p.discount > 0);

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        result.sort((a, b) => b.reviewsCount - a.reviewsCount);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return result;
  }, [allProducts, searchQuery, selectedCategory, selectedGender, selectedPrice, filter, sort]);

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedGender("");
    setSelectedPrice(null);
  };

  const hasFilters = selectedCategory || selectedGender || selectedPrice !== null;

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold text-sm uppercase tracking-wide mb-3">Category</h4>
        <div className="space-y-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(selectedCategory === c ? "" : c)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm capitalize transition-colors ${
                selectedCategory === c
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-sm uppercase tracking-wide mb-3">Gender</h4>
        <div className="space-y-2">
          {genders.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGender(selectedGender === g ? "" : g)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm capitalize transition-colors ${
                selectedGender === g
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-sm uppercase tracking-wide mb-3">Price Range</h4>
        <div className="space-y-2">
          {priceRanges.map((r, i) => (
            <button
              key={i}
              onClick={() => setSelectedPrice(selectedPrice === i ? null : i)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedPrice === i
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="text-sm text-destructive hover:underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  if (loading) {
    return (
      <Layout>
        <div className="section-padding py-20 text-center">
          <p className="text-lg">Loading products...</p>
        </div>
      </Layout>
    );
  }

  if (errorMessage) {
    return (
      <Layout>
        <div className="section-padding py-20 text-center text-red-500">
          Error: {errorMessage}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="section-padding py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold">
              {filter === "new"
                ? "New Arrivals"
                : filter === "bestseller"
                ? "Best Sellers"
                : filter === "trending"
                ? "Trending"
                : selectedCategory
                ? <span className="capitalize">{selectedCategory}</span>
                : "All Shoes"}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">{filtered.length} products</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 border border-border rounded-lg"
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>

            <div className="hidden sm:flex items-center border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setGridView(true)}
                className={`p-2 ${gridView ? "bg-primary text-primary-foreground" : ""}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGridView(false)}
                className={`p-2 ${!gridView ? "bg-primary text-primary-foreground" : ""}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-sm border border-border rounded-lg px-3 py-2 bg-card focus:outline-none focus:ring-2 focus:ring-gold/50"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          <div className="hidden lg:block w-56 shrink-0">
            <FilterPanel />
          </div>

          {filtersOpen && (
            <div className="fixed inset-0 z-50 bg-background lg:hidden overflow-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display text-xl font-bold">Filters</h3>
                  <button onClick={() => setFiltersOpen(false)}>
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <FilterPanel />

                <button
                  onClick={() => setFiltersOpen(false)}
                  className="w-full mt-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold text-sm uppercase tracking-wide"
                >
                  Show {filtered.length} Results
                </button>
              </div>
            </div>
          )}

          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl font-display font-semibold">No products found</p>
                <p className="text-muted-foreground mt-2 text-sm">Try adjusting your filters</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className={gridView ? "grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6" : "space-y-4"}>
                {filtered.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
