import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Heart,
  ShoppingBag,
  Star,
  Truck,
  RotateCcw,
  Shield,
  Minus,
  Plus,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/ProductCard";
import { reviews, Product, mapSupabaseProduct } from "@/data/products";
import { useStore } from "@/contexts/StoreContext";
import { formatPrice } from "@/lib/currency";
import { supabase } from "@/lib/supabase";

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart, toggleWishlist, isInWishlist, addToRecentlyViewed } = useStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "reviews" | "shipping">("description");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .or(`id.eq.${id},slug.eq.${id}`)
        .limit(1);

      if (error || !data || data.length === 0) {
        setErrorMessage(error?.message || "Product not found");
        setLoading(false);
        return;
      }

      const mappedProduct = mapSupabaseProduct(data[0]);
      setProduct(mappedProduct);
      setSelectedColor(mappedProduct.colors[0]?.name || "");
      setSelectedSize(null);
      setSelectedImage(0);
      setQty(1);
      addToRecentlyViewed(mappedProduct);
      window.scrollTo(0, 0);

      const relatedRes = await supabase
        .from("products")
        .select("*")
        .neq("id", mappedProduct.id)
        .limit(4);

      if (!relatedRes.error) {
        setRelated((relatedRes.data || []).map(mapSupabaseProduct));
      }

      setLoading(false);
    };

    fetchProduct();
  }, [id, addToRecentlyViewed]);

  if (loading) {
    return (
      <Layout>
        <div className="section-padding py-20 text-center">
          <h1 className="font-display text-3xl font-bold">Loading Product...</h1>
        </div>
      </Layout>
    );
  }

  if (errorMessage || !product) {
    return (
      <Layout>
        <div className="section-padding py-20 text-center">
          <h1 className="font-display text-3xl font-bold">Product Not Found</h1>
          <p className="text-sm text-muted-foreground mt-3">
            {errorMessage || "We could not find this product."}
          </p>
          <Link to="/shop" className="mt-4 inline-block text-gold hover:underline">
            Back to Shop
          </Link>
        </div>
      </Layout>
    );
  }

  const productReviews = reviews.filter((r) => r.productId === product.id);
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart(product, selectedSize, selectedColor, qty);
  };

  return (
    <Layout>
      <div className="section-padding py-4 text-xs text-muted-foreground flex items-center gap-2">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/shop" className="hover:text-foreground">Shop</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="section-padding pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="aspect-square rounded-2xl overflow-hidden bg-muted mb-4">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-colors ${
                    i === selectedImage
                      ? "border-gold"
                      : "border-border hover:border-gold/50"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {product.brand}
            </p>

            <h1 className="font-display text-3xl md:text-4xl font-bold mt-2">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? "fill-gold text-gold"
                        : "text-border"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-muted-foreground">
                ({product.reviewsCount} reviews)
              </span>
            </div>

            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
              {product.oldPrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.oldPrice)}
                  </span>
                  {product.discount > 0 && (
                    <span className="px-2 py-0.5 text-xs font-semibold bg-destructive/10 text-destructive rounded">
                      -{product.discount}%
                    </span>
                  )}
                </>
              )}
            </div>

            <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
              {product.description}
            </p>

            <div className="mt-6">
              <p className="text-sm font-semibold mb-2">
                Color: <span className="font-normal text-muted-foreground">{selectedColor}</span>
              </p>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor === c.name ? "border-gold scale-110" : "border-border"
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold">Size</p>
                <button className="text-xs text-gold hover:underline">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`w-12 h-12 rounded-lg border text-sm font-medium transition-all ${
                      selectedSize === s
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:border-gold"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {!selectedSize && (
                <p className="text-xs text-destructive mt-1">Please select a size</p>
              )}
            </div>

            <div className="flex items-center gap-4 mt-8">
              <div className="flex items-center border border-border rounded-lg">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="p-3 hover:bg-muted transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm font-semibold">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="p-3 hover:bg-muted transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className="flex-1 py-3.5 bg-primary text-primary-foreground font-semibold uppercase text-sm tracking-widest rounded-lg hover:bg-charcoal-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3.5 rounded-lg border transition-colors ${
                  inWishlist
                    ? "border-destructive bg-destructive/10"
                    : "border-border hover:border-gold"
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${
                    inWishlist ? "fill-destructive text-destructive" : ""
                  }`}
                />
              </button>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  product.stock > 10
                    ? "bg-green-500"
                    : product.stock > 0
                    ? "bg-yellow-500"
                    : "bg-destructive"
                }`}
              />
              <span className="text-xs text-muted-foreground">
                {product.stock > 10
                  ? "In Stock"
                  : product.stock > 0
                  ? `Only ${product.stock} left`
                  : "Out of Stock"}
              </span>
              <span className="text-xs text-muted-foreground ml-auto">
                SKU: {product.sku}
              </span>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { icon: Truck, text: "Fast Delivery" },
                { icon: RotateCcw, text: "7-Day Returns" },
                { icon: Shield, text: "Secure Payment" },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex flex-col items-center gap-1 p-3 rounded-lg bg-secondary text-center"
                >
                  <Icon className="w-4 h-4 text-gold" />
                  <span className="text-[10px] font-medium">{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mt-16">
          <div className="flex gap-8 border-b border-border">
            {(["description", "reviews", "shipping"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-semibold uppercase tracking-wide transition-colors relative ${
                  activeTab === tab
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === "reviews" ? `Reviews (${productReviews.length})` : tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
                )}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === "description" && (
              <div>
                <p className="text-sm leading-relaxed text-muted-foreground max-w-2xl">
                  {product.description}
                </p>
                <ul className="mt-4 space-y-2">
                  {product.features.map((f) => (
                    <li
                      key={f}
                      className="text-sm text-muted-foreground flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gold" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-4 max-w-2xl">
                {productReviews.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No reviews yet. Be the first to review this product!
                  </p>
                ) : (
                  productReviews.map((r) => (
                    <div key={r.id} className="p-4 rounded-lg bg-secondary">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {Array.from({ length: r.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-gold text-gold" />
                          ))}
                        </div>
                        <span className="text-xs font-semibold">{r.userName}</span>
                        {r.verified && (
                          <span className="text-[10px] text-gold font-medium">
                            ✓ Verified
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{r.comment}</p>
                      <p className="text-xs text-muted-foreground/60 mt-2">{r.date}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="text-sm text-muted-foreground space-y-3 max-w-2xl">
                <p><strong className="text-foreground">Inside Dhaka</strong>: ৳60 delivery charge. 1-2 business days.</p>
                <p><strong className="text-foreground">Outside Dhaka</strong>: ৳120 delivery charge. 3-5 business days.</p>
                <p><strong className="text-foreground">Free Delivery</strong> on orders over ৳5,000 (Inside Dhaka).</p>
                <p><strong className="text-foreground">Returns</strong>: Free returns within 7 days of delivery. Items must be unworn with original packaging.</p>
              </div>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-bold mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
