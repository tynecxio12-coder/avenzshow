import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  PackageSearch,
  Search,
  Copy,
  CheckCircle2,
  Clock3,
  Truck,
  Package,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/lib/supabase";
import { OrderItemRow, OrderRow, TrackingRow } from "@/types/order";
import { formatPrice } from "@/lib/currency";
import {
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  getOrderStatusColor,
  getPaymentStatusColor,
  ORDER_STATUSES,
  buildTrackingTitle,
} from "@/lib/orderStatus";
import { toast } from "sonner";

const TRACKABLE_STEPS = ORDER_STATUSES.filter(
  (status) => status !== "cancelled"
);

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

  const currentStepIndex = useMemo(() => {
    if (!order?.status) return 0;
    const index = TRACKABLE_STEPS.indexOf(order.status as (typeof TRACKABLE_STEPS)[number]);
    return index >= 0 ? index : 0;
  }, [order]);

  const enrichedHistory = useMemo(() => {
    if (!order) return [];

    if (history.length > 0) return history;

    return [
      {
        id: "fallback-history",
        order_id: order.id,
        status: order.status,
        title: buildTrackingTitle(order.status as any),
        description: "Your order status has been updated in the system.",
        location: null,
        created_at: order.updated_at || order.created_at,
        updated_by: null,
      },
    ] as TrackingRow[];
  }, [history, order]);

  const handleCopy = async (value: string | null, label: string) => {
    if (!value) {
      toast.error(`${label} is not available yet`);
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied`);
    } catch {
      toast.error(`Failed to copy ${label.toLowerCase()}`);
    }
  };

  return (
    <Layout>
      <div className="container py-12 max-w-6xl">
        <div className="text-center mb-10">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <PackageSearch className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Track Your Order</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enter your order ID or order number to view delivery updates,
            tracking history, order items, and estimated delivery information.
          </p>
        </div>

        <div className="bg-card border rounded-[28px] p-6 md:p-7 mb-8 shadow-sm">
          <div className="grid md:grid-cols-3 gap-4">
            <input
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Order ID or Order Number"
              className="px-4 py-3 rounded-2xl border bg-background outline-none"
            />
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Email or phone (optional)"
              className="px-4 py-3 rounded-2xl border bg-background outline-none"
            />
            <button
              onClick={searchOrder}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 font-semibold text-primary-foreground"
            >
              <Search className="w-4 h-4" />
              {loading ? "Searching..." : "Track Order"}
            </button>
          </div>
        </div>

        {!order && !loading && (
          <div className="rounded-[28px] border border-dashed border-border bg-card p-10 text-center">
            <h2 className="text-2xl font-bold mb-2">No order selected yet</h2>
            <p className="text-muted-foreground">
              Search using your order ID to view live order progress.
            </p>
          </div>
        )}

        {order && (
          <div className="space-y-8">
            <div className="bg-card border rounded-[28px] p-6 md:p-7">
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
                <div>
                  <p className="text-sm text-muted-foreground">Order Number</p>
                  <h2 className="text-3xl font-bold mt-1">
                    {order.order_number || order.id}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    Placed on {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <span
                    className={`px-3 py-1 rounded-full border text-sm font-semibold ${getOrderStatusColor(
                      order.status
                    )}`}
                  >
                    {ORDER_STATUS_LABELS[
                      order.status as keyof typeof ORDER_STATUS_LABELS
                    ] || order.status}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full border text-sm font-semibold ${getPaymentStatusColor(
                      order.payment_status
                    )}`}
                  >
                    {PAYMENT_STATUS_LABELS[
                      order.payment_status as keyof typeof PAYMENT_STATUS_LABELS
                    ] || order.payment_status}
                  </span>
                </div>
              </div>

              {order.status !== "cancelled" ? (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mt-7">
                  {TRACKABLE_STEPS.map((step, index) => {
                    const completed = index <= currentStepIndex;
                    const current = index === currentStepIndex;

                    return (
                      <div
                        key={step}
                        className={`rounded-2xl border p-4 text-center transition-all ${
                          completed
                            ? "border-primary/20 bg-primary/5"
                            : "border-border bg-background"
                        }`}
                      >
                        <div
                          className={`mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full ${
                            completed
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {completed ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <Clock3 className="w-5 h-5" />
                          )}
                        </div>
                        <p
                          className={`text-sm font-medium ${
                            current ? "text-primary" : "text-foreground"
                          }`}
                        >
                          {ORDER_STATUS_LABELS[step]}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
                  This order has been cancelled.
                </div>
              )}
            </div>

            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <TrackInfoCard
                icon={<Truck className="w-5 h-5" />}
                title="Courier"
                value={order.courier_name || "Not assigned yet"}
              />
              <TrackInfoCard
                icon={<Package className="w-5 h-5" />}
                title="Tracking Number"
                value={order.tracking_number || "Not available yet"}
                action={
                  <button
                    onClick={() => handleCopy(order.tracking_number, "Tracking number")}
                    className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                }
              />
              <TrackInfoCard
                icon={<Clock3 className="w-5 h-5" />}
                title="Estimated Delivery"
                value={order.estimated_delivery || "Will be updated"}
              />
              <TrackInfoCard
                icon={<ShieldCheck className="w-5 h-5" />}
                title="Total Amount"
                value={formatPrice(order.total_amount)}
              />
            </div>

            <div className="grid lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3 bg-card border rounded-[28px] p-6">
                <div className="flex items-center gap-2 mb-6">
                  <PackageSearch className="w-5 h-5" />
                  <h3 className="text-xl font-bold">Tracking Timeline</h3>
                </div>

                {enrichedHistory.length === 0 ? (
                  <p className="text-muted-foreground">No tracking updates yet.</p>
                ) : (
                  <div className="space-y-6">
                    {enrichedHistory.map((step, index) => (
                      <div key={step.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-4 h-4 rounded-full bg-primary mt-1" />
                          {index !== enrichedHistory.length - 1 && (
                            <div className="w-px flex-1 bg-border mt-2" />
                          )}
                        </div>

                        <div className="pb-2 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <p className="font-semibold">{step.title}</p>
                            <span
                              className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium border ${getOrderStatusColor(
                                step.status
                              )}`}
                            >
                              {ORDER_STATUS_LABELS[
                                step.status as keyof typeof ORDER_STATUS_LABELS
                              ] || step.status}
                            </span>
                          </div>

                          {step.description && (
                            <p className="text-sm text-muted-foreground mt-2">
                              {step.description}
                            </p>
                          )}

                          <div className="text-xs text-muted-foreground mt-3 flex flex-wrap gap-2 items-center">
                            <span>{new Date(step.created_at).toLocaleString()}</span>
                            {step.location && (
                              <>
                                <span>•</span>
                                <span className="inline-flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5" />
                                  {step.location}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div className="bg-card border rounded-[28px] p-6">
                  <h3 className="text-lg font-bold mb-4">Customer Info</h3>
                  <p className="font-semibold">{order.full_name}</p>
                  <p className="text-sm text-muted-foreground mt-1">{order.email}</p>
                  <p className="text-sm text-muted-foreground mt-1">{order.phone}</p>
                  <p className="text-sm mt-4 leading-7">{order.address}</p>
                </div>

                <div className="bg-card border rounded-[28px] p-6">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <h3 className="text-lg font-bold">Order Items</h3>
                    <span className="text-sm text-muted-foreground">
                      {items.length} item{items.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <img
                          src={item.product_image || "/placeholder.svg"}
                          alt={item.product_name}
                          className="w-16 h-16 object-cover rounded-xl border"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{item.product_name}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Size: {item.size || "N/A"} • Qty: {item.quantity}
                          </p>
                          <p className="text-sm font-bold mt-2">
                            {formatPrice(item.total_price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {order.admin_note && (
                  <div className="bg-card border rounded-[28px] p-6">
                    <h3 className="text-lg font-bold mb-2">Admin Note</h3>
                    <p className="text-sm text-muted-foreground leading-7">
                      {order.admin_note}
                    </p>
                  </div>
                )}

                <div className="bg-card border rounded-[28px] p-6">
                  <h3 className="text-lg font-bold mb-3">Need more details?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    You can also review your complete order list from your account dashboard.
                  </p>
                  <Link
                    to="/account"
                    className="inline-flex items-center justify-center rounded-2xl border px-4 py-2.5 font-semibold"
                  >
                    Go to My Account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

function TrackInfoCard({
  icon,
  title,
  value,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="border rounded-[24px] bg-card p-5">
      <div className="flex items-center gap-3 text-primary mb-3">
        {icon}
        <p className="font-semibold">{title}</p>
      </div>
      <p className="font-semibold break-words">{value}</p>
      {action}
    </div>
  );
}
