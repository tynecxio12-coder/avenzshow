import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, Package, Truck } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/currency";
import { OrderItemRow, OrderRow } from "@/types/order";
import { PAYMENT_STATUS_LABELS, ORDER_STATUS_LABELS } from "@/lib/orderStatus";

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<OrderRow | null>(null);
  const [items, setItems] = useState<OrderItemRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) return;

      setLoading(true);

      const [{ data: orderData }, { data: itemData }] = await Promise.all([
        supabase.from("orders").select("*").eq("id", orderId).maybeSingle(),
        supabase.from("order_items").select("*").eq("order_id", orderId),
      ]);

      setOrder(orderData as OrderRow | null);
      setItems((itemData as OrderItemRow[]) || []);
      setLoading(false);
    };

    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <Layout>
        <div className="container py-24 text-center">Loading order...</div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="container py-24 text-center">
          <h1 className="text-3xl font-bold mb-3">Order not found</h1>
          <Link to="/" className="text-primary font-semibold">
            Go Home
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-12 max-w-5xl">
        <div className="bg-card border rounded-2xl p-8 mb-8">
          <div className="flex items-start gap-4">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
            <div>
              <h1 className="text-3xl font-bold">Order Confirmed</h1>
              <p className="text-muted-foreground mt-2">
                Thank you for your order. We have received it successfully.
              </p>
              <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="p-4 border rounded-xl">
                  <p className="text-muted-foreground">Order Number</p>
                  <p className="font-bold">{order.order_number || order.id}</p>
                </div>
                <div className="p-4 border rounded-xl">
                  <p className="text-muted-foreground">Order Status</p>
                  <p className="font-bold">{ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS] || order.status}</p>
                </div>
                <div className="p-4 border rounded-xl">
                  <p className="text-muted-foreground">Payment Status</p>
                  <p className="font-bold">{PAYMENT_STATUS_LABELS[order.payment_status as keyof typeof PAYMENT_STATUS_LABELS] || order.payment_status}</p>
                </div>
                <div className="p-4 border rounded-xl">
                  <p className="text-muted-foreground">Payment Method</p>
                  <p className="font-bold">{order.payment_method}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-card border rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Ordered Items</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 border rounded-xl p-4">
                  <img
                    src={item.product_image || "/placeholder.svg"}
                    alt={item.product_name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{item.product_name}</p>
                    <p className="text-sm text-muted-foreground">Size: {item.size || "N/A"}</p>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-bold">{formatPrice(item.total_price)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card border rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-4">Shipping Details</h2>
              <p className="font-semibold">{order.full_name}</p>
              <p className="text-sm text-muted-foreground">{order.email}</p>
              <p className="text-sm text-muted-foreground">{order.phone}</p>
              <p className="text-sm mt-3">{order.address}</p>
            </div>

            <div className="bg-card border rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>{formatPrice(order.delivery_charge)}</span>
                </div>
                <div className="flex justify-between font-bold text-base border-t pt-3">
                  <span>Total</span>
                  <span>{formatPrice(order.total_amount)}</span>
                </div>
              </div>
            </div>

            <div className="bg-card border rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Package className="w-5 h-5" />
                <h2 className="font-bold">Next Steps</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                You can track your order anytime from the tracking page.
              </p>
              <Link
                to={`/track-order?orderId=${order.id}`}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground"
              >
                <Truck className="w-4 h-4" />
                Track Order
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
