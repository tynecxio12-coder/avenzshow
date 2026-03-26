import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, CreditCard, Banknote, Smartphone, Truck, CheckCircle2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useStore } from "@/contexts/StoreContext";
import { useAuth } from "@/contexts/AuthContext";
import { formatPrice } from "@/lib/currency";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const deliveryOptions = [
  { id: "dhaka", label: "Inside Dhaka", price: 60, time: "1-2 business days" },
  { id: "outside", label: "Outside Dhaka", price: 120, time: "3-5 business days" },
];

const paymentMethods = [
  { id: "cod", label: "Cash on Delivery", icon: Banknote },
  { id: "bkash", label: "bKash", icon: Smartphone },
  { id: "card", label: "Credit/Debit Card", icon: CreditCard },
];

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [delivery, setDelivery] = useState("dhaka");
  const [payment, setPayment] = useState("cod");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    streetAddress: "",
    apartment: "",
    city: "",
    postalCode: "",
    country: "Bangladesh",
  });

  const deliveryCharge = deliveryOptions.find((d) => d.id === delivery)?.price || 60;
  const discount = couponApplied ? cartTotal * 0.2 : 0;
  const freeShipping = cartTotal > 5000 && delivery === "dhaka";
  const finalDelivery = freeShipping ? 0 : deliveryCharge;
  const total = cartTotal - discount + finalDelivery;

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === "AVENZ20") {
      setCouponApplied(true);
      toast.success("Coupon applied successfully");
    } else {
      toast.error("Invalid coupon code");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "notes") {
      setNotes(value);
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!formData.firstName.trim()) return "First name is required";
    if (!formData.lastName.trim()) return "Last name is required";
    if (!formData.email.trim()) return "Email is required";
    if (!formData.phone.trim()) return "Phone number is required";
    if (!formData.streetAddress.trim()) return "Street address is required";
    if (!formData.city.trim()) return "City is required";
    return null;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login before placing an order");
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const validationError = validate();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setLoading(true);

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const deliveryLabel =
        deliveryOptions.find((d) => d.id === delivery)?.label || "Inside Dhaka";
      const paymentLabel =
        paymentMethods.find((p) => p.id === payment)?.label || "Cash on Delivery";

      const paymentStatus = payment === "cod" ? "unpaid" : "pending_verification";

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            user_id: user.id,
            full_name: fullName,
            email: formData.email,
            phone: formData.phone,
            address: [
              formData.streetAddress,
              formData.apartment,
              formData.city,
              formData.postalCode,
              formData.country,
            ]
              .filter(Boolean)
              .join(", "),
            delivery_option: deliveryLabel,
            payment_method: paymentLabel,
            payment_status: paymentStatus,
            notes,
            subtotal: cartTotal,
            discount,
            delivery_charge: finalDelivery,
            total_amount: total,
            status: "pending",
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItemsPayload = cart.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        product_image: item.product.images?.[0] || null,
        size: item.selectedSize || null,
        quantity: item.quantity,
        unit_price: item.product.price,
        total_price: item.product.price * item.quantity,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItemsPayload);
      if (itemsError) throw itemsError;

      const { error: trackingError } = await supabase.from("order_tracking_history").insert([
        {
          order_id: order.id,
          status: "pending",
          title: "Order placed",
          description: "Your order has been placed successfully.",
          location: "AvenzShoe Store",
          updated_by: user.id,
        },
      ]);

      if (trackingError) throw trackingError;

      clearCart();
      toast.success("Order placed successfully!");
      navigate(`/order-confirmation/${order.id}`);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <Layout>
        <div className="container py-24 text-center">
          <h1 className="mb-4 text-3xl font-bold">Your cart is empty</h1>
          <Link
            to="/shop"
            className="inline-flex rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground"
          >
            Continue Shopping
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-10">
        <div className="mb-8 rounded-[28px] border border-border bg-card p-6 md:p-8">
          <h1 className="text-4xl font-bold">Checkout</h1>
          <p className="mt-2 text-muted-foreground">Complete your order securely</p>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="rounded-[28px] border bg-card p-6">
              <h2 className="mb-5 text-xl font-bold">Billing & Shipping Details</h2>

              <div className="grid gap-4 md:grid-cols-2">
                <input name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First name" className="rounded-xl border bg-background px-4 py-3" />
                <input name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last name" className="rounded-xl border bg-background px-4 py-3" />
                <input name="email" value={formData.email} onChange={handleInputChange} placeholder="Email address" className="rounded-xl border bg-background px-4 py-3 md:col-span-2" />
                <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone number" className="rounded-xl border bg-background px-4 py-3 md:col-span-2" />
                <input name="streetAddress" value={formData.streetAddress} onChange={handleInputChange} placeholder="Street address" className="rounded-xl border bg-background px-4 py-3 md:col-span-2" />
                <input name="apartment" value={formData.apartment} onChange={handleInputChange} placeholder="Apartment, suite, etc. (optional)" className="rounded-xl border bg-background px-4 py-3 md:col-span-2" />
                <input name="city" value={formData.city} onChange={handleInputChange} placeholder="City" className="rounded-xl border bg-background px-4 py-3" />
                <input name="postalCode" value={formData.postalCode} onChange={handleInputChange} placeholder="Postal code" className="rounded-xl border bg-background px-4 py-3" />
              </div>
            </div>

            <div className="rounded-[28px] border bg-card p-6">
              <h2 className="mb-5 text-xl font-bold">Delivery Option</h2>

              <div className="space-y-3">
                {deliveryOptions.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 ${
                      delivery === opt.id ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Truck className="mt-0.5 h-5 w-5 text-gold" />
                      <div>
                        <p className="font-semibold">{opt.label}</p>
                        <p className="text-sm text-muted-foreground">{opt.time}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-semibold">
                        {opt.id === "dhaka" && cartTotal > 5000 ? "Free" : formatPrice(opt.price)}
                      </span>
                      <input type="radio" checked={delivery === opt.id} onChange={() => setDelivery(opt.id)} />
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border bg-card p-6">
              <h2 className="mb-5 text-xl font-bold">Payment Method</h2>

              <div className="space-y-3">
                {paymentMethods.map(({ id, label, icon: Icon }) => (
                  <label
                    key={id}
                    className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 ${
                      payment === id ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      <span className="font-semibold">{label}</span>
                    </div>
                    <input type="radio" checked={payment === id} onChange={() => setPayment(id)} />
                  </label>
                ))}
              </div>

              <div className="mt-4">
                <textarea
                  name="notes"
                  value={notes}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Special instructions for delivery..."
                  className="w-full rounded-xl border bg-background px-4 py-3"
                />
              </div>
            </div>
          </div>

          <div className="sticky top-28 h-fit">
            <div className="rounded-[28px] border bg-card p-6">
              <h2 className="mb-5 text-lg font-bold">Order Summary</h2>

              <div className="mb-5 space-y-3">
                {cart.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                    className="flex items-center gap-3"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="h-14 w-14 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-sm font-semibold">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Size: {item.selectedSize} • Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-semibold">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mb-4 flex gap-2">
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Coupon code"
                  className="flex-1 rounded-xl border bg-background px-3 py-2.5 text-sm"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
                >
                  Apply
                </button>
              </div>

              {couponApplied && (
                <p className="mb-3 text-sm text-green-600">AVENZ20 applied — 20% off!</p>
              )}

              <div className="space-y-2 border-t pt-4 text-sm">
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
                  <span>{freeShipping ? "Free" : formatPrice(finalDelivery)}</span>
                </div>

                <div className="rounded-xl bg-primary/5 p-3 text-xs text-muted-foreground">
                  Free delivery on orders above ৳5,000 inside Dhaka.
                </div>

                <div className="flex justify-between border-t pt-3 text-base font-bold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full rounded-xl gold-gradient py-3.5 font-semibold text-primary disabled:opacity-50"
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4" />
                Secure checkout • 256-bit encryption
              </div>

              <div className="mt-4 rounded-2xl bg-muted/40 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-semibold">Fast, trusted order handling</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Clear delivery timelines, order tracking, and support after purchase.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}
