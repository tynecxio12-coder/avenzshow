import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

const footerLinks = {
  shop: [
    { label: 'New Arrivals', path: '/shop?filter=new' },
    { label: 'Best Sellers', path: '/shop?filter=bestseller' },
    { label: 'Sneakers', path: '/shop?category=sneakers' },
    { label: 'Formal Shoes', path: '/shop?category=formal' },
    { label: 'Boots', path: '/shop?category=boots' },
    { label: 'Sale', path: '/shop?filter=sale' },
  ],
  help: [
    { label: 'FAQ', path: '/faq' },
    { label: 'Shipping Policy', path: '/shipping-policy' },
    { label: 'Return Policy', path: '/return-policy' },
    { label: 'Track Order', path: '/track-order' },
    { label: 'Contact Us', path: '/contact' },
  ],
  company: [
    { label: 'About Us', path: '/about' },
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms & Conditions', path: '/terms' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="section-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="font-display text-2xl font-bold">
              Avenz<span className="text-gold">Shoe</span>
            </Link>
            <p className="mt-4 text-sm text-primary-foreground/60 leading-relaxed">
              Premium footwear for every occasion. Step into elegance with AvenzShoe — where craftsmanship meets contemporary style. Proudly based in Dhaka, Bangladesh.
            </p>
            <div className="flex gap-4 mt-6">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:bg-gold hover:border-gold hover:text-primary transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              {footerLinks.shop.map(l => (
                <li key={l.path}><Link to={l.path} className="text-sm text-primary-foreground/60 hover:text-gold transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Help</h4>
            <ul className="space-y-2">
              {footerLinks.help.map(l => (
                <li key={l.path}><Link to={l.path} className="text-sm text-primary-foreground/60 hover:text-gold transition-colors">{l.label}</Link></li>
              ))}
            </ul>
            <h4 className="font-display text-lg font-semibold mb-3 mt-6">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map(l => (
                <li key={l.path}><Link to={l.path} className="text-sm text-primary-foreground/60 hover:text-gold transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/60">
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" /> House 45, Road 12, Gulshan-1, Dhaka 1212, Bangladesh</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-gold" /> +880 1700-123456</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-gold" /> hello@avenzshoe.com.bd</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="section-padding py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-primary-foreground/40">
          <p>&copy; {new Date().getFullYear()} AvenzShoe. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>bKash</span><span>Nagad</span><span>Visa</span><span>Mastercard</span><span>COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
