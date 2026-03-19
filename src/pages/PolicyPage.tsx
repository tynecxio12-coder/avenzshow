import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';

interface Props {
  title: string;
  content: { heading: string; text: string }[];
}

export default function PolicyPage({ title, content }: Props) {
  return (
    <Layout>
      <section className="relative py-20 bg-primary">
        <div className="section-padding text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground">{title}</h1>
          </motion.div>
        </div>
      </section>
      <section className="section-padding py-16 max-w-3xl mx-auto">
        <div className="space-y-8">
          {content.map((section, i) => (
            <div key={i}>
              <h2 className="font-display text-xl font-bold mb-3">{section.heading}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{section.text}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-12">Last updated: January 2025 · AvenzShoe, Dhaka, Bangladesh</p>
      </section>
    </Layout>
  );
}
