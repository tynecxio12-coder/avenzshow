import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useStore } from '@/contexts/StoreContext';
import { formatPrice } from '@/lib/currency';

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const { orders } = useStore();
  const order = orders.find(o => o.id === orderId);

  return (
    <Layout>
      <div className="section-padding py-16 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold">Order Confirmed!</h1>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">
            Thank you for shopping with AvenzShoe. Your order has been placed successfully.
          </p>

          <div className="mt-8 bg-card rounded-xl border border-border p-6 max-w-lg mx-auto text-left">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-5 h-5 text-gold" />
              <span className="font-display font-bold text-lg">Order #{orderId}</span>
            </div>

            {order && (
              <>
                <div className="space-y-3 mb-4">
                  {order.items.map(item => (
                    <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`} className="flex items-center gap-3">
                      <img src={item.product.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">Size: {item.selectedSize} · Color: {item.selectedColor} · Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-semibold">{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-3 space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span className="capitalize">{order.delivery}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Payment</span><span className="capitalize">{order.payment}</span></div>
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-border mt-2"><span>Total</span><span>{formatPrice(order.total)}</span></div>
                </div>
              </>
            )}
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            A confirmation SMS/email will be sent shortly. You can track your order using the order ID.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <Link to="/track-order" className="px-6 py-3 border border-border rounded-lg text-sm font-semibold uppercase tracking-wide hover:bg-muted transition-colors">
              Track Order
            </Link>
            <Link to="/shop" className="px-6 py-3 gold-gradient text-primary rounded-lg font-semibold text-sm uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center gap-2">
              Continue Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
