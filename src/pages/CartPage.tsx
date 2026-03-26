import { Link } from "react-router-dom";
import { Minus, Plus, X, ShoppingBag, ArrowRight, Tag, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { useStore } from "@/contexts/StoreContext";
import { formatPrice } from "@/lib/currency";
import { useState } from "react";

export default function CartPage() {
  const { cart, updateCartQty, removeFromCart, cartTotal, clearCart } = useStore();
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const shipping = cartTotal > 5000 ? 0 : 60;
  const discount = couponApplied ? cartTotal * 0.2 : 0;
  const total = cartTotal - discount + shipping;

  const applyCoupon = () => {
    if (coupon.toUpperCase() === "AVENZ20") setCouponApplied(true);
  };

  if (cart.length === 0) {
    return (
      <Layout>
        <div className="section-padding py-20 text-center">
          <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-muted-foreground/30" />
          <h1 className="font-display text-3xl font-bold">Your Cart is Empty</h1>
          <p className="mt-2 text-muted-foreground">Looks like you haven't added anything yet.</p>
          <Link
            to="/shop"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-charcoal-light"
          >
            Continue Shopping <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="section-padding py-10">
        <div className="mb-8 rounded-[28px] border border-border bg-card p-6 md:p-8">
          <h1 className="font-display text-3xl font-bold md:text-4xl">Shopping Cart</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {cart.length} item{cart.length > 1 ? "s" : ""} ready for checkout
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {cart.map((item, i) => (
              <motion.div
                key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-4 rounded-2xl border border-border bg-card p-4"
              >
                <Link
                  to={`/product/${item.product.id}`}
                  className="h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-muted"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="h-full w-full object-cover"
                  />
                </Link>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        to={`/product/${item.product.id}`}
                        className="line-clamp-1 font-display text-sm font-semibold transition-colors hover:text-gold"
                      >
                        {item.product.name}
                      </Link>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Size: {item.selectedSize} · Color: {item.selectedColor}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Unit Price: {formatPrice(item.product.price)}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        removeFromCart(item.product.id, item.selectedSize, item.selectedColor)
                      }
                      className="rounded p-1 transition-colors hover:bg-muted"
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-4">
                    <div className="flex items-center overflow-hidden rounded-xl border border-border">
                      <button
                        onClick={() =>
                          updateCartQty(
                            item.product.id,
                            item.selectedSize,
                            item.selectedColor,
                            item.quantity - 1
                          )
                        }
                        className="p-2.5 transition-colors hover:bg-muted"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>

                      <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>

                      <button
                        onClick={() =>
                          updateCartQty(
                            item.product.id,
                            item.selectedSize,
                            item.selectedColor,
                            item.quantity + 1
                          )
                        }
                        className="p-2.5 transition-colors hover:bg-muted"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <span className="text-sm font-semibold">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}

            <div className="flex items-center justify-between pt-2">
              <Link
                to="/shop"
                className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-gold"
              >
                ← Continue Shopping
              </Link>
              <button onClick={clearCart} className="text-sm text-destructive hover:underline">
                Clear Cart
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {[
                { icon: Truck, title: "Fast Delivery", text: "Reliable shipping across Bangladesh" },
                { icon: RotateCcw, title: "Easy Returns", text: "7-day return and exchange support" },
                { icon: ShieldCheck, title: "Secure Checkout", text: "Protected purchase experience" },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-2xl border border-border bg-card p-4">
                  <Icon className="mb-2 h-5 w-5 text-gold" />
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="sticky top-28 h-fit rounded-[28px] border border-border bg-card p-6">
            <h3 className="font-display text-xl font-bold">Order Summary</h3>

            <div className="mb-6 mt-5 flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Coupon code"
                  className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
              <button
                onClick={applyCoupon}
                className="rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-charcoal-light"
              >
                Apply
              </button>
            </div>

            {couponApplied && (
              <p className="mb-4 text-xs text-green-600">Coupon AVENZ20 applied — 20% off!</p>
            )}

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span>{shipping === 0 ? <span className="text-green-600">Free</span> : formatPrice(shipping)}</span>
              </div>

              <div className="rounded-xl bg-primary/5 p-3 text-xs text-muted-foreground">
                Free delivery available on orders above ৳5,000 inside Dhaka.
              </div>

              <div className="flex justify-between border-t border-border pt-3 text-base font-bold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="mt-6 block w-full rounded-xl gold-gradient py-3.5 text-center text-sm font-semibold uppercase tracking-widest text-primary transition-opacity hover:opacity-90"
            >
              Proceed to Checkout
            </Link>

            <p className="mt-4 text-center text-[11px] text-muted-foreground">
              Secure checkout powered by 256-bit encryption
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
