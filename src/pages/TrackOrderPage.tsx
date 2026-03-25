import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PackageSearch, Search } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/lib/supabase";
import { OrderItemRow, OrderRow, TrackingRow } from "@/types/order";
import { formatPrice } from "@/lib/currency";
import {
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  getOrderStatusColor,
  getPaymentStatusColor,
} from "@/lib/orderStatus";
import { toast } from "sonner";

export default function TrackOrderPage() {
  const [params] = useSearchParams();
  const [orderId, setOrderId] = useState(params.get("orderId") || "");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderRow | null>(null);
  const [items, setItems] = useState<OrderItemRow[]>([]);
  const [history, setHistory] = useState<TrackingRow[]>([]);

  const searchOrder = async () => {
    if (!orderId.trim()) {
      toast.error("Please enter your order ID");
      return;
    }

    setLoading(true);
    setOrder(null);
    setItems([]);
    setHistory([]);

    try {
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .or(`id.eq.${orderId},order_number.eq.${orderId}`)
        .maybeSingle();

      if (orderError) throw orderError;
      if (!orderData) {
        toast.error("Order not found");
        return;
      }

      if (contact.trim()) {
        const normalized = contact.trim().toLowerCase();
        const emailMatch = orderData.email?.toLowerCase() === normalized;
        const phoneMatch = orderData.phone?.trim() === contact.trim();

        if (!emailMatch && !phoneMatch) {
          toast.error("Order found, but email/phone did not match");
          return;
        }
      }

      const [{ data: itemData }, { data: trackingData }] = await Promise.all([
        supabase.from("order_items").select("*").eq("order_id", orderData.id),
        supabase
          .from("order_tracking_history")
          .select("*")
          .eq("order_id", orderData.id)
          .order("created_at", { ascending: false }),
      ]);

      setOrder(orderData as OrderRow);
      setItems((itemData as OrderItemRow[]) || []);
      setHistory((trackingData as TrackingRow[]) || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to track order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.get("orderId")) {
      searchOrder();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <div className="container py-12 max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Track Your Order</h1>
          <p className="text-muted-foreground">
            Enter your order ID and optional email/phone to track delivery progress
          </p>
        </div>

        <div className="bg-card border rounded-2xl p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <input
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Order ID or Order Number"
              className="px-4 py-3 rounded-lg border bg-background"
            />
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Email or phone (optional)"
              className="px-4 py-3 rounded-lg border bg-background"
            />
            <button
              onClick={searchOrder}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground"
            >
              <Search className="w-4 h-4" />
              {loading ? "Searching..." : "Track Order"}
            </button>
          </div>
        </div>

        {order && (
          <div className="space-y-8">
            <div className="bg-card border rounded-2xl p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order Number</p>
                  <h2 className="text-2xl font-bold">{order.order_number || order.id}</h2>
                </div>

                <div className="flex flex-wrap gap-3">
                  <span className={`px-3 py-1 rounded-full border text-sm font-semibold ${getOrderStatusColor(order.status)}`}>
                    {ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS] || order.status}
                  </span>

                  <span className={`px-3 py-1 rounded-full border text-sm font-semibold ${getPaymentStatusColor(order.payment_status)}`}>
                    {PAYMENT_STATUS_LABELS[order.payment_status as keyof typeof PAYMENT_STATUS_LABELS] || order.payment_status}
                  </span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <div className="border rounded-xl p-4">
                  <p className="text-sm text-muted-foreground">Courier</p>
                  <p className="font-semibold">{order.courier_name || "Not assigned yet"}</p>
                </div>
                <div className="border rounded-xl p-4">
                  <p className="text-sm text-muted-foreground">Tracking Number</p>
                  <p className="font-semibold">{order.tracking_number || "Not available yet"}</p>
                </div>
                <div className="border rounded-xl p-4">
                  <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                  <p className="font-semibold">{order.estimated_delivery || "Will be updated"}</p>
                </div>
                <div className="border rounded-xl p-4">
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-semibold">{formatPrice(order.total_amount)}</p>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3 bg-card border rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <PackageSearch className="w-5 h-5" />
                  <h3 className="text-xl font-bold">Tracking Timeline</h3>
                </div>

                {history.length === 0 ? (
                  <p className="text-muted-foreground">No tracking updates yet.</p>
                ) : (
                  <div className="space-y-6">
                    {history.map((step, index) => (
                      <div key={step.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-4 h-4 rounded-full bg-primary mt-1" />
                          {index !== history.length - 1 && <div className="w-px flex-1 bg-border mt-2" />}
                        </div>
                        <div className="pb-2">
                          <p className="font-semibold">{step.title}</p>
                          {step.description && (
                            <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                          )}
                          <div className="text-xs text-muted-foreground mt-2">
                            {new Date(step.created_at).toLocaleString()}
                            {step.location ? ` • ${step.location}` : ""}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div className="bg-card border rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-4">Customer Info</h3>
                  <p className="font-semibold">{order.full_name}</p>
                  <p className="text-sm text-muted-foreground">{order.email}</p>
                  <p className="text-sm text-muted-foreground">{order.phone}</p>
                  <p className="text-sm mt-3">{order.address}</p>
                </div>

                <div className="bg-card border rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <img
                          src={item.product_image || "/placeholder.svg"}
                          alt={item.product_name}
                          className="w-14 h-14 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{item.product_name}</p>
                          <p className="text-xs text-muted-foreground">
                            Size: {item.size || "N/A"} • Qty: {item.quantity}
                          </p>
                          <p className="text-sm font-bold mt-1">{formatPrice(item.total_price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {order.admin_note && (
                  <div className="bg-card border rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-2">Admin Note</h3>
                    <p className="text-sm text-muted-foreground">{order.admin_note}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
