type Props = {
  sizes: number[];
  selectedSize: number | null;
  onSelect: (size: number) => void;
};

export default function SizeSelector({ sizes, selectedSize, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((size) => (
        <button
          key={size}
          onClick={() => onSelect(size)}
          className={`flex h-12 w-12 items-center justify-center rounded-xl border text-sm font-medium transition-all ${
            selectedSize === size
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border hover:border-gold"
          }`}
        >
          {size}
        </button>
      ))}
    </div>
  );
}
