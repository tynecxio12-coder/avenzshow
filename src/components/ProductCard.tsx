import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Product } from '@/types';
import { useStore } from '@/contexts/StoreContext';
import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/currency';

interface Props {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: Props) {
  const { toggleWishlist, isInWishlist, addToCart } = useStore();
  const inWishlist = isInWishlist(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group relative bg-card rounded-xl overflow-hidden hover-lift border border-border/50"
    >
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {product.isNew && <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-primary text-primary-foreground rounded">New</span>}
        {product.discount && <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-destructive text-destructive-foreground rounded">-{product.discount}%</span>}
        {product.isBestSeller && <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold gold-gradient text-primary rounded">Best Seller</span>}
      </div>

      <button onClick={() => toggleWishlist(product)} className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors" aria-label="Toggle wishlist">
        <Heart className={`w-4 h-4 transition-colors ${inWishlist ? 'fill-destructive text-destructive' : 'text-foreground/60'}`} />
      </button>

      <Link to={`/product/${product.id}`} className="block aspect-square overflow-hidden bg-muted">
        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
      </Link>

      <div className="absolute bottom-[calc(theme(spacing.24)+4px)] left-0 right-0 px-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
        <button onClick={() => addToCart(product, product.sizes[0], product.colors[0].name)}
          className="w-full py-2.5 bg-primary text-primary-foreground text-xs uppercase tracking-widest font-semibold rounded-lg hover:bg-charcoal-light transition-colors flex items-center justify-center gap-2">
          <ShoppingBag className="w-3.5 h-3.5" /> Quick Add
        </button>
      </div>

      <div className="p-4">
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1">{product.brand}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-display text-sm font-semibold leading-tight hover:text-gold transition-colors line-clamp-1">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-1 mt-1.5">
          <Star className="w-3 h-3 fill-gold text-gold" />
          <span className="text-xs font-medium">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviewsCount})</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="font-semibold text-sm">{formatPrice(product.price)}</span>
          {product.oldPrice && <span className="text-xs text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>}
        </div>
        <div className="flex gap-1 mt-2">
          {product.colors.map(c => (
            <span key={c.hex} className="w-3.5 h-3.5 rounded-full border border-border" style={{ backgroundColor: c.hex }} title={c.name} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
