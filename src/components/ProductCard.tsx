import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Star, Eye } from "lucide-react";
import { Product } from "@/types";
import { useStore } from "@/contexts/StoreContext";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/currency";

interface Props {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: Props) {
  const { toggleWishlist, isInWishlist, addToCart } = useStore();
  const inWishlist = isInWishlist(product.id);

  const mainImage = product.images?.[0] || "/placeholder.svg";
  const hoverImage = product.images?.[1] || product.images?.[0] || "/placeholder.svg";
  const defaultSize = product.sizes?.[0];
  const defaultColor = product.colors?.[0]?.name || "Default";
  const hasDiscount = !!product.oldPrice && product.oldPrice > product.price;
  const stockText =
    product.stock > 10
      ? "In Stock"
      : product.stock > 0
      ? `Only ${product.stock} left`
      : "Out of Stock";

  const handleQuickAdd = () => {
    if (!defaultSize) return;
    addToCart(product, defaultSize, defaultColor, 1);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.05, duration: 0.45 }}
      className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="absolute left-3 top-3 z-20 flex flex-col gap-2">
        {product.isNew && (
          <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-foreground">
            New
          </span>
        )}
        {product.isBestSeller && (
          <span className="rounded-full gold-gradient px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
            Best Seller
          </span>
        )}
        {hasDiscount && product.discount > 0 && (
          <span className="rounded-full bg-destructive px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-destructive-foreground">
            -{product.discount}%
          </span>
        )}
      </div>

      <button
        onClick={() => toggleWishlist(product)}
        className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-card/85 backdrop-blur-sm transition-all hover:scale-105"
        aria-label="Toggle wishlist"
      >
        <Heart
          className={`h-4 w-4 transition-colors ${
            inWishlist ? "fill-destructive text-destructive" : "text-foreground/65"
          }`}
        />
      </button>

      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-[4/4.4] overflow-hidden bg-muted">
          <img
            src={mainImage}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-0"
            loading="lazy"
          />
          <img
            src={hoverImage}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
            loading="lazy"
          />

          <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleQuickAdd();
                }}
                disabled={!defaultSize || product.stock <= 0}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-3 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-colors hover:bg-charcoal-light disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                Quick Add
              </button>

              <span className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/95 px-3 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground backdrop-blur">
                <Eye className="h-3.5 w-3.5" />
                View
              </span>
            </div>
          </div>
        </div>
      </Link>

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="mb-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              {product.brand}
            </p>
            <Link to={`/product/${product.id}`}>
              <h3 className="line-clamp-1 font-display text-base font-semibold transition-colors hover:text-gold">
                {product.name}
              </h3>
            </Link>
            <p className="mt-1 text-xs capitalize text-muted-foreground">
              {product.category}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Star className="h-3.5 w-3.5 fill-gold text-gold" />
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-xs text-muted-foreground">
            ({product.reviewsCount} reviews)
          </span>
        </div>

        <div className="flex items-end gap-2">
          <span className="text-lg font-bold">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-1.5">
            {product.colors.slice(0, 4).map((c) => (
              <span
                key={`${product.id}-${c.name}-${c.hex}`}
                className="h-4 w-4 rounded-full border border-border"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>

          <span
            className={`text-[11px] font-medium ${
              product.stock > 10
                ? "text-green-600"
                : product.stock > 0
                ? "text-amber-600"
                : "text-destructive"
            }`}
          >
            {stockText}
          </span>
        </div>
      </div>
    </motion.article>
  );
}
