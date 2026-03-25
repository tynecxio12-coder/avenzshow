import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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
      const matchesPayment =
        paymentFilter === "all" || order.payment_status === paymentFilter;

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

  return (
    <Layout>
      <div className="container py-12">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold">Admin Orders</h1>
            <p className="text-muted-foreground mt-2">
              Manage customer orders, tracking, and payment
            </p>
          </div>

          <button
            onClick={loadOrders}
            className="px-4 py-2 rounded-lg border font-semibold"
          >
            Refresh
          </button>
        </div>

        <div className="bg-card border rounded-2xl p-4 mb-6 grid md:grid-cols-4 gap-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone, order number..."
            className="px-4 py-3 rounded-lg border bg-background md:col-span-2"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 rounded-lg border bg-background"
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
            className="px-4 py-3 rounded-lg border bg-background"
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
          <div className="border rounded-2xl p-8 text-center text-muted-foreground">
            No orders found.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-card border rounded-2xl p-6 grid lg:grid-cols-6 gap-4 items-center"
              >
                <div className="lg:col-span-2">
                  <p className="text-sm text-muted-foreground">Order</p>
                  <p className="font-bold">{order.order_number || order.id}</p>
                  <p className="text-sm mt-1">{order.full_name}</p>
                  <p className="text-xs text-muted-foreground">{order.email}</p>
                  <p className="text-xs text-muted-foreground">{order.phone}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Order Status</p>
                  <span className={`inline-flex mt-1 px-3 py-1 rounded-full border text-xs font-semibold ${getOrderStatusColor(order.status)}`}>
                    {ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS] || order.status}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Payment</p>
                  <span className={`inline-flex mt-1 px-3 py-1 rounded-full border text-xs font-semibold ${getPaymentStatusColor(order.payment_status)}`}>
                    {PAYMENT_STATUS_LABELS[order.payment_status as keyof typeof PAYMENT_STATUS_LABELS] || order.payment_status}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="font-bold">{formatPrice(order.total_amount)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="flex justify-start lg:justify-end">
                  <Link
                    to={`/admin/orders/${order.id}`}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold"
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
