import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  User,
  ChevronDown,
  LogIn,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useStore } from "@/contexts/StoreContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Home", path: "/" },
  {
    label: "Shop",
    path: "/shop",
    featured: [
      { label: "New Arrivals", path: "/shop?filter=new" },
      { label: "Best Sellers", path: "/shop?filter=bestseller" },
      { label: "Sale Collection", path: "/shop?filter=sale" },
    ],
    children: [
      { label: "All Shoes", path: "/shop" },
      { label: "Sneakers", path: "/shop?category=sneakers" },
      { label: "Formal", path: "/shop?category=formal" },
      { label: "Casual", path: "/shop?category=casual" },
      { label: "Boots", path: "/shop?category=boots" },
      { label: "Sandals", path: "/shop?category=sandals" },
      { label: "Sports", path: "/shop?category=sports" },
    ],
  },
  { label: "New Arrivals", path: "/shop?filter=new" },
  { label: "Best Sellers", path: "/shop?filter=bestseller" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [hoverMenu, setHoverMenu] = useState<string | null>(null);
  const [accountPath, setAccountPath] = useState("/login");

  const { cartCount, wishlist, searchQuery, setSearchQuery } = useStore();
  const { user } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location]);

  useEffect(() => {
    const loadRole = async () => {
      if (!user) {
        setAccountPath("/login");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      setAccountPath(data?.role === "admin" ? "/admin/orders" : "/account");
    };

    loadRole();
  }, [user]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/shop");
    setSearchOpen(false);
  };

  const isActivePath = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname === path;
  };

  return (
    <>
      <div className="bg-primary text-primary-foreground">
        <div className="section-padding flex flex-col items-center justify-between gap-2 py-2 text-[11px] uppercase tracking-[0.18em] sm:flex-row">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            <span>Free delivery over ৳5000</span>
          </div>
          <div className="hidden sm:block">New arrivals now live</div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-gold" />
            <span>Cash on delivery available</span>
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-card/95 backdrop-blur-lg shadow-lg" : "bg-card"
        }`}
      >
        <div className="section-padding">
          <div className="flex h-16 items-center justify-between lg:h-20">
            <button className="p-2 lg:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <Link to="/" className="flex items-center gap-1">
              <span className="font-display text-2xl font-bold tracking-tight lg:text-3xl">
                Avenz<span className="text-gold">Shoe</span>
              </span>
            </Link>

            <nav className="hidden items-center gap-8 lg:flex">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setHoverMenu(link.label)}
                  onMouseLeave={() => setHoverMenu(null)}
                >
                  <Link
                    to={link.path}
                    className={`flex items-center gap-1 text-sm font-medium uppercase tracking-wide transition-colors hover:text-gold ${
                      isActivePath(link.path) ? "text-gold" : "text-foreground/80"
                    }`}
                  >
                    {link.label}
                    {link.children && <ChevronDown className="h-3 w-3" />}
                  </Link>

                  <AnimatePresence>
                    {link.children && hoverMenu === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 top-full mt-3 w-[620px] rounded-2xl border border-border bg-card p-5 shadow-2xl"
                      >
                        <div className="grid grid-cols-[1.2fr_1fr] gap-6">
                          <div>
                            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                              Shop Categories
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              {link.children.map((child) => (
                                <Link
                                  key={child.path}
                                  to={child.path}
                                  className="rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-muted hover:text-gold"
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </div>
                          </div>

                          <div className="rounded-2xl bg-muted/40 p-4">
                            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                              Featured
                            </p>
                            <div className="space-y-2">
                              {link.featured?.map((item) => (
                                <Link
                                  key={item.path}
                                  to={item.path}
                                  className="block rounded-xl border border-transparent bg-card px-4 py-3 text-sm font-medium transition-colors hover:border-border hover:text-gold"
                                >
                                  {item.label}
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            <div className="flex items-center gap-3 lg:gap-4">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 transition-colors hover:text-gold"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              <Link
                to="/wishlist"
                className="relative hidden p-2 transition-colors hover:text-gold sm:block"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full gold-gradient text-[10px] font-bold text-primary">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {user ? (
                <Link to={accountPath} className="hidden p-2 transition-colors hover:text-gold sm:block" aria-label="Account">
                  <User className="h-5 w-5" />
                </Link>
              ) : (
                <Link to="/login" className="hidden p-2 transition-colors hover:text-gold sm:block" aria-label="Login">
                  <LogIn className="h-5 w-5" />
                </Link>
              )}

              <Link
                to="/cart"
                className="relative p-2 transition-colors hover:text-gold"
                aria-label="Cart"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full gold-gradient text-[10px] font-bold text-primary">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-border"
            >
              <div className="section-padding py-4">
                <form onSubmit={handleSearchSubmit} className="relative mx-auto max-w-2xl">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for shoes, brands, styles..."
                    className="w-full rounded-full bg-muted py-3 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-gold/50"
                  />
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-border bg-card lg:hidden"
            >
              <nav className="section-padding space-y-1 py-4">
                {navLinks.map((link) => (
                  <div key={link.label}>
                    <Link
                      to={link.path}
                      className="block py-3 text-sm font-medium uppercase tracking-wide transition-colors hover:text-gold"
                    >
                      {link.label}
                    </Link>

                    {link.children && (
                      <div className="space-y-1 pl-4">
                        {link.children.map((child) => (
                          <Link
                            key={child.path}
                            to={child.path}
                            className="block py-2 text-sm text-muted-foreground transition-colors hover:text-gold"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <div className="flex gap-4 border-t border-border pt-4">
                  <Link to="/wishlist" className="flex items-center gap-2 text-sm hover:text-gold">
                    <Heart className="h-4 w-4" />
                    Wishlist
                  </Link>

                  {user ? (
                    <Link to={accountPath} className="flex items-center gap-2 text-sm hover:text-gold">
                      <User className="h-4 w-4" />
                      Account
                    </Link>
                  ) : (
                    <Link to="/login" className="flex items-center gap-2 text-sm hover:text-gold">
                      <LogIn className="h-4 w-4" />
                      Login
                    </Link>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
