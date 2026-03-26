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
  PhoneCall,
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
import { useAuth } from "@/contexts/AuthContext";

const TRACKABLE_STEPS = ORDER_STATUSES.filter((status) => status !== "cancelled");

export default function TrackOrderPage() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();

  const [orderId, setOrderId] = useState(params.get("orderId") || "");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderRow | null>(null);
  const [items, setItems] = useState<OrderItemRow[]>([]);
  const [history, setHistory] = useState<TrackingRow[]>([]);
  const [userOrders, setUserOrders] = useState<OrderRow[]>([]);

  useEffect(() => {
    const loadUserOrders = async () => {
      if (!user) return;

      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setUserOrders((data as OrderRow[]) || []);
    };

    loadUserOrders();
  }, [user]);

  const searchOrder = async (customOrderId?: string) => {
    const finalOrderId = (customOrderId ?? orderId).trim();

    if (!finalOrderId) {
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
        .or(`id.eq.${finalOrderId},order_number.eq.${finalOrderId}`)
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
      setOrderId(orderData.id);
      setParams({ orderId: orderData.id });
    } catch (error: any) {
      toast.error(error.message || "Failed to track order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = params.get("orderId");
    if (q) {
      setOrderId(q);
      searchOrder(q);
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
      <div className="container max-w-6xl py-12">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <PackageSearch className="h-8 w-8" />
          </div>
          <h1 className="mb-3 text-4xl font-bold md:text-5xl">Track Your Order</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Enter your order ID or choose one of your recent orders to view delivery
            updates, tracking history, order items, and estimated delivery information.
          </p>
        </div>

        {user && userOrders.length > 0 && (
          <div className="mb-8 rounded-[28px] border bg-card p-6 md:p-7">
            <h2 className="mb-4 text-xl font-bold">Your Recent Orders</h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {userOrders.map((userOrder) => (
                <button
                  key={userOrder.id}
                  onClick={() => searchOrder(userOrder.id)}
                  className="text-left rounded-2xl border bg-background p-4 transition hover:border-primary/30 hover:shadow-sm"
                >
                  <p className="text-sm text-muted-foreground">Order Number</p>
                  <p className="mt-1 font-bold">{userOrder.order_number || userOrder.id}</p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${getOrderStatusColor(
                        userOrder.status
                      )}`}
                    >
                      {ORDER_STATUS_LABELS[
                        userOrder.status as keyof typeof ORDER_STATUS_LABELS
                      ] || userOrder.status}
                    </span>
                    <span className="font-semibold">{formatPrice(userOrder.total_amount)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mb-8 rounded-[28px] border bg-card p-6 shadow-sm md:p-7">
          <div className="grid gap-4 md:grid-cols-3">
            <input
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Order ID or Order Number"
              className="rounded-2xl border bg-background px-4 py-3 outline-none"
            />
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Email or phone (optional)"
              className="rounded-2xl border bg-background px-4 py-3 outline-none"
            />
            <button
              onClick={() => searchOrder()}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 font-semibold text-primary-foreground"
            >
              <Search className="h-4 w-4" />
              {loading ? "Searching..." : "Track Order"}
            </button>
          </div>
        </div>

        {!order && !loading && (
          <div className="rounded-[28px] border border-dashed border-border bg-card p-10 text-center">
            <h2 className="mb-2 text-2xl font-bold">No order selected yet</h2>
            <p className="text-muted-foreground">
              Search using your order ID or click one of your recent orders above.
            </p>
          </div>
        )}

        {order && (
          <div className="space-y-8">
            <div className="rounded-[28px] border bg-card p-6 md:p-7">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Order Number</p>
                  <h2 className="mt-1 text-3xl font-bold">{order.order_number || order.id}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Placed on {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <span
                    className={`rounded-full border px-3 py-1 text-sm font-semibold ${getOrderStatusColor(
                      order.status
                    )}`}
                  >
                    {ORDER_STATUS_LABELS[
                      order.status as keyof typeof ORDER_STATUS_LABELS
                    ] || order.status}
                  </span>

                  <span
                    className={`rounded-full border px-3 py-1 text-sm font-semibold ${getPaymentStatusColor(
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
                <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
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
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            <Clock3 className="h-5 w-5" />
                          )}
                        </div>
                        <p className={`text-sm font-medium ${current ? "text-primary" : "text-foreground"}`}>
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

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <TrackInfoCard icon={<Truck className="h-5 w-5" />} title="Courier" value={order.courier_name || "Not assigned yet"} />
              <TrackInfoCard
                icon={<Package className="h-5 w-5" />}
                title="Tracking Number"
                value={order.tracking_number || "Not available yet"}
                action={
                  <button
                    onClick={() => handleCopy(order.tracking_number, "Tracking number")}
                    className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary"
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </button>
                }
              />
              <TrackInfoCard icon={<Clock3 className="h-5 w-5" />} title="Estimated Delivery" value={order.estimated_delivery || "Will be updated"} />
              <TrackInfoCard icon={<ShieldCheck className="h-5 w-5" />} title="Total Amount" value={formatPrice(order.total_amount)} />
            </div>

            <div className="grid gap-8 lg:grid-cols-5">
              <div className="rounded-[28px] border bg-card p-6 lg:col-span-3">
                <div className="mb-6 flex items-center gap-2">
                  <PackageSearch className="h-5 w-5" />
                  <h3 className="text-xl font-bold">Tracking Timeline</h3>
                </div>

                <div className="space-y-6">
                  {enrichedHistory.map((step, index) => (
                    <div key={step.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="mt-1 h-4 w-4 rounded-full bg-primary" />
                        {index !== enrichedHistory.length - 1 && (
                          <div className="mt-2 w-px flex-1 bg-border" />
                        )}
                      </div>

                      <div className="flex-1 pb-2">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <p className="font-semibold">{step.title}</p>
                          <span
                            className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-medium ${getOrderStatusColor(
                              step.status
                            )}`}
                          >
                            {ORDER_STATUS_LABELS[
                              step.status as keyof typeof ORDER_STATUS_LABELS
                            ] || step.status}
                          </span>
                        </div>

                        {step.description && (
                          <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                        )}

                        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span>{new Date(step.created_at).toLocaleString()}</span>
                          {step.location && (
                            <>
                              <span>•</span>
                              <span className="inline-flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                {step.location}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6 lg:col-span-2">
                <div className="rounded-[28px] border bg-card p-6">
                  <h3 className="mb-4 text-lg font-bold">Customer Info</h3>
                  <p className="font-semibold">{order.full_name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{order.email}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{order.phone}</p>
                  <p className="mt-4 text-sm leading-7">{order.address}</p>
                </div>

                <div className="rounded-[28px] border bg-card p-6">
                  <div className="mb-4 flex items-center justify-between gap-3">
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
                          className="h-16 w-16 rounded-xl border object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{item.product_name}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Size: {item.size || "N/A"} • Qty: {item.quantity}
                          </p>
                          <p className="mt-2 text-sm font-bold">{formatPrice(item.total_price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {order.admin_note && (
                  <div className="rounded-[28px] border bg-card p-6">
                    <h3 className="mb-2 text-lg font-bold">Admin Note</h3>
                    <p className="text-sm leading-7 text-muted-foreground">{order.admin_note}</p>
                  </div>
                )}

                <div className="rounded-[28px] border bg-card p-6">
                  <h3 className="mb-3 text-lg font-bold">Need help?</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    For delivery questions or urgent help, contact support.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      to="/account/orders"
                      className="inline-flex items-center justify-center rounded-2xl border px-4 py-2.5 font-semibold"
                    >
                      Go to My Orders
                    </Link>
                    <a
                      href="tel:+8801700123456"
                      className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 font-semibold text-primary-foreground"
                    >
                      <PhoneCall className="h-4 w-4" />
                      Call Support
                    </a>
                  </div>
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
    <div className="rounded-[24px] border bg-card p-5">
      <div className="mb-3 flex items-center gap-3 text-primary">
        {icon}
        <p className="font-semibold">{title}</p>
      </div>
      <p className="break-words font-semibold">{value}</p>
      {action}
    </div>
  );
}
