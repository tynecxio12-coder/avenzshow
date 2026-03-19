import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { toast } from 'sonner';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent! We\'ll get back to you within 24 hours.');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <Layout>
      <section className="relative py-20 bg-primary">
        <div className="section-padding text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-gold text-sm uppercase tracking-[0.3em] font-semibold">Get in Touch</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mt-4">Contact Us</h1>
            <p className="text-primary-foreground/60 mt-4 max-w-lg mx-auto">We'd love to hear from you. Reach out for questions, feedback, or support.</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-2xl font-bold mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your Name" className="px-4 py-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
                <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Your Email" className="px-4 py-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
              </div>
              <input required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="Subject" className="w-full px-4 py-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
              <textarea required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Your Message" rows={5} className="w-full px-4 py-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none" />
              <button type="submit" className="px-8 py-3 gold-gradient text-primary font-semibold text-sm uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
                <Send className="w-4 h-4" /> Send Message
              </button>
            </form>
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-2xl font-bold mb-6">Contact Information</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Our Address</p>
                  <p className="text-sm text-muted-foreground">House 45, Road 12, Gulshan-1<br />Dhaka 1212, Bangladesh</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Phone</p>
                  <p className="text-sm text-muted-foreground">+880 1700-123456</p>
                  <p className="text-sm text-muted-foreground">+880 1800-654321</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Email</p>
                  <p className="text-sm text-muted-foreground">hello@avenzshoe.com.bd</p>
                  <p className="text-sm text-muted-foreground">support@avenzshoe.com.bd</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Business Hours</p>
                  <p className="text-sm text-muted-foreground">Saturday – Thursday: 10:00 AM – 8:00 PM</p>
                  <p className="text-sm text-muted-foreground">Friday: Closed</p>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="mt-8 rounded-xl overflow-hidden border border-border aspect-video bg-muted flex items-center justify-center">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.9024098985647!2d90.41280827397461!3d23.780573386508!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7715a40c603%3A0xec01cd75f33139f5!2sGulshan%201%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" title="AvenzShoe Location"
              />
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
