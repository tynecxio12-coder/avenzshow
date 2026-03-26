import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Clock3, CheckCircle2, Wallet } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/lib/supabase";
import { OrderRow } from "@/types/order";
import { formatPrice } from "@/lib/currency";
import {
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  getOrderStatusColor,
  getPaymentStatusColor,
} from "@/lib/orderStatus";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [search, setSearch] = useState("");

  const loadOrders = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    setOrders((data as OrderRow[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const matchesPayment = paymentFilter === "all" || order.payment_status === paymentFilter;

      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        order.full_name?.toLowerCase().includes(q) ||
        order.email?.toLowerCase().includes(q) ||
        order.phone?.toLowerCase().includes(q) ||
        order.order_number?.toLowerCase().includes(q) ||
        order.id.toLowerCase().includes(q);

      return matchesStatus && matchesPayment && matchesSearch;
    });
  }, [orders, statusFilter, paymentFilter, search]);

  const stats = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      paid: orders.filter((o) => o.payment_status === "paid").length,
    };
  }, [orders]);

  return (
    <Layout>
      <div className="container py-12">
        <div className="mb-8 rounded-[28px] border border-border bg-card p-6 md:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold">Admin Orders</h1>
              <p className="mt-2 text-muted-foreground">
                Manage customer orders, tracking, payment status, and fulfillment progress.
              </p>
            </div>

            <button onClick={loadOrders} className="rounded-xl border px-4 py-2.5 font-semibold">
              Refresh
            </button>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard title="Total Orders" value={stats.total} icon={<Package className="h-5 w-5" />} />
            <AdminStatCard title="Pending" value={stats.pending} icon={<Clock3 className="h-5 w-5" />} />
            <AdminStatCard title="Delivered" value={stats.delivered} icon={<CheckCircle2 className="h-5 w-5" />} />
            <AdminStatCard title="Paid" value={stats.paid} icon={<Wallet className="h-5 w-5" />} />
          </div>
        </div>

        <div className="mb-6 grid gap-4 rounded-2xl border bg-card p-4 md:grid-cols-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone, order number..."
            className="rounded-lg border bg-background px-4 py-3 md:col-span-2"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border bg-background px-4 py-3"
          >
            <option value="all">All order status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="packed">Packed</option>
            <option value="shipped">Shipped</option>
            <option value="out_for_delivery">Out for delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="rounded-lg border bg-background px-4 py-3"
          >
            <option value="all">All payment status</option>
            <option value="unpaid">Unpaid</option>
            <option value="pending_verification">Pending verification</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        {loading ? (
          <div>Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="rounded-2xl border p-8 text-center text-muted-foreground">
            No orders found.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="grid items-center gap-4 rounded-[28px] border bg-card p-6 lg:grid-cols-6"
              >
                <div className="lg:col-span-2">
                  <p className="text-sm text-muted-foreground">Order</p>
                  <p className="font-bold">{order.order_number || order.id}</p>
                  <p className="mt-1 text-sm">{order.full_name}</p>
                  <p className="text-xs text-muted-foreground">{order.email}</p>
                  <p className="text-xs text-muted-foreground">{order.phone}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Order Status</p>
                  <span className={`mt-1 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getOrderStatusColor(order.status)}`}>
                    {ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS] || order.status}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Payment</p>
                  <span className={`mt-1 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getPaymentStatusColor(order.payment_status)}`}>
                    {PAYMENT_STATUS_LABELS[order.payment_status as keyof typeof PAYMENT_STATUS_LABELS] || order.payment_status}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="font-bold">{formatPrice(order.total_amount)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="flex justify-start lg:justify-end">
                  <Link
                    to={`/admin/orders/${order.id}`}
                    className="rounded-xl bg-primary px-4 py-2.5 font-semibold text-primary-foreground"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

function AdminStatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className="text-gold">{icon}</div>
      </div>
      <p className="mt-3 text-3xl font-bold text-primary">{value}</p>
    </div>
  );
}
