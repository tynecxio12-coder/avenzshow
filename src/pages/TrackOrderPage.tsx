import { useState } from 'react';
import { Search, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { toast } from 'sonner';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info('Order tracking is not available in demo mode. Please contact support for order status.');
  };

  return (
    <Layout>
      <section className="relative py-20 bg-primary">
        <div className="section-padding text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground">Track Your Order</h1>
            <p className="text-primary-foreground/60 mt-4">Enter your order ID to check the delivery status.</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding py-16 flex justify-center">
        <div className="w-full max-w-md">
          <form onSubmit={handleTrack} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input required value={orderId} onChange={e => setOrderId(e.target.value)} placeholder="Enter Order ID (e.g., AVZ-12345)"
                className="w-full pl-12 pr-4 py-3.5 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
            </div>
            <button type="submit" className="w-full py-3.5 gold-gradient text-primary font-semibold text-sm uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity">
              Track Order
            </button>
          </form>
          <div className="text-center mt-12">
            <Package className="w-16 h-16 mx-auto text-muted-foreground/20 mb-3" />
            <p className="text-sm text-muted-foreground">Enter your order ID above to view delivery status and tracking information.</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
