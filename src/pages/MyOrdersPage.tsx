import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, PackageSearch } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { OrderRow } from "@/types/order";
import { formatPrice } from "@/lib/currency";
import {
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  getOrderStatusColor,
  getPaymentStatusColor,
} from "@/lib/orderStatus";

export default function MyOrdersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) return;

      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setOrders((data as OrderRow[]) || []);
      setLoading(false);
    };

    loadOrders();
  }, [user]);

  return (
    <Layout>
      <div className="container py-12">
        <div className="mb-8 rounded-[28px] border border-border bg-card p-6 md:p-8">
          <h1 className="text-4xl font-bold">My Orders</h1>
          <p className="mt-2 text-muted-foreground">
            View your order history, payment status, and live tracking updates.
          </p>
        </div>

        {loading ? (
          <div className="py-16 text-center">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="rounded-[28px] border border-dashed p-10 text-center">
            <p className="mb-4 text-muted-foreground">You have not placed any orders yet.</p>
            <Link to="/shop" className="font-semibold text-primary">
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => navigate(`/track-order?orderId=${order.id}`)}
                className="cursor-pointer rounded-[28px] border bg-card p-6 transition hover:border-primary/30 hover:shadow-md"
              >
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Order Number</p>
                    <p className="mt-1 text-xl font-bold">{order.order_number || order.id}</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <span
                      className={`rounded-full border px-3 py-1 text-sm font-semibold ${getOrderStatusColor(
                        order.status
                      )}`}
                    >
                      {ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS] ||
                        order.status}
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

                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="font-bold">{formatPrice(order.total_amount)}</p>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2" onClick={(e) => e.stopPropagation()}>
                    <Link
                      to={`/order-confirmation/${order.id}`}
                      className="inline-flex items-center justify-center rounded-xl border px-4 py-2.5 font-semibold"
                    >
                      View
                    </Link>
                    <Link
                      to={`/track-order?orderId=${order.id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-semibold text-primary-foreground"
                    >
                      <PackageSearch className="h-4 w-4" />
                      Track
                    </Link>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between rounded-2xl bg-muted/40 p-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      Delivery progress
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      Click this card to open live order tracking.
                    </p>
                  </div>

                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
