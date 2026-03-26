import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Grid3X3, List, SlidersHorizontal, X, Search } from "lucide-react";
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
  const [localSearch, setLocalSearch] = useState("");

  const [sort, setSort] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState(params.get("category") || "");
  const [selectedGender, setSelectedGender] = useState(params.get("gender") || "");
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [gridView, setGridView] = useState(true);

  const filter = params.get("filter") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setErrorMessage("");

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
    const finalSearch = (localSearch || searchQuery || "").trim().toLowerCase();

    if (finalSearch) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(finalSearch) ||
          p.brand.toLowerCase().includes(finalSearch) ||
          p.category.toLowerCase().includes(finalSearch) ||
          p.tags.some((t) => t.toLowerCase().includes(finalSearch))
      );
    }

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (selectedGender) {
      result = result.filter((p) => p.gender === selectedGender || p.gender === "unisex");
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
  }, [allProducts, searchQuery, localSearch, selectedCategory, selectedGender, selectedPrice, filter, sort]);

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedGender("");
    setSelectedPrice(null);
    setLocalSearch("");
  };

  const activeChips = [
    selectedCategory && { label: selectedCategory, onRemove: () => setSelectedCategory("") },
    selectedGender && { label: selectedGender, onRemove: () => setSelectedGender("") },
    selectedPrice !== null && {
      label: priceRanges[selectedPrice].label,
      onRemove: () => setSelectedPrice(null),
    },
    localSearch && { label: `Search: ${localSearch}`, onRemove: () => setLocalSearch("") },
  ].filter(Boolean) as { label: string; onRemove: () => void }[];

  const hasFilters = activeChips.length > 0;

  const pageTitle =
    filter === "new"
      ? "New Arrivals"
      : filter === "bestseller"
      ? "Best Sellers"
      : filter === "trending"
      ? "Trending Now"
      : filter === "sale"
      ? "Sale Collection"
      : selectedCategory
      ? selectedCategory
      : "All Shoes";

  const FilterPanel = () => (
    <div className="space-y-8">
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Category
        </h4>
        <div className="space-y-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(selectedCategory === c ? "" : c)}
              className={`block w-full rounded-xl px-3 py-2.5 text-left text-sm capitalize transition-colors ${
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
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Gender
        </h4>
        <div className="space-y-2">
          {genders.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGender(selectedGender === g ? "" : g)}
              className={`block w-full rounded-xl px-3 py-2.5 text-left text-sm capitalize transition-colors ${
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
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Price Range
        </h4>
        <div className="space-y-2">
          {priceRanges.map((r, i) => (
            <button
              key={r.label}
              onClick={() => setSelectedPrice(selectedPrice === i ? null : i)}
              className={`block w-full rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
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
        <button onClick={clearFilters} className="text-sm font-medium text-destructive hover:underline">
          Clear all filters
        </button>
      )}
    </div>
  );

  if (loading) {
    return (
      <Layout>
        <div className="section-padding py-20">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-border bg-card">
                <div className="aspect-[4/4.4] bg-muted" />
                <div className="space-y-3 p-4">
                  <div className="h-3 w-20 rounded bg-muted" />
                  <div className="h-4 w-40 rounded bg-muted" />
                  <div className="h-3 w-24 rounded bg-muted" />
                  <div className="h-4 w-28 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (errorMessage) {
    return (
      <Layout>
        <div className="section-padding py-20 text-center">
          <p className="text-lg font-semibold text-destructive">Failed to load products</p>
          <p className="mt-2 text-sm text-muted-foreground">{errorMessage}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="section-padding py-8">
        <div className="mb-8 rounded-[28px] border border-border bg-card p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Premium Collection
              </p>
              <h1 className="font-display text-3xl font-bold capitalize md:text-5xl">
                {pageTitle}
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
                Explore premium footwear designed for comfort, performance, and modern style.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
              <div className="relative min-w-[240px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Search shoes, brands, categories..."
                  className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>

              <div className="hidden items-center overflow-hidden rounded-xl border border-border sm:flex">
                <button
                  onClick={() => setGridView(true)}
                  className={`px-3 py-2.5 ${gridView ? "bg-primary text-primary-foreground" : "bg-card"}`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setGridView(false)}
                  className={`px-3 py-2.5 ${!gridView ? "bg-primary text-primary-foreground" : "bg-card"}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              <button
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 lg:hidden"
                onClick={() => setFiltersOpen(true)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {hasFilters && (
          <div className="mb-6 flex flex-wrap gap-2">
            {activeChips.map((chip) => (
              <button
                key={chip.label}
                onClick={chip.onRemove}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium"
              >
                {chip.label}
                <X className="h-3.5 w-3.5" />
              </button>
            ))}

            <button
              onClick={clearFilters}
              className="inline-flex items-center rounded-full bg-muted px-3 py-1.5 text-xs font-medium"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="flex gap-8">
          <aside className="hidden w-64 shrink-0 rounded-[24px] border border-border bg-card p-5 lg:block">
            <FilterPanel />
          </aside>

          {filtersOpen && (
            <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm lg:hidden">
              <div className="mx-auto max-w-md p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="font-display text-2xl font-bold">Filters</h3>
                  <button onClick={() => setFiltersOpen(false)}>
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="rounded-[24px] border border-border bg-card p-5">
                  <FilterPanel />
                </div>

                <button
                  onClick={() => setFiltersOpen(false)}
                  className="mt-6 w-full rounded-xl bg-primary py-3 font-semibold uppercase tracking-[0.18em] text-primary-foreground"
                >
                  Show {filtered.length} Results
                </button>
              </div>
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filtered.length}</span> products
              </p>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gold/50"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    Sort by: {o.label}
                  </option>
                ))}
              </select>
            </div>

            {filtered.length === 0 ? (
              <div className="rounded-[28px] border border-dashed border-border bg-card py-20 text-center">
                <p className="font-display text-2xl font-bold">No products found</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try changing your filters or search keywords.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-5 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div
                className={
                  gridView
                    ? "grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4"
                    : "space-y-4"
                }
              >
                {filtered.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
