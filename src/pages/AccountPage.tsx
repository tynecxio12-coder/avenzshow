import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  User,
  Package,
  Heart,
  MapPin,
  Settings,
  LogOut,
  ShoppingBag,
  Truck,
  Clock3,
  CheckCircle2,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useStore } from "@/contexts/StoreContext";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/currency";
import { toast } from "sonner";

type OrderRow = {
  id: string;
  created_at?: string;
  status?: string;
  total_amount?: number;
  full_name?: string;
  email?: string;
  phone?: string;
  address?: string;
};

type TabType = "overview" | "orders" | "addresses" | "wishlist" | "settings";

export default function AccountPage() {
  const { user, loading, signOut } = useAuth();
  const { wishlist } = useStore();

  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (!user) return;

    const fullName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "Customer";

    setProfile({
      fullName,
      email: user.email || "",
      phone: user.user_metadata?.phone || "",
    });
  }, [user]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      setOrdersLoading(true);

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Orders fetch error:", error);
      } else {
        setOrders(data || []);
      }

      setOrdersLoading(false);
    };

    fetchOrders();
  }, [user]);

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(
      (o) => (o.status || "").toLowerCase() === "pending"
    ).length;
    const deliveredOrders = orders.filter(
      (o) => (o.status || "").toLowerCase() === "delivered"
    ).length;
    const savedAddresses = orders.filter((o) => o.address).length > 0 ? 1 : 0;

    return {
      totalOrders,
      pendingOrders,
      deliveredOrders,
      wishlistCount: wishlist.length,
      savedAddresses,
    };
  }, [orders, wishlist]);

  const latestAddress =
    orders.find((o) => o.address)?.address || "No saved address yet";

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString()
    : "N/A";

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully");
  };

  const handleSaveSettings = () => {
    toast.success("Profile UI updated. Save-to-database can be connected next.");
  };

  if (loading) {
    return (
      <Layout>
        <div className="section-padding py-20">Loading account...</div>
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "orders", label: "Orders", icon: Package },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "settings", label: "Settings", icon: Settings },
  ] as const;

  return (
    <Layout>
      <section className="section-padding py-10 md:py-14">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-[28px] border border-border bg-card p-6 md:p-8 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-full gold-gradient flex items-center justify-center text-primary shadow-md">
                  <User className="w-9 h-9" />
                </div>

                <div>
                  <h1 className="font-display text-4xl md:text-5xl font-bold text-primary">
                    My Account
                  </h1>
                  <p className="text-lg text-muted-foreground mt-2">
                    Welcome back, {profile.fullName}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Member since {memberSince}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 h-12 px-5 rounded-2xl border border-red-300 text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>

            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mt-8">
              <StatCard
                title="Total Orders"
                value={stats.totalOrders}
                icon={<ShoppingBag className="w-5 h-5" />}
              />
              <StatCard
                title="Pending"
                value={stats.pendingOrders}
                icon={<Clock3 className="w-5 h-5" />}
              />
              <StatCard
                title="Delivered"
                value={stats.deliveredOrders}
                icon={<CheckCircle2 className="w-5 h-5" />}
              />
              <StatCard
                title="Wishlist"
                value={stats.wishlistCount}
                icon={<Heart className="w-5 h-5" />}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 mt-8">
            <aside className="rounded-[28px] border border-border bg-card p-4 h-fit">
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all ${
                        isActive
                          ? "gold-gradient text-primary font-semibold shadow-sm"
                          : "hover:bg-muted text-foreground/80"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 rounded-2xl bg-muted/50 p-4 border border-border">
                <p className="text-sm font-semibold text-primary">Account ID</p>
                <p className="text-xs text-muted-foreground mt-2 break-all">
                  {user.id}
                </p>
              </div>
            </aside>

            <main className="rounded-[28px] border border-border bg-card p-6 md:p-8">
              {activeTab === "overview" && (
                <div className="space-y-8">
                  <SectionTitle
                    title="Overview"
                    subtitle="A quick summary of your shopping activity."
                  />

                  <div className="grid md:grid-cols-2 gap-6">
                    <InfoBox
                      icon={<Truck className="w-5 h-5" />}
                      title="Latest Shipping Address"
                      value={latestAddress}
                    />
                    <InfoBox
                      icon={<Package className="w-5 h-5" />}
                      title="Recent Order Status"
                      value={orders[0]?.status || "No recent orders"}
                    />
                  </div>

                  <div>
                    <h3 className="font-display text-2xl font-bold text-primary mb-4">
                      Recent Orders
                    </h3>

                    {ordersLoading ? (
                      <p className="text-muted-foreground">Loading orders...</p>
                    ) : orders.length === 0 ? (
                      <EmptyState text="You have not placed any orders yet." />
                    ) : (
                      <div className="overflow-x-auto rounded-2xl border border-border">
                        <table className="w-full text-sm">
                          <thead className="bg-muted/50">
                            <tr>
                              <th className="text-left px-4 py-3">Order ID</th>
                              <th className="text-left px-4 py-3">Date</th>
                              <th className="text-left px-4 py-3">Status</th>
                              <th className="text-right px-4 py-3">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders.slice(0, 5).map((order) => (
                              <tr
                                key={order.id}
                                className="border-t border-border"
                              >
                                <td className="px-4 py-4 font-medium">
                                  #{order.id.slice(0, 8)}
                                </td>
                                <td className="px-4 py-4 text-muted-foreground">
                                  {order.created_at
                                    ? new Date(order.created_at).toLocaleDateString()
                                    : "N/A"}
                                </td>
                                <td className="px-4 py-4">
                                  <span className="inline-flex rounded-full px-3 py-1 text-xs font-medium bg-gold/10 text-primary border border-gold/20 capitalize">
                                    {order.status || "pending"}
                                  </span>
                                </td>
                                <td className="px-4 py-4 text-right font-semibold">
                                  {formatPrice(order.total_amount || 0)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "orders" && (
                <div className="space-y-6">
                  <SectionTitle
                    title="My Orders"
                    subtitle="Track your order history and purchase records."
                  />

                  {ordersLoading ? (
                    <p className="text-muted-foreground">Loading orders...</p>
                  ) : orders.length === 0 ? (
                    <EmptyState text="No orders found yet." />
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="rounded-2xl border border-border p-5"
                        >
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                              <p className="font-semibold text-primary">
                                Order #{order.id.slice(0, 8)}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {order.created_at
                                  ? new Date(order.created_at).toLocaleString()
                                  : "No date"}
                              </p>
                            </div>

                            <div className="flex items-center gap-4">
                              <span className="inline-flex rounded-full px-3 py-1 text-xs font-medium bg-gold/10 text-primary border border-gold/20 capitalize">
                                {order.status || "pending"}
                              </span>
                              <span className="font-bold text-lg">
                                {formatPrice(order.total_amount || 0)}
                              </span>
                            </div>
                          </div>

                          <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm">
                            <div className="rounded-xl bg-muted/50 p-4">
                              <p className="text-muted-foreground mb-1">
                                Delivery Address
                              </p>
                              <p>{order.address || "No address available"}</p>
                            </div>

                            <div className="rounded-xl bg-muted/50 p-4">
                              <p className="text-muted-foreground mb-1">Contact</p>
                              <p>{order.phone || "No phone available"}</p>
                              <p>{order.email || "No email available"}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "addresses" && (
                <div className="space-y-6">
                  <SectionTitle
                    title="Saved Addresses"
                    subtitle="Manage your shipping details."
                  />

                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="rounded-2xl border border-border p-5">
                      <p className="font-semibold text-primary mb-2">
                        Primary Address
                      </p>
                      <p className="text-muted-foreground text-sm leading-7">
                        {latestAddress}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-dashed border-border p-5 flex items-center justify-center min-h-[180px] text-muted-foreground">
                      Add another saved address
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "wishlist" && (
                <div className="space-y-6">
                  <SectionTitle
                    title="Wishlist"
                    subtitle="Your favorite products in one place."
                  />

                  <div className="rounded-2xl border border-border p-6">
                    <p className="text-lg font-semibold text-primary">
                      Saved items: {wishlist.length}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Connect this section with your product cards or wishlist page
                      for a full premium experience.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-6">
                  <SectionTitle
                    title="Account Settings"
                    subtitle="Update your personal details."
                  />

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm mb-2 text-muted-foreground">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profile.fullName}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            fullName: e.target.value,
                          }))
                        }
                        className="w-full h-14 rounded-2xl border border-border bg-background px-4 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2 text-muted-foreground">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="w-full h-14 rounded-2xl border border-border bg-background px-4 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2 text-muted-foreground">
                        Phone
                      </label>
                      <input
                        type="text"
                        value={profile.phone}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        className="w-full h-14 rounded-2xl border border-border bg-background px-4 outline-none"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSaveSettings}
                    className="h-12 px-6 rounded-2xl gold-gradient text-primary font-semibold"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>
    </Layout>
  );
}

function StatCard({
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

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div>
      <h2 className="font-display text-3xl font-bold text-primary">{title}</h2>
      <p className="text-muted-foreground mt-2">{subtitle}</p>
    </div>
  );
}

function InfoBox({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border p-5 bg-background">
      <div className="flex items-center gap-3 text-primary mb-3">
        {icon}
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="text-muted-foreground leading-7">{value}</p>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
      {text}
    </div>
  );
}
