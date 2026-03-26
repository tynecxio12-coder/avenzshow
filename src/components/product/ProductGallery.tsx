type Props = {
  images: string[];
  name: string;
  selectedImage: number;
  onSelect: (index: number) => void;
};

export default function ProductGallery({ images, name, selectedImage, onSelect }: Props) {
  const mainImage = images?.[selectedImage] || "/placeholder.svg";

  return (
    <div>
      <div className="overflow-hidden rounded-[28px] border border-border bg-muted">
        <img
          src={mainImage}
          alt={name}
          className="aspect-square w-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
        {images.map((img, i) => (
          <button
            key={`${img}-${i}`}
            onClick={() => onSelect(i)}
            className={`h-24 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${
              i === selectedImage ? "border-gold" : "border-border hover:border-gold/40"
            }`}
          >
            <img src={img} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
