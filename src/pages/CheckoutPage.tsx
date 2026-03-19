import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, Banknote, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { useStore } from '@/contexts/StoreContext';
import { formatPrice } from '@/lib/currency';
import { toast } from 'sonner';

const deliveryOptions = [
  { id: 'dhaka', label: 'Inside Dhaka', price: 60, time: '1-2 business days' },
  { id: 'outside', label: 'Outside Dhaka', price: 120, time: '3-5 business days' },
];

const paymentMethods = [
  { id: 'cod', label: 'Cash on Delivery', icon: Banknote },
  { id: 'bkash', label: 'bKash', icon: Smartphone },
  { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
];

export default function CheckoutPage() {
  const { cart, cartTotal, placeOrder } = useStore();
  const navigate = useNavigate();
  const [delivery, setDelivery] = useState('dhaka');
  const [payment, setPayment] = useState('cod');
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [notes, setNotes] = useState('');

  const deliveryCharge = deliveryOptions.find(d => d.id === delivery)?.price || 60;
  const discount = couponApplied ? cartTotal * 0.2 : 0;
  const freeShipping = cartTotal > 5000 && delivery === 'dhaka';
  const finalDelivery = freeShipping ? 0 : deliveryCharge;
  const total = cartTotal - discount + finalDelivery;

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'AVENZ20') setCouponApplied(true);
    else toast.error('Invalid coupon code');
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const orderId = placeOrder(
      deliveryOptions.find(d => d.id === delivery)?.label || 'Inside Dhaka',
      paymentMethods.find(p => p.id === payment)?.label || 'COD',
      total,
    );
    toast.success('Order placed successfully!');
    navigate(`/order-confirmation/${orderId}`);
  };

  if (cart.length === 0) {
    return (
      <Layout>
        <div className="section-padding py-20 text-center">
          <h1 className="font-display text-3xl font-bold">Your cart is empty</h1>
          <Link to="/shop" className="inline-block mt-6 px-8 py-3 gold-gradient text-primary rounded-lg font-semibold text-sm uppercase tracking-widest">
            Continue Shopping
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="section-padding py-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold">Checkout</h1>
        <p className="text-muted-foreground text-sm mt-1">Complete your order</p>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-8">
            <div className="lg:col-span-2 space-y-8">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border p-6">
                <h2 className="font-display text-lg font-bold mb-4">Billing & Shipping Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input required placeholder="First Name" className="px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
                  <input required placeholder="Last Name" className="px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
                  <input required type="email" placeholder="Email Address" className="px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
                  <input required placeholder="Phone (+880)" className="px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
                  <input required placeholder="Street Address" className="sm:col-span-2 px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
                  <input placeholder="Apartment, Suite (Optional)" className="sm:col-span-2 px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
                  <input required placeholder="City / District" className="px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
                  <input required placeholder="Postal Code" className="px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
                  <input value="Bangladesh" readOnly className="px-4 py-3 rounded-lg border border-border bg-muted text-sm text-muted-foreground" />
                </div>
              </motion.div>

              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="font-display text-lg font-bold mb-4">Delivery Option</h2>
                <div className="space-y-3">
                  {deliveryOptions.map(opt => (
                    <label key={opt.id} className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${delivery === opt.id ? 'border-gold bg-gold/5' : 'border-border hover:border-gold/50'}`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="delivery" checked={delivery === opt.id} onChange={() => setDelivery(opt.id)} className="accent-[hsl(var(--gold))]" />
                        <div>
                          <p className="text-sm font-semibold">{opt.label}</p>
                          <p className="text-xs text-muted-foreground">{opt.time}</p>
                        </div>
                      </div>
                      <span className="font-semibold text-sm">
                        {opt.id === 'dhaka' && cartTotal > 5000 ? <span className="text-green-600">Free</span> : formatPrice(opt.price)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="font-display text-lg font-bold mb-4">Payment Method</h2>
                <div className="space-y-3">
                  {paymentMethods.map(({ id, label, icon: Icon }) => (
                    <label key={id} className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${payment === id ? 'border-gold bg-gold/5' : 'border-border hover:border-gold/50'}`}>
                      <input type="radio" name="payment" checked={payment === id} onChange={() => setPayment(id)} className="accent-[hsl(var(--gold))]" />
                      <Icon className="w-5 h-5 text-gold" />
                      <span className="text-sm font-medium">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="font-display text-lg font-bold mb-4">Order Notes (Optional)</h2>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Special instructions for delivery..." className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none" />
              </div>
            </div>

            <div className="h-fit sticky top-28">
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="font-display text-lg font-bold mb-4">Order Summary</h2>
                <div className="space-y-3 mb-4">
                  {cart.map(item => (
                    <div key={`${item.product.id}-${item.selectedSize}`} className="flex items-center gap-3">
                      <img src={item.product.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold line-clamp-1">{item.product.name}</p>
                        <p className="text-[10px] text-muted-foreground">Size: {item.selectedSize} × {item.quantity}</p>
                      </div>
                      <span className="text-xs font-semibold">{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 mb-4">
                  <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Coupon code" className="flex-1 px-3 py-2 text-sm border border-border rounded-lg bg-background" />
                  <button type="button" onClick={applyCoupon} className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg">Apply</button>
                </div>
                {couponApplied && <p className="text-xs text-green-600 mb-3">AVENZ20 applied — 20% off!</p>}

                <div className="space-y-2 text-sm border-t border-border pt-4">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(cartTotal)}</span></div>
                  {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(discount)}</span></div>}
                  <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{freeShipping ? <span className="text-green-600">Free</span> : formatPrice(finalDelivery)}</span></div>
                  <div className="border-t border-border pt-3 flex justify-between font-bold text-base">
                    <span>Total</span><span>{formatPrice(total)}</span>
                  </div>
                </div>

                <button type="submit" className="w-full mt-6 py-3.5 gold-gradient text-primary font-semibold text-center uppercase text-sm tracking-widest rounded-lg hover:opacity-90 transition-opacity">
                  Place Order
                </button>

                <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-muted-foreground">
                  <ShieldCheck className="w-3 h-3" /> Secure checkout • 256-bit encryption
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}
