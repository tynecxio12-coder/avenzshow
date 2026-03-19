import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { q: 'How do I place an order?', a: 'Simply browse our collection, select your desired shoes, choose your size and color, add to cart, and proceed to checkout. You can pay via bKash, card, or cash on delivery.' },
  { q: 'What payment methods do you accept?', a: 'We accept bKash, Nagad, credit/debit cards (Visa, Mastercard), and cash on delivery across Bangladesh.' },
  { q: 'How long does delivery take?', a: 'Inside Dhaka: 1-2 business days. Outside Dhaka: 3-5 business days.' },
  { q: 'What is your return policy?', a: 'We offer a 7-day return policy for unused items in original packaging. Contact our support team to initiate a return.' },
  { q: 'How do I track my order?', a: 'After placing your order, you\'ll receive a tracking number via SMS and email. Use it on our Track Order page.' },
  { q: 'Do you offer free shipping?', a: 'Yes! We offer free shipping on orders over ৳5,000 within Dhaka.' },
  { q: 'Are your products genuine?', a: 'Absolutely. All AvenzShoe products are 100% authentic and come with a quality guarantee.' },
  { q: 'Can I exchange a product?', a: 'Yes, exchanges are available within 7 days of delivery. The product must be unworn and in original condition.' },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <Layout>
      <section className="relative py-20 bg-primary">
        <div className="section-padding text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground">Frequently Asked Questions</h1>
            <p className="text-primary-foreground/60 mt-4 max-w-lg mx-auto">Find answers to common questions about AvenzShoe.</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding py-16 max-w-3xl mx-auto">
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="bg-card rounded-xl border border-border overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                <span className="font-semibold text-sm pr-4">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{faq.a}</div>
              )}
            </motion.div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
