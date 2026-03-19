import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    toast.success('Password reset link sent to your email!');
  };

  return (
    <Layout>
      <section className="section-padding py-16 flex items-center justify-center min-h-[70vh]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="bg-card rounded-2xl border border-border p-8">
            <Link to="/login" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </Link>
            <h1 className="font-display text-3xl font-bold">Forgot Password</h1>
            <p className="text-muted-foreground text-sm mt-2">Enter your email and we'll send you a reset link.</p>

            {sent ? (
              <div className="mt-8 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-secondary flex items-center justify-center mb-4">
                  <Mail className="w-7 h-7 text-gold" />
                </div>
                <p className="text-sm text-muted-foreground">We've sent a password reset link to <strong className="text-foreground">{email}</strong>. Please check your inbox.</p>
                <Link to="/login" className="inline-block mt-6 text-gold text-sm font-semibold hover:underline">Return to Login</Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
                </div>
                <button type="submit" className="w-full py-3 gold-gradient text-primary font-semibold text-sm uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity">
                  Send Reset Link
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </section>
    </Layout>
  );
}
