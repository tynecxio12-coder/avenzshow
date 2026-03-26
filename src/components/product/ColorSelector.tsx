type Color = { name: string; hex: string };

type Props = {
  colors: Color[];
  selectedColor: string;
  onSelect: (color: string) => void;
};

export default function ColorSelector({ colors, selectedColor, onSelect }: Props) {
  return (
    <div className="flex gap-2">
      {colors.map((c) => (
        <button
          key={c.name}
          onClick={() => onSelect(c.name)}
          className={`h-11 w-11 rounded-full border-2 transition-all ${
            selectedColor === c.name ? "scale-110 border-gold" : "border-border"
          }`}
          style={{ backgroundColor: c.hex }}
          title={c.name}
        />
      ))}
    </div>
  );
}
