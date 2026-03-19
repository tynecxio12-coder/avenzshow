import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, Search, Menu, X, User, ChevronDown } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'Home', path: '/' },
  {
    label: 'Shop', path: '/shop',
    children: [
      { label: 'All Shoes', path: '/shop' },
      { label: 'Sneakers', path: '/shop?category=sneakers' },
      { label: 'Formal', path: '/shop?category=formal' },
      { label: 'Casual', path: '/shop?category=casual' },
      { label: 'Boots', path: '/shop?category=boots' },
      { label: 'Sandals', path: '/shop?category=sandals' },
      { label: 'Sports', path: '/shop?category=sports' },
    ],
  },
  { label: 'New Arrivals', path: '/shop?filter=new' },
  { label: 'Best Sellers', path: '/shop?filter=bestseller' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [hoverMenu, setHoverMenu] = useState<string | null>(null);
  const { cartCount, wishlist, searchQuery, setSearchQuery } = useStore();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setSearchOpen(false); }, [location]);

  return (
    <>
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground text-xs py-2 text-center tracking-widest font-body uppercase">
        Free shipping on orders over $150 | Use code <span className="text-gold font-semibold">AVENZ20</span> for 20% off
      </div>

      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-card/95 backdrop-blur-lg shadow-lg' : 'bg-card'}`}>
        <div className="section-padding">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile menu */}
            <button className="lg:hidden p-2 -ml-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-1">
              <span className="font-display text-2xl lg:text-3xl font-bold tracking-tight">
                Avenz<span className="text-gold-gradient">Shoe</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map(link => (
                <div key={link.label} className="relative" onMouseEnter={() => setHoverMenu(link.label)} onMouseLeave={() => setHoverMenu(null)}>
                  <Link
                    to={link.path}
                    className={`text-sm font-medium tracking-wide uppercase transition-colors hover:text-gold flex items-center gap-1
                      ${location.pathname === link.path ? 'text-gold' : 'text-foreground/80'}`}
                  >
                    {link.label}
                    {link.children && <ChevronDown className="w-3 h-3" />}
                  </Link>
                  {link.children && (
                    <AnimatePresence>
                      {hoverMenu === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-48 bg-card rounded-lg shadow-xl border border-border py-2"
                        >
                          {link.children.map(child => (
                            <Link key={child.path} to={child.path} className="block px-4 py-2 text-sm hover:bg-muted hover:text-gold transition-colors">
                              {child.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3 lg:gap-4">
              <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 hover:text-gold transition-colors" aria-label="Search">
                <Search className="w-5 h-5" />
              </button>
              <Link to="/wishlist" className="p-2 hover:text-gold transition-colors relative hidden sm:block" aria-label="Wishlist">
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 gold-gradient text-[10px] font-bold rounded-full flex items-center justify-center text-primary">
                    {wishlist.length}
                  </span>
                )}
              </Link>
              <Link to="/account" className="p-2 hover:text-gold transition-colors hidden sm:block" aria-label="Account">
                <User className="w-5 h-5" />
              </Link>
              <Link to="/cart" className="p-2 hover:text-gold transition-colors relative" aria-label="Cart">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 gold-gradient text-[10px] font-bold rounded-full flex items-center justify-center text-primary">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-border overflow-hidden"
            >
              <div className="section-padding py-4">
                <div className="relative max-w-2xl mx-auto">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search for shoes, brands, styles..."
                    className="w-full pl-12 pr-4 py-3 bg-muted rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-border overflow-hidden bg-card"
            >
              <nav className="section-padding py-4 space-y-1">
                {navLinks.map(link => (
                  <div key={link.label}>
                    <Link to={link.path} className="block py-3 text-sm font-medium uppercase tracking-wide hover:text-gold transition-colors">
                      {link.label}
                    </Link>
                    {link.children && (
                      <div className="pl-4 space-y-1">
                        {link.children.map(child => (
                          <Link key={child.path} to={child.path} className="block py-2 text-sm text-muted-foreground hover:text-gold transition-colors">
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="flex gap-4 pt-4 border-t border-border">
                  <Link to="/wishlist" className="flex items-center gap-2 text-sm hover:text-gold"><Heart className="w-4 h-4" /> Wishlist</Link>
                  <Link to="/account" className="flex items-center gap-2 text-sm hover:text-gold"><User className="w-4 h-4" /> Account</Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
