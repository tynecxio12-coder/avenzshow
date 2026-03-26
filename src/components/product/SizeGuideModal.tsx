type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SizeGuideModal({ open, onClose }: Props) {
  if (!open) return null;

  const rows = [
    ["39", "5.5", "6.5", "24.5 cm"],
    ["40", "6.5", "7.5", "25 cm"],
    ["41", "7", "8", "25.5 cm"],
    ["42", "8", "9", "26 cm"],
    ["43", "9", "10", "26.5 cm"],
    ["44", "9.5", "10.5", "27 cm"],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[28px] border border-border bg-card p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-2xl font-bold">Size Guide</h3>
          <button onClick={onClose} className="rounded-full border border-border px-3 py-1 text-sm">
            Close
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left">EU</th>
                <th className="px-4 py-3 text-left">UK</th>
                <th className="px-4 py-3 text-left">US</th>
                <th className="px-4 py-3 text-left">Foot Length</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row[0]} className="border-t border-border">
                  {row.map((cell) => (
                    <td key={cell} className="px-4 py-3">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          Measure your foot from heel to longest toe and compare it with the chart above.
        </p>
      </div>
    </div>
  );
}
