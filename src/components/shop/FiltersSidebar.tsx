import { X } from "lucide-react";

type Props = {
  categories: string[];
  genders: string[];
  brands?: string[];
  selectedCategory: string;
  selectedGender: string;
  selectedBrand?: string;
  selectedPrice: number | null;
  priceRanges: { label: string; min: number; max: number }[];
  onCategoryChange: (value: string) => void;
  onGenderChange: (value: string) => void;
  onBrandChange?: (value: string) => void;
  onPriceChange: (value: number | null) => void;
  onClear: () => void;
};

export default function FiltersSidebar({
  categories,
  genders,
  brands = [],
  selectedCategory,
  selectedGender,
  selectedBrand = "",
  selectedPrice,
  priceRanges,
  onCategoryChange,
  onGenderChange,
  onBrandChange,
  onPriceChange,
  onClear,
}: Props) {
  const hasFilters = !!selectedCategory || !!selectedGender || !!selectedBrand || selectedPrice !== null;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl font-bold">Filters</h3>
        {hasFilters && (
          <button onClick={onClear} className="inline-flex items-center gap-1 text-sm text-destructive">
            <X className="h-4 w-4" />
            Clear
          </button>
        )}
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Category
        </h4>
        <div className="space-y-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => onCategoryChange(selectedCategory === c ? "" : c)}
              className={`block w-full rounded-xl px-3 py-2.5 text-left text-sm capitalize transition-colors ${
                selectedCategory === c ? "bg-primary text-primary-foreground" : "hover:bg-muted"
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
              onClick={() => onGenderChange(selectedGender === g ? "" : g)}
              className={`block w-full rounded-xl px-3 py-2.5 text-left text-sm capitalize transition-colors ${
                selectedGender === g ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {brands.length > 0 && onBrandChange && (
        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Brand
          </h4>
          <div className="space-y-2">
            {brands.map((b) => (
              <button
                key={b}
                onClick={() => onBrandChange(selectedBrand === b ? "" : b)}
                className={`block w-full rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                  selectedBrand === b ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Price Range
        </h4>
        <div className="space-y-2">
          {priceRanges.map((r, i) => (
            <button
              key={r.label}
              onClick={() => onPriceChange(selectedPrice === i ? null : i)}
              className={`block w-full rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                selectedPrice === i ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
