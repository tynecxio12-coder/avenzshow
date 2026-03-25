import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/lib/supabase";
import { OrderItemRow, OrderRow, TrackingRow } from "@/types/order";
import { formatPrice } from "@/lib/currency";
import {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  buildTrackingTitle,
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
} from "@/lib/orderStatus";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminOrderDetailsPage() {
  const { orderId } = useParams();
  const { user } = useAuth();

  const [order, setOrder] = useState<OrderRow | null>(null);
  const [items, setItems] = useState<OrderItemRow[]>([]);
  const [history, setHistory] = useState<TrackingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    status: "pending",
    payment_status: "unpaid",
    courier_name: "",
    tracking_number: "",
    estimated_delivery: "",
    admin_note: "",
    tracking_description: "",
    tracking_location: "",
  });

  const loadOrder = async () => {
    if (!orderId) return;

    setLoading(true);

    const [{ data: orderData }, { data: itemData }, { data: trackingData }] =
      await Promise.all([
        supabase.from("orders").select("*").eq("id", orderId).maybeSingle(),
        supabase.from("order_items").select("*").eq("order_id", orderId),
        supabase
          .from("order_tracking_history")
          .select("*")
          .eq("order_id", orderId)
          .order("created_at", { ascending: false }),
      ]);

    const currentOrder = orderData as OrderRow | null;
    setOrder(currentOrder);
    setItems((itemData as OrderItemRow[]) || []);
    setHistory((trackingData as TrackingRow[]) || []);

    if (currentOrder) {
      setForm({
        status: currentOrder.status || "pending",
        payment_status: currentOrder.payment_status || "unpaid",
        courier_name: currentOrder.courier_name || "",
        tracking_number: currentOrder.tracking_number || "",
        estimated_delivery: currentOrder.estimated_delivery || "",
        admin_note: currentOrder.admin_note || "",
        tracking_description: "",
        tracking_location: "",
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const saveOrderUpdate = async () => {
    if (!order || !user) return;

    setSaving(true);
    try {
      const statusChanged = form.status !== order.status;

      const { error: updateError } = await supabase
        .from("orders")
        .update({
          status: form.status,
          payment_status: form.payment_status,
          courier_name: form.courier_name || null,
          tracking_number: form.tracking_number || null,
          estimated_delivery: form.estimated_delivery || null,
          admin_note: form.admin_note || null,
        })
        .eq("id", order.id);

      if (updateError) throw updateError;

      if (statusChanged) {
        const { error: trackingError } = await supabase
          .from("order_tracking_history")
          .insert([
            {
              order_id: order.id,
              status: form.status,
              title: buildTrackingTitle(form.status as any),
              description: form.tracking_description || null,
              location: form.tracking_location || null,
              updated_by: user.id,
            },
          ]);

        if (trackingError) throw trackingError;
      }

      toast.success("Order updated successfully");
      await loadOrder();
    } catch (error: any) {
      toast.error(error.message || "Failed to update order");
    } finally {
      setSaving(false);
    }
  };

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
        <div className="container py-24 text-center">Order not found.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-12">
        <h1 className="text-4xl font-bold mb-2">Manage Order</h1>
        <p className="text-muted-foreground mb-8">
          {order.order_number || order.id}
        </p>

        <div className="grid xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <div className="bg-card border rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Customer & Delivery Info</h2>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="border rounded-xl p-4">
                  <p className="text-muted-foreground">Customer</p>
                  <p className="font-semibold">{order.full_name}</p>
                  <p>{order.email}</p>
                  <p>{order.phone}</p>
                </div>

                <div className="border rounded-xl p-4">
                  <p className="text-muted-foreground">Address</p>
                  <p>{order.address}</p>
                </div>

                <div className="border rounded-xl p-4">
                  <p className="text-muted-foreground">Current Order Status</p>
                  <p className="font-semibold">
                    {ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS] || order.status}
                  </p>
                </div>

                <div className="border rounded-xl p-4">
                  <p className="text-muted-foreground">Current Payment Status</p>
                  <p className="font-semibold">
                    {PAYMENT_STATUS_LABELS[order.payment_status as keyof typeof PAYMENT_STATUS_LABELS] || order.payment_status}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card border rounded-2xl p-6">
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

            <div className="bg-card border rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Tracking History</h2>
              <div className="space-y-4">
                {history.map((step) => (
                  <div key={step.id} className="border rounded-xl p-4">
                    <p className="font-semibold">{step.title}</p>
                    {step.description && (
                      <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(step.created_at).toLocaleString()}
                      {step.location ? ` • ${step.location}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-card border rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Update Order</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold block mb-2">Order Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg border bg-background"
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {ORDER_STATUS_LABELS[status]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold block mb-2">Payment Status</label>
                  <select
                    value={form.payment_status}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, payment_status: e.target.value }))
                    }
                    className="w-full px-4 py-3 rounded-lg border bg-background"
                  >
                    {PAYMENT_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {PAYMENT_STATUS_LABELS[status]}
                      </option>
                    ))}
                  </select>
                </div>

                <input
                  value={form.courier_name}
                  onChange={(e) => setForm((p) => ({ ...p, courier_name: e.target.value }))}
                  placeholder="Courier name"
                  className="w-full px-4 py-3 rounded-lg border bg-background"
                />

                <input
                  value={form.tracking_number}
                  onChange={(e) => setForm((p) => ({ ...p, tracking_number: e.target.value }))}
                  placeholder="Tracking number"
                  className="w-full px-4 py-3 rounded-lg border bg-background"
                />

                <input
                  type="date"
                  value={form.estimated_delivery}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, estimated_delivery: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-lg border bg-background"
                />

                <textarea
                  value={form.admin_note}
                  onChange={(e) => setForm((p) => ({ ...p, admin_note: e.target.value }))}
                  placeholder="Admin note"
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border bg-background"
                />

                <textarea
                  value={form.tracking_description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, tracking_description: e.target.value }))
                  }
                  placeholder="Tracking update description (optional when status changes)"
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border bg-background"
                />

                <input
                  value={form.tracking_location}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, tracking_location: e.target.value }))
                  }
                  placeholder="Tracking location"
                  className="w-full px-4 py-3 rounded-lg border bg-background"
                />

                <button
                  onClick={saveOrderUpdate}
                  disabled={saving}
                  className="w-full px-4 py-3 rounded-lg bg-primary text-primary-foreground font-semibold disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>

            <div className="bg-card border rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-4">Financial Summary</h2>
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

            {order.payment_method.toLowerCase().includes("cash") && (
              <div className="bg-card border rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-2">COD Workflow</h2>
                <p className="text-sm text-muted-foreground">
                  When order is delivered and cash is collected, change payment status to
                  <span className="font-semibold"> paid</span>.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
