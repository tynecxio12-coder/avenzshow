import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, MapPin, Heart, Eye, Lock, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { useStore } from '@/contexts/StoreContext';
import { formatPrice } from '@/lib/currency';
import { toast } from 'sonner';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'recent', label: 'Recently Viewed', icon: Eye },
  { id: 'password', label: 'Change Password', icon: Lock },
];

export default function AccountPage() {
  const { user, logout, wishlist, recentlyViewed, toggleWishlist, orders } = useStore();
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();

  if (!user) {
    return (
      <Layout>
        <div className="section-padding py-20 text-center">
          <User className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
          <h1 className="font-display text-3xl font-bold">Please Log In</h1>
          <p className="text-muted-foreground mt-2">You need to log in to access your account.</p>
          <Link to="/login" className="inline-block mt-6 px-8 py-3 gold-gradient text-primary rounded-lg font-semibold text-sm uppercase tracking-widest">
            Sign In
          </Link>
        </div>
      </Layout>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Layout>
      <div className="section-padding py-10">
        <h1 className="font-display text-3xl font-bold">My Account</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back, {user.name}!</p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
          <div className="bg-card rounded-xl border border-border p-4 h-fit">
            <nav className="space-y-1">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${activeTab === id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
                  <Icon className="w-4 h-4" /> {label}
                </button>
              ))}
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </nav>
          </div>

          <div className="lg:col-span-3">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              {activeTab === 'profile' && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="font-display text-xl font-bold mb-4">Profile Information</h2>
                  <form onSubmit={e => { e.preventDefault(); toast.success('Profile updated!'); }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label className="text-xs text-muted-foreground">Full Name</label><input defaultValue={user.name} className="w-full mt-1 px-4 py-2.5 rounded-lg border border-border bg-background text-sm" /></div>
                    <div><label className="text-xs text-muted-foreground">Email</label><input defaultValue={user.email} className="w-full mt-1 px-4 py-2.5 rounded-lg border border-border bg-background text-sm" /></div>
                    <div><label className="text-xs text-muted-foreground">Phone</label><input placeholder="+880 1700-000000" className="w-full mt-1 px-4 py-2.5 rounded-lg border border-border bg-background text-sm" /></div>
                    <div><label className="text-xs text-muted-foreground">Date of Birth</label><input type="date" className="w-full mt-1 px-4 py-2.5 rounded-lg border border-border bg-background text-sm" /></div>
                    <div className="sm:col-span-2"><button type="submit" className="px-6 py-2.5 gold-gradient text-primary font-semibold text-sm rounded-lg uppercase tracking-wider">Save Changes</button></div>
                  </form>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="font-display text-xl font-bold mb-4">Order History</h2>
                  {orders.length === 0 ? (
                    <div className="text-center py-10">
                      <Package className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                      <p className="text-muted-foreground text-sm">No orders yet. Start shopping!</p>
                      <Link to="/shop" className="inline-block mt-4 text-gold text-sm font-semibold hover:underline">Browse Products</Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map(order => (
                        <div key={order.id} className="p-4 rounded-lg bg-secondary border border-border">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-sm">#{order.id}</span>
                            <span className="text-xs px-2 py-1 rounded-full bg-gold/10 text-gold font-medium">{order.status}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>{new Date(order.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            <span className="font-semibold text-foreground">{formatPrice(order.total)}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{order.items.length} item{order.items.length > 1 ? 's' : ''} · {order.delivery} · {order.payment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'addresses' && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="font-display text-xl font-bold mb-4">Saved Addresses</h2>
                  <div className="text-center py-10">
                    <MapPin className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-muted-foreground text-sm">No saved addresses yet.</p>
                    <button className="mt-4 text-gold text-sm font-semibold hover:underline">Add New Address</button>
                  </div>
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="font-display text-xl font-bold mb-4">My Wishlist</h2>
                  {wishlist.length === 0 ? (
                    <div className="text-center py-10">
                      <Heart className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                      <p className="text-muted-foreground text-sm">Your wishlist is empty.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {wishlist.map(({ product }) => (
                        <div key={product.id} className="flex items-center gap-4 p-3 rounded-lg bg-secondary">
                          <img src={product.images[0]} alt={product.name} className="w-16 h-16 rounded-lg object-cover" />
                          <div className="flex-1">
                            <Link to={`/product/${product.id}`} className="font-semibold text-sm hover:text-gold">{product.name}</Link>
                            <p className="text-sm font-semibold mt-1">{formatPrice(product.price)}</p>
                          </div>
                          <button onClick={() => toggleWishlist(product)} className="text-xs text-destructive hover:underline">Remove</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'recent' && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="font-display text-xl font-bold mb-4">Recently Viewed</h2>
                  {recentlyViewed.length === 0 ? (
                    <div className="text-center py-10">
                      <Eye className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                      <p className="text-muted-foreground text-sm">No recently viewed products.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentlyViewed.map(product => (
                        <div key={product.id} className="flex items-center gap-4 p-3 rounded-lg bg-secondary">
                          <img src={product.images[0]} alt={product.name} className="w-16 h-16 rounded-lg object-cover" />
                          <div className="flex-1">
                            <Link to={`/product/${product.id}`} className="font-semibold text-sm hover:text-gold">{product.name}</Link>
                            <p className="text-sm font-semibold mt-1">{formatPrice(product.price)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'password' && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="font-display text-xl font-bold mb-4">Change Password</h2>
                  <form className="space-y-4 max-w-md" onSubmit={e => { e.preventDefault(); toast.success('Password updated!'); }}>
                    <div><label className="text-xs text-muted-foreground">Current Password</label><input type="password" className="w-full mt-1 px-4 py-2.5 rounded-lg border border-border bg-background text-sm" /></div>
                    <div><label className="text-xs text-muted-foreground">New Password</label><input type="password" className="w-full mt-1 px-4 py-2.5 rounded-lg border border-border bg-background text-sm" /></div>
                    <div><label className="text-xs text-muted-foreground">Confirm New Password</label><input type="password" className="w-full mt-1 px-4 py-2.5 rounded-lg border border-border bg-background text-sm" /></div>
                    <button type="submit" className="px-6 py-2.5 gold-gradient text-primary font-semibold text-sm rounded-lg uppercase tracking-wider">Update Password</button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
