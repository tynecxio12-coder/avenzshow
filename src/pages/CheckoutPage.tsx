import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, Banknote, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatPrice } from '@/lib/currency';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

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
  const { cart, cartTotal, clearCart } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [delivery, setDelivery] = useState('dhaka');
  const [payment, setPayment] = useState('cod');
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    streetAddress: '',
    apartment: '',
    city: '',
    postalCode: '',
    country: 'Bangladesh',
  });

  const deliveryCharge = deliveryOptions.find(d => d.id === delivery)?.price || 60;
  const discount = couponApplied ? cartTotal * 0.2 : 0;
  const freeShipping = cartTotal > 5000 && delivery === 'dhaka';
  const finalDelivery = freeShipping ? 0 : deliveryCharge;
  const total = cartTotal - discount + finalDelivery;

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'AVENZ20') {
      setCouponApplied(true);
      toast.success('Coupon applied successfully');
    } else {
      toast.error('Invalid coupon code');
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login before placing an order');
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const deliveryLabel =
        deliveryOptions.find(d => d.id === delivery)?.label || 'Inside Dhaka';
      const paymentLabel =
        paymentMethods.find(p => p.id === payment)?.label || 'Cash on Delivery';

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: user.id,
            full_name: fullName,
            email: formData.email,
            phone: formData.phone,
            address: `${formData.streetAddress}, ${formData.apartment}, ${formData.city}, ${formData.postalCode}, ${formData.country}`,
            delivery_option: deliveryLabel,
            payment_method: paymentLabel,
            notes,
            subtotal: cartTotal,
            discount,
            delivery_charge: finalDelivery,
            total_amount: total,
            status: 'pending',
          },
        ])
        .select()
        .single();

      if (orderError) {
        console.error('Order insert error:', orderError);
        throw orderError;
      }

      const orderItemsPayload = cart.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        product_image: item.product.images?.[0] || null,
        size: item.selectedSize,
        quantity: item.quantity,
        unit_price: item.product.price,
        total_price: item.product.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsPayload);

      if (itemsError) {
        console.error('Order items insert error:', itemsError);
        throw itemsError;
      }

      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-confirmation/${order.id}`);
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <Layout>
        <div className="section-padding py-20 text-center">
          <h1 className="font-display text-3xl font-bold">Your cart is empty</h1>
          <Link
            to="/shop"
            className="inline-block mt-6 px-8 py-3 gold-gradient text-primary rounded-lg font-semibold text-sm uppercase tracking-widest"
          >
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
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-xl border border-border p-6"
              >
                <h2 className="font-display text-lg font-bold mb-4">
                  Billing & Shipping Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    required
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="First Name"
                    className="px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                  <input
                    required
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                    className="px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email Address"
                    className="px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                  <input
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone (+880)"
                    className="px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                  <input
                    required
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleInputChange}
                    placeholder="Street Address"
                    className="sm:col-span-2 px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                  <input
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleInputChange}
                    placeholder="Apartment, Suite (Optional)"
                    className="sm:col-span-2 px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                  <input
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City / District"
                    className="px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                  <input
                    required
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="Postal Code"
                    className="px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                  <input
                    value="Bangladesh"
                    readOnly
                    className="px-4 py-3 rounded-lg border border-border bg-muted text-sm text-muted-foreground"
                  />
                </div>
              </motion.div>

              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="font-display text-lg font-bold mb-4">Delivery Option</h2>
                <div className="space-y-3">
                  {deliveryOptions.map(opt => (
                    <label
                      key={opt.id}
                      className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                        delivery === opt.id
                          ? 'border-gold bg-gold/5'
                          : 'border-border hover:border-gold/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="delivery"
                          checked={delivery === opt.id}
                          onChange={() => setDelivery(opt.id)}
                          className="accent-[hsl(var(--gold))]"
                        />
                        <div>
                          <p className="text-sm font-semibold">{opt.label}</p>
                          <p className="text-xs text-muted-foreground">{opt.time}</p>
                        </div>
                      </div>
                      <span className="font-semibold text-sm">
                        {opt.id === 'dhaka' && cartTotal > 5000 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          formatPrice(opt.price)
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="font-display text-lg font-bold mb-4">Payment Method</h2>
                <div className="space-y-3">
                  {paymentMethods.map(({ id, label, icon: Icon }) => (
                    <label
                      key={id}
                      className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                        payment === id
                          ? 'border-gold bg-gold/5'
                          : 'border-border hover:border-gold/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={payment === id}
                        onChange={() => setPayment(id)}
                        className="accent-[hsl(var(--gold))]"
                      />
                      <Icon className="w-5 h-5 text-gold" />
                      <span className="text-sm font-medium">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="font-display text-lg font-bold mb-4">Order Notes (Optional)</h2>
                <textarea
                  name="notes"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Special instructions for delivery..."
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
                />
              </div>
            </div>

            <div className="h-fit sticky top-28">
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="font-display text-lg font-bold mb-4">Order Summary</h2>

                <div className="space-y-3 mb-4">
                  {cart.map(item => (
                    <div
                      key={`${item.product.id}-${item.selectedSize}`}
                      className="flex items-center gap-3"
                    >
                      <img
                        src={item.product.images[0]}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold line-clamp-1">
                          {item.product.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Size: {item.selectedSize} × {item.quantity}
                        </p>
                      </div>
                      <span className="text-xs font-semibold">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 mb-4">
                  <input
                    value={coupon}
                    onChange={e => setCoupon(e.target.value)}
                    placeholder="Coupon code"
                    className="flex-1 px-3 py-2 text-sm border border-border rounded-lg bg-background"
                  />
                  <button
                    type="button"
                    onClick={applyCoupon}
                    className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg"
                  >
                    Apply
                  </button>
                </div>

                {couponApplied && (
                  <p className="text-xs text-green-600 mb-3">
                    AVENZ20 applied — 20% off!
                  </p>
                )}

                <div className="space-y-2 text-sm border-t border-border pt-4">
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
                    <span>
                      {freeShipping ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        formatPrice(finalDelivery)
                      )}
                    </span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 py-3.5 gold-gradient text-primary font-semibold text-center uppercase text-sm tracking-widest rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>

                <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-muted-foreground">
                  <ShieldCheck className="w-3 h-3" />
                  Secure checkout • 256-bit encryption
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}
