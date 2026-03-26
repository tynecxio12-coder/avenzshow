import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, Instagram, Twitter, Facebook, Youtube, ShieldCheck, Truck, RotateCcw } from "lucide-react";

const footerLinks = {
  shop: [
    { label: "New Arrivals", path: "/shop?filter=new" },
    { label: "Best Sellers", path: "/shop?filter=bestseller" },
    { label: "Sneakers", path: "/shop?category=sneakers" },
    { label: "Formal Shoes", path: "/shop?category=formal" },
    { label: "Boots", path: "/shop?category=boots" },
    { label: "Sale", path: "/shop?filter=sale" },
  ],
  help: [
    { label: "FAQ", path: "/faq" },
    { label: "Shipping Policy", path: "/shipping-policy" },
    { label: "Return Policy", path: "/return-policy" },
    { label: "Track Order", path: "/track-order" },
    { label: "Contact Us", path: "/contact" },
  ],
  company: [
    { label: "About Us", path: "/about" },
    { label: "Privacy Policy", path: "/privacy" },
    { label: "Terms & Conditions", path: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="border-b border-primary-foreground/10">
        <div className="section-padding grid gap-4 py-5 md:grid-cols-3">
          {[
            { icon: Truck, title: "Fast Delivery", text: "Reliable shipping across Bangladesh" },
            { icon: RotateCcw, title: "Easy Exchange", text: "7-day return support" },
            { icon: ShieldCheck, title: "Secure Checkout", text: "Safe and trusted order process" },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-3 rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/10 text-gold">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs text-primary-foreground/60">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section-padding py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="font-display text-2xl font-bold">
              Avenz<span className="text-gold">Shoe</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-primary-foreground/60">
              Premium footwear for every occasion. Step into elegance with AvenzShoe —
              where craftsmanship meets contemporary style. Proudly based in Dhaka, Bangladesh.
            </p>

            <div className="mt-6 flex gap-4">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-primary-foreground/20 transition-all hover:border-gold hover:bg-gold hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-display text-lg font-semibold">Shop</h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((l) => (
                <li key={l.path}>
                  <Link to={l.path} className="text-sm text-primary-foreground/60 transition-colors hover:text-gold">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-display text-lg font-semibold">Help</h4>
            <ul className="space-y-2">
              {footerLinks.help.map((l) => (
                <li key={l.path}>
                  <Link to={l.path} className="text-sm text-primary-foreground/60 transition-colors hover:text-gold">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="mb-3 mt-6 font-display text-lg font-semibold">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((l) => (
                <li key={l.path}>
                  <Link to={l.path} className="text-sm text-primary-foreground/60 transition-colors hover:text-gold">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-display text-lg font-semibold">Contact</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/60">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                House 45, Road 12, Gulshan-1, Dhaka 1212, Bangladesh
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gold" />
                +880 1700-123456
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gold" />
                hello@avenzshoe.com.bd
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="section-padding flex flex-col items-center justify-between gap-4 py-6 text-xs text-primary-foreground/40 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} AvenzShoe. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>bKash</span>
            <span>Nagad</span>
            <span>Visa</span>
            <span>Mastercard</span>
            <span>COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
