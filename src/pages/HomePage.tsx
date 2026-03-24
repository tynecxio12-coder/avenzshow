import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Truck,
  Shield,
  RotateCcw,
  Headphones,
  Star,
  ChevronRight,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/ProductCard";
import heroBanner from "@/assets/hero-banner.jpg";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Product, mapSupabaseProduct } from "@/data/products";

const categories = [
  { name: "Sneakers", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400", path: "/shop?category=sneakers" },
  { name: "Formal", image: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400", path: "/shop?category=formal" },
  { name: "Boots", image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400", path: "/shop?category=boots" },
  { name: "Sports", image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=400", path: "/shop?category=sports" },
  { name: "Casual", image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400", path: "/shop?category=casual" },
  { name: "Sandals", image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400", path: "/shop?category=sandals" },
];

const testimonials = [
  { name: "Nadia A.", text: "The quality is unmatched. My AvenzShoe sneakers are the most comfortable shoes I own. Amazing craftsmanship!", rating: 5, role: "Verified Buyer, Dhaka" },
  { name: "Rafiq H.", text: "Ordered the Oxford Classics for an event — they were absolutely perfect. Premium materials and flawless finish.", rating: 5, role: "Verified Buyer, Chittagong" },
  { name: "Fatema R.", text: "Fast delivery, beautiful packaging, and the shoes exceeded my expectations. AvenzShoe is now my go-to brand.", rating: 5, role: "Verified Buyer, Dhaka" },
];

const trustBadges = [
  { icon: Truck, title: "Fast Delivery", desc: "Across Bangladesh" },
  { icon: Shield, title: "Secure Payment", desc: "bKash, Card, COD" },
  { icon: RotateCcw, title: "Easy Returns", desc: "7-day return policy" },
  { icon: Headphones, title: "Support", desc: "10AM–8PM daily" },
];

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [trending, setTrending] = useState<Product[]>([]);

  useEffect(() => {
    const fetchHomeProducts = async () => {
      const [newRes, bestRes, trendRes] = await Promise.all([
        supabase.from("products").select("*").eq("new_arrival", true).limit(4),
        supabase.from("products").select("*").eq("best_seller", true).limit(4),
        supabase.from("products").select("*").eq("featured", true).limit(4),
      ]);

      if (!newRes.error) {
        setNewArrivals((newRes.data || []).map(mapSupabaseProduct));
      }

      if (!bestRes.error) {
        setBestSellers((bestRes.data || []).map(mapSupabaseProduct));
      }

      if (!trendRes.error) {
        setTrending((trendRes.data || []).map(mapSupabaseProduct));
      }
    };

    fetchHomeProducts();
  }, []);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Subscribed successfully!");
      setEmail("");
    }
  };

  return (
    <Layout>
      <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBanner} alt="AvenzShoe Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/60 to-transparent" />
        </div>
        <div className="relative h-full section-padding flex items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <span className="text-gold text-sm uppercase tracking-[0.3em] font-semibold">
              New Collection 2025
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-primary-foreground mt-4 leading-[1.1]">
              Step Into <span className="text-gold-gradient">Elegance</span>
            </h1>
            <p className="text-primary-foreground/70 mt-6 text-lg leading-relaxed max-w-md">
              Discover premium footwear crafted for those who demand excellence. Every step tells a story of luxury.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                to="/shop"
                className="px-8 py-3.5 gold-gradient text-primary font-semibold uppercase text-sm tracking-widest rounded-lg hover:opacity-90 transition-opacity"
              >
                Shop Now
              </Link>
              <Link
                to="/shop?filter=new"
                className="px-8 py-3.5 border-2 border-primary-foreground/30 text-primary-foreground font-semibold uppercase text-sm tracking-widest rounded-lg hover:bg-primary-foreground/10 transition-colors"
              >
                New Arrivals
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding py-10 border-b border-border">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {trustBadges.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-gold" />
              </div>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-padding py-16">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold">Shop by Category</h2>
          <p className="text-muted-foreground mt-2">Find the perfect pair for every occasion</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link to={cat.path} className="group block relative aspect-[3/4] rounded-xl overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-display text-lg font-semibold text-primary-foreground">{cat.name}</h3>
                  <span className="text-xs text-primary-foreground/60 flex items-center gap-1 mt-1">
                    Explore <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section-padding py-16 bg-secondary/50">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold">Trending Now</h2>
            <p className="text-muted-foreground mt-2">What everyone is talking about</p>
          </div>
          <Link
            to="/shop?filter=trending"
            className="hidden sm:flex items-center gap-2 text-sm font-semibold uppercase tracking-wide hover:text-gold transition-colors"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {trending.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      <section className="section-padding py-16">
        <div className="relative rounded-2xl overflow-hidden bg-primary">
          <div className="absolute inset-0 opacity-20">
            <img
              src="https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1200"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative px-8 py-16 md:py-20 text-center">
            <span className="text-gold text-sm uppercase tracking-[0.3em] font-semibold">
              Limited Time Only
            </span>
            <h2 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground mt-4">
              Up to <span className="text-gold-gradient">50% Off</span>
            </h2>
            <p className="text-primary-foreground/60 mt-4 max-w-lg mx-auto">
              Don't miss our biggest sale of the season. Premium styles at unbeatable prices.
            </p>
            <Link
              to="/shop?filter=sale"
              className="inline-block mt-8 px-10 py-4 gold-gradient text-primary font-semibold uppercase text-sm tracking-widest rounded-lg hover:opacity-90 transition-opacity"
            >
              Shop the Sale
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold">New Arrivals</h2>
            <p className="text-muted-foreground mt-2">Fresh styles just dropped</p>
          </div>
          <Link
            to="/shop?filter=new"
            className="hidden sm:flex items-center gap-2 text-sm font-semibold uppercase tracking-wide hover:text-gold transition-colors"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {newArrivals.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      <section className="section-padding py-16 bg-secondary/50">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold">Best Sellers</h2>
            <p className="text-muted-foreground mt-2">Our most loved styles</p>
          </div>
          <Link
            to="/shop?filter=bestseller"
            className="hidden sm:flex items-center gap-2 text-sm font-semibold uppercase tracking-wide hover:text-gold transition-colors"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {bestSellers.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      <section className="section-padding py-16">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold">What Our Customers Say</h2>
          <p className="text-muted-foreground mt-2">Real reviews from real people</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl p-6 border border-border hover-lift"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-foreground/80 italic">"{t.text}"</p>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="font-semibold text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section-padding py-16 bg-primary">
        <div className="text-center max-w-lg mx-auto">
          <h2 className="font-display text-3xl font-bold text-primary-foreground">Stay in the Loop</h2>
          <p className="text-primary-foreground/60 mt-3 text-sm">
            Subscribe for exclusive drops, special offers, and style inspiration.
          </p>
          <form onSubmit={handleNewsletter} className="flex mt-6 gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="flex-1 px-4 py-3 rounded-lg bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/40 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
            <button
              type="submit"
              className="px-6 py-3 gold-gradient text-primary font-semibold text-sm rounded-lg uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
}
