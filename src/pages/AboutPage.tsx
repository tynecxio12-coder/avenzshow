import { motion } from 'framer-motion';
import { Award, Heart, Target, Users, MapPin, ShieldCheck, Truck, Headphones } from 'lucide-react';
import Layout from '@/components/layout/Layout';

const values = [
  { icon: Award, title: 'Premium Quality', desc: 'Every pair is crafted with the finest materials and meticulous attention to detail.' },
  { icon: Heart, title: 'Customer First', desc: 'Your satisfaction drives everything we do — from design to delivery.' },
  { icon: Target, title: 'Innovation', desc: 'We continuously push boundaries in comfort technology and design.' },
  { icon: Users, title: 'Community', desc: 'Building a community of shoe enthusiasts who value style and quality.' },
];

const stats = [
  { num: '50K+', label: 'Happy Customers' },
  { num: '200+', label: 'Shoe Styles' },
  { num: '15+', label: 'Years of Experience' },
  { num: '99%', label: 'Satisfaction Rate' },
];

export default function AboutPage() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-20 bg-primary">
        <div className="section-padding text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-gold text-sm uppercase tracking-[0.3em] font-semibold">Our Story</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mt-4">About AvenzShoe</h1>
            <p className="text-primary-foreground/60 mt-4 max-w-2xl mx-auto leading-relaxed">
              Born in the heart of Dhaka, Bangladesh — AvenzShoe is a premium footwear brand dedicated to merging craftsmanship with contemporary design.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="section-padding py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <img src="https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800" alt="AvenzShoe workshop" className="rounded-2xl w-full aspect-[4/3] object-cover" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-3xl font-bold">Our Journey</h2>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              Founded in Dhaka, Bangladesh, AvenzShoe started with a simple vision — to create footwear that doesn't compromise on style, comfort, or quality. What began as a small workshop has grown into a beloved brand trusted by thousands across Bangladesh and beyond.
            </p>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              Every pair of AvenzShoe is a testament to our commitment to excellence. We source the finest materials and employ skilled artisans who pour their expertise into every stitch and sole.
            </p>
            <div className="flex items-center gap-2 mt-6 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 text-gold" />
              <span>Headquartered in Gulshan, Dhaka, Bangladesh</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding py-12 bg-secondary/50">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <p className="font-display text-3xl md:text-4xl font-bold text-gold">{s.num}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-card rounded-xl p-8 border border-border">
            <Target className="w-8 h-8 text-gold mb-4" />
            <h3 className="font-display text-xl font-bold">Our Mission</h3>
            <p className="text-muted-foreground mt-3 leading-relaxed">
              To deliver premium footwear that empowers individuals to express their unique style while enjoying unmatched comfort. We aim to make luxury accessible to everyone in Bangladesh and beyond.
            </p>
          </div>
          <div className="bg-card rounded-xl p-8 border border-border">
            <Award className="w-8 h-8 text-gold mb-4" />
            <h3 className="font-display text-xl font-bold">Our Vision</h3>
            <p className="text-muted-foreground mt-3 leading-relaxed">
              To become Bangladesh's most trusted and innovative footwear brand, known globally for our commitment to quality, sustainability, and design excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding py-16 bg-primary">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl font-bold text-primary-foreground">Why Choose AvenzShoe</h2>
          <p className="text-primary-foreground/60 mt-2">What sets us apart from the rest</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map(({ icon: Icon, title, desc }, i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="text-center p-6">
              <div className="w-14 h-14 mx-auto rounded-full gold-gradient flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-display font-semibold text-primary-foreground">{title}</h4>
              <p className="text-primary-foreground/50 text-sm mt-2">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Perks */}
      <section className="section-padding py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Truck, title: 'Fast Delivery', desc: 'Across Bangladesh' },
            { icon: ShieldCheck, title: 'Genuine Products', desc: '100% authentic' },
            { icon: Headphones, title: 'Customer Support', desc: '10AM–8PM daily' },
            { icon: Heart, title: 'Easy Returns', desc: '7-day return policy' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-gold" />
              </div>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
