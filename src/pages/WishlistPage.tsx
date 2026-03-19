import { Link } from 'react-router-dom';
import { Heart, ArrowRight, X } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useStore } from '@/contexts/StoreContext';
import ProductCard from '@/components/ProductCard';

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useStore();

  if (wishlist.length === 0) {
    return (
      <Layout>
        <div className="section-padding py-20 text-center">
          <Heart className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
          <h1 className="font-display text-3xl font-bold">Your Wishlist is Empty</h1>
          <p className="text-muted-foreground mt-2">Save items you love to come back to later.</p>
          <Link to="/shop" className="inline-flex items-center gap-2 mt-6 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold text-sm uppercase tracking-wide">
            Start Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="section-padding py-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold">My Wishlist</h1>
        <p className="text-muted-foreground text-sm mt-1">{wishlist.length} item{wishlist.length > 1 ? 's' : ''}</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mt-8">
          {wishlist.map((item, i) => <ProductCard key={item.product.id} product={item.product} index={i} />)}
        </div>
      </div>
    </Layout>
  );
}
