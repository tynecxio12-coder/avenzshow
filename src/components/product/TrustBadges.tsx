import { Truck, RotateCcw, Shield } from "lucide-react";

const badges = [
  { icon: Truck, title: "Fast Delivery", text: "1–3 business days" },
  { icon: RotateCcw, title: "Easy Exchange", text: "7-day return support" },
  { icon: Shield, title: "Secure Checkout", text: "Trusted payment flow" },
];

export default function TrustBadges() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {badges.map(({ icon: Icon, title, text }) => (
        <div key={title} className="rounded-2xl border border-border bg-card p-4 text-center">
          <Icon className="mx-auto mb-2 h-5 w-5 text-gold" />
          <p className="text-sm font-semibold">{title}</p>
          <p className="mt-1 text-xs text-muted-foreground">{text}</p>
        </div>
      ))}
    </div>
  );
}
