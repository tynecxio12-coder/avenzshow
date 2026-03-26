type Card = {
  title: string;
  value: number;
  icon: React.ReactNode;
};

export default function AccountOverviewCards({ cards }: { cards: Card[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.title} className="rounded-2xl border border-border bg-background p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{card.title}</p>
            <div className="text-gold">{card.icon}</div>
          </div>
          <p className="mt-3 text-3xl font-bold text-primary">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
