import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
        <h1 className="text-4xl font-bold mb-2">My Orders</h1>
        <p className="text-muted-foreground mb-8">See all your recent orders</p>

        {loading ? (
          <div>Loading...</div>
        ) : orders.length === 0 ? (
          <div className="border rounded-2xl p-8 text-center">
            <p className="text-muted-foreground mb-4">You have not placed any orders yet.</p>
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
                className="cursor-pointer border rounded-2xl p-6 bg-card flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 transition hover:shadow-md hover:border-primary/30"
              >
                <div>
                  <p className="text-sm text-muted-foreground">Order Number</p>
                  <p className="font-bold text-lg">{order.order_number || order.id}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <span
                    className={`px-3 py-1 rounded-full border text-sm font-semibold ${getOrderStatusColor(
                      order.status
                    )}`}
                  >
                    {ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS] ||
                      order.status}
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

                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="font-bold">{formatPrice(order.total_amount)}</p>
                </div>

                <div
                  className="flex gap-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link
                    to={`/order-confirmation/${order.id}`}
                    className="px-4 py-2 rounded-lg border font-semibold"
                  >
                    View
                  </Link>
                  <Link
                    to={`/track-order?orderId=${order.id}`}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold"
                  >
                    Track
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
