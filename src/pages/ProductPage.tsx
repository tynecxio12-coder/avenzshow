import { useState, useEffect, useMemo } from "react";
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
  Ruler,
  CheckCircle2,
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
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      setLoading(true);
      setErrorMessage("");

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

  const inWishlist = product ? isInWishlist(product.id) : false;
  const productReviews = useMemo(
    () => reviews.filter((r) => r.productId === product?.id),
    [product]
  );

  const mainImage = product?.images?.[selectedImage] || "/placeholder.svg";
  const stockText =
    !product
      ? ""
      : product.stock > 10
      ? "In Stock"
      : product.stock > 0
      ? `Only ${product.stock} left in stock`
      : "Out of Stock";

  const canAddToCart = !!product && !!selectedSize && product.stock > 0;

  const handleAddToCart = () => {
    if (!product || !selectedSize) return;
    addToCart(product, selectedSize, selectedColor, qty);
  };

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
          <p className="mt-3 text-sm text-muted-foreground">
            {errorMessage || "We could not find this product."}
          </p>
          <Link to="/shop" className="mt-4 inline-block text-gold hover:underline">
            Back to Shop
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="section-padding py-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/shop" className="hover:text-foreground">
            Shop
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="line-clamp-1 text-foreground">{product.name}</span>
        </div>
      </div>

      <div className="section-padding pb-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="overflow-hidden rounded-[28px] border border-border bg-muted">
              <img
                src={mainImage}
                alt={product.name}
                className="aspect-square w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>

            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`h-24 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${
                    i === selectedImage ? "border-gold" : "border-border hover:border-gold/40"
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
          >
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              {product.brand}
            </p>

            <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="font-display text-3xl font-bold md:text-4xl">{product.name}</h1>

                <div className="mt-3 flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
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
              </div>

              <button
                onClick={() => toggleWishlist(product)}
                className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors ${
                  inWishlist
                    ? "border-destructive bg-destructive/10"
                    : "border-border hover:border-gold"
                }`}
              >
                <Heart
                  className={`h-5 w-5 ${
                    inWishlist ? "fill-destructive text-destructive" : ""
                  }`}
                />
              </button>
            </div>

            <div className="mt-5 flex items-end gap-3">
              <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
              {product.oldPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
              {product.discount > 0 && (
                <span className="rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-semibold text-destructive">
                  Save {product.discount}%
                </span>
              )}
            </div>

            <p className="mt-5 text-sm leading-7 text-muted-foreground">{product.description}</p>

            <div className="mt-7 rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold">
                  Color: <span className="font-normal text-muted-foreground">{selectedColor}</span>
                </p>
              </div>

              <div className="mt-3 flex gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`h-11 w-11 rounded-full border-2 transition-all ${
                      selectedColor === c.name ? "scale-110 border-gold" : "border-border"
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-border bg-card p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold">Select Size</p>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(true)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-gold hover:underline"
                >
                  <Ruler className="h-3.5 w-3.5" />
                  Size Guide
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`flex h-12 w-12 items-center justify-center rounded-xl border text-sm font-medium transition-all ${
                      selectedSize === s
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-gold"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {!selectedSize && (
                <p className="mt-2 text-xs text-destructive">Please select a size to continue.</p>
              )}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <div className="flex items-center overflow-hidden rounded-xl border border-border">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="p-3 transition-colors hover:bg-muted"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center text-sm font-semibold">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="p-3 transition-colors hover:bg-muted"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!canAddToCart}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:bg-charcoal-light disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingBag className="h-4 w-4" />
                Add to Cart
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    product.stock > 10
                      ? "bg-green-500"
                      : product.stock > 0
                      ? "bg-amber-500"
                      : "bg-destructive"
                  }`}
                />
                <span className="text-sm text-muted-foreground">{stockText}</span>
              </div>
              <span className="text-xs text-muted-foreground">SKU: {product.sku}</span>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { icon: Truck, title: "Fast Delivery", text: "1–3 business days" },
                { icon: RotateCcw, title: "Easy Exchange", text: "7-day return support" },
                { icon: Shield, title: "Secure Checkout", text: "Trusted payment flow" },
              ].map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-border bg-card p-4 text-center"
                >
                  <Icon className="mx-auto mb-2 h-5 w-5 text-gold" />
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Why customers love this product</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Premium comfort, durable materials, clean finish, and everyday wearability.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-16">
          <div className="flex gap-8 border-b border-border">
            {(["description", "reviews", "shipping"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative pb-4 text-sm font-semibold uppercase tracking-[0.18em] transition-colors ${
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
                <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                  {product.description}
                </p>
                <ul className="mt-5 space-y-2">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="max-w-2xl space-y-4">
                {productReviews.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No reviews yet. Be the first to review this product.
                  </p>
                ) : (
                  productReviews.map((r) => (
                    <div key={r.id} className="rounded-2xl bg-secondary p-5">
                      <div className="mb-2 flex items-center gap-2">
                        <div className="flex">
                          {Array.from({ length: r.rating }).map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
                          ))}
                        </div>
                        <span className="text-xs font-semibold">{r.userName}</span>
                        {r.verified && (
                          <span className="text-[10px] font-medium text-gold">✓ Verified</span>
                        )}
                      </div>
                      <p className="text-sm leading-7 text-muted-foreground">{r.comment}</p>
                      <p className="mt-2 text-xs text-muted-foreground/70">{r.date}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="max-w-2xl space-y-3 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">Inside Dhaka:</strong> ৳60 delivery charge.
                  1–2 business days.
                </p>
                <p>
                  <strong className="text-foreground">Outside Dhaka:</strong> ৳120 delivery charge.
                  3–5 business days.
                </p>
                <p>
                  <strong className="text-foreground">Free Delivery:</strong> On orders over ৳5,000
                  inside Dhaka.
                </p>
                <p>
                  <strong className="text-foreground">Returns:</strong> Easy return/exchange within
                  7 days if unused and in original packaging.
                </p>
              </div>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-8 font-display text-2xl font-bold">You May Also Like</h2>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>

      {sizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[28px] border border-border bg-card p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-display text-2xl font-bold">Size Guide</h3>
              <button
                onClick={() => setSizeGuideOpen(false)}
                className="rounded-full border border-border px-3 py-1 text-sm"
              >
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
                  {[
                    ["39", "5.5", "6.5", "24.5 cm"],
                    ["40", "6.5", "7.5", "25 cm"],
                    ["41", "7", "8", "25.5 cm"],
                    ["42", "8", "9", "26 cm"],
                    ["43", "9", "10", "26.5 cm"],
                    ["44", "9.5", "10.5", "27 cm"],
                  ].map((row) => (
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
      )}
    </Layout>
  );
}
