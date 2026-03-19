import { Link } from 'react-router-dom';
import { Minus, Plus, X, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { useStore } from '@/contexts/StoreContext';
import { formatPrice } from '@/lib/currency';
import { useState } from 'react';

export default function CartPage() {
  const { cart, updateCartQty, removeFromCart, cartTotal, clearCart } = useStore();
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  const shipping = cartTotal > 5000 ? 0 : 60;
  const discount = couponApplied ? cartTotal * 0.2 : 0;
  const total = cartTotal - discount + shipping;

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'AVENZ20') setCouponApplied(true);
  };

  if (cart.length === 0) {
    return (
      <Layout>
        <div className="section-padding py-20 text-center">
          <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
          <h1 className="font-display text-3xl font-bold">Your Cart is Empty</h1>
          <p className="text-muted-foreground mt-2">Looks like you haven't added anything yet.</p>
          <Link to="/shop" className="inline-flex items-center gap-2 mt-6 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold text-sm uppercase tracking-wide hover:bg-charcoal-light transition-colors">
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="section-padding py-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold">Shopping Cart</h1>
        <p className="text-muted-foreground text-sm mt-1">{cart.length} item{cart.length > 1 ? 's' : ''}</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, i) => (
              <motion.div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="flex gap-4 p-4 bg-card rounded-xl border border-border">
                <Link to={`/product/${item.product.id}`} className="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-muted">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link to={`/product/${item.product.id}`} className="font-display font-semibold text-sm hover:text-gold transition-colors line-clamp-1">{item.product.name}</Link>
                      <p className="text-xs text-muted-foreground mt-0.5">Size: {item.selectedSize} · Color: {item.selectedColor}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)} className="p-1 hover:bg-muted rounded">
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-border rounded-lg">
                      <button onClick={() => updateCartQty(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1)} className="p-2 hover:bg-muted"><Minus className="w-3 h-3" /></button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateCartQty(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1)} className="p-2 hover:bg-muted"><Plus className="w-3 h-3" /></button>
                    </div>
                    <span className="font-semibold">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
            <div className="flex items-center justify-between pt-4">
              <Link to="/shop" className="text-sm font-medium hover:text-gold transition-colors flex items-center gap-1">← Continue Shopping</Link>
              <button onClick={clearCart} className="text-sm text-destructive hover:underline">Clear Cart</button>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 h-fit sticky top-28">
            <h3 className="font-display text-lg font-bold mb-4">Order Summary</h3>
            <div className="flex gap-2 mb-6">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Coupon code" className="w-full pl-9 pr-3 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-gold/50" />
              </div>
              <button onClick={applyCoupon} className="px-4 py-2.5 bg-primary text-primary-foreground text-xs font-semibold rounded-lg uppercase tracking-wide hover:bg-charcoal-light transition-colors">Apply</button>
            </div>
            {couponApplied && <p className="text-xs text-green-600 mb-4">Coupon AVENZ20 applied — 20% off!</p>}

            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(cartTotal)}</span></div>
              {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(discount)}</span></div>}
              <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{shipping === 0 ? <span className="text-green-600">Free</span> : formatPrice(shipping)}</span></div>
              <div className="border-t border-border pt-3 flex justify-between font-bold text-base">
                <span>Total</span><span>{formatPrice(total)}</span>
              </div>
            </div>

            <Link to="/checkout" className="block mt-6 w-full py-3.5 gold-gradient text-primary font-semibold text-center uppercase text-sm tracking-widest rounded-lg hover:opacity-90 transition-opacity">
              Proceed to Checkout
            </Link>
            <p className="text-[10px] text-muted-foreground text-center mt-4">Secure checkout powered by 256-bit encryption</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
