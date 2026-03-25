import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, CreditCard, Banknote, Smartphone } from "lucide-react";
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

      const paymentStatus =
        payment === "cod" ? "unpaid" : "pending_verification";

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

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItemsPayload);

      if (itemsError) throw itemsError;

      const { error: trackingError } = await supabase
        .from("order_tracking_history")
        .insert([
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
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <Link
            to="/shop"
            className="inline-flex px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold"
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
        <h1 className="text-4xl font-bold mb-2">Checkout</h1>
        <p className="text-muted-foreground mb-8">Complete your order</p>

        <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card rounded-xl border p-6">
              <h2 className="text-xl font-bold mb-4">Billing & Shipping Details</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <input name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First name" className="px-4 py-3 rounded-lg border bg-background" />
                <input name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last name" className="px-4 py-3 rounded-lg border bg-background" />
                <input name="email" value={formData.email} onChange={handleInputChange} placeholder="Email address" className="px-4 py-3 rounded-lg border bg-background md:col-span-2" />
                <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone number" className="px-4 py-3 rounded-lg border bg-background md:col-span-2" />
                <input name="streetAddress" value={formData.streetAddress} onChange={handleInputChange} placeholder="Street address" className="px-4 py-3 rounded-lg border bg-background md:col-span-2" />
                <input name="apartment" value={formData.apartment} onChange={handleInputChange} placeholder="Apartment, suite, etc. (optional)" className="px-4 py-3 rounded-lg border bg-background md:col-span-2" />
                <input name="city" value={formData.city} onChange={handleInputChange} placeholder="City" className="px-4 py-3 rounded-lg border bg-background" />
                <input name="postalCode" value={formData.postalCode} onChange={handleInputChange} placeholder="Postal code" className="px-4 py-3 rounded-lg border bg-background" />
              </div>
            </div>

            <div className="bg-card rounded-xl border p-6">
              <h2 className="text-xl font-bold mb-4">Delivery Option</h2>
              <div className="space-y-3">
                {deliveryOptions.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-center justify-between border rounded-lg p-4 cursor-pointer ${
                      delivery === opt.id ? "border-primary" : "border-border"
                    }`}
                  >
                    <div>
                      <p className="font-semibold">{opt.label}</p>
                      <p className="text-sm text-muted-foreground">{opt.time}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">
                        {opt.id === "dhaka" && cartTotal > 5000 ? "Free" : formatPrice(opt.price)}
                      </span>
                      <input
                        type="radio"
                        checked={delivery === opt.id}
                        onChange={() => setDelivery(opt.id)}
                      />
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-xl border p-6">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <div className="space-y-3">
                {paymentMethods.map(({ id, label, icon: Icon }) => (
                  <label
                    key={id}
                    className={`flex items-center justify-between border rounded-lg p-4 cursor-pointer ${
                      payment === id ? "border-primary" : "border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span className="font-semibold">{label}</span>
                    </div>
                    <input
                      type="radio"
                      checked={payment === id}
                      onChange={() => setPayment(id)}
                    />
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
                  className="w-full px-4 py-3 rounded-lg border bg-background"
                />
              </div>
            </div>
          </div>

          <div className="h-fit sticky top-28">
            <div className="bg-card rounded-xl border p-6">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-5">
                {cart.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}`}
                    className="flex items-center gap-3"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Size: {item.selectedSize} × {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-semibold">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mb-4">
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Coupon code"
                  className="flex-1 px-3 py-2 text-sm border rounded-lg bg-background"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg"
                >
                  Apply
                </button>
              </div>

              {couponApplied && (
                <p className="text-sm text-green-600 mb-3">AVENZ20 applied — 20% off!</p>
              )}

              <div className="space-y-2 text-sm border-t pt-4">
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

                <div className="border-t pt-3 flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-3.5 gold-gradient text-primary font-semibold rounded-lg disabled:opacity-50"
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>

              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
                <ShieldCheck className="w-4 h-4" />
                Secure checkout • 256-bit encryption
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}
