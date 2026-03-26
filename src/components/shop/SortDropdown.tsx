type Props = {
  value: string;
  onChange: (value: string) => void;
};

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Best Selling", value: "popular" },
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
];

export default function SortDropdown({ value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gold/50"
    >
      {sortOptions.map((o) => (
        <option key={o.value} value={o.value}>
          Sort by: {o.label}
        </option>
      ))}
    </select>
  );
}
