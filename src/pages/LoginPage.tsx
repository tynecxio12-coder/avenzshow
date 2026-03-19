import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useStore } from '@/contexts/StoreContext';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    login({ name: email.split('@')[0], email });
    toast.success('Welcome back!');
    navigate('/account');
  };

  return (
    <Layout>
      <section className="section-padding py-16 flex items-center justify-center min-h-[70vh]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="bg-card rounded-2xl border border-border p-8">
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl font-bold">Welcome Back</h1>
              <p className="text-muted-foreground text-sm mt-2">Sign in to your AvenzShoe account</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input required type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full pl-10 pr-10 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                </button>
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-border" />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-gold hover:underline">Forgot password?</Link>
              </div>
              <button type="submit" className="w-full py-3 gold-gradient text-primary font-semibold text-sm uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity">
                Sign In
              </button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-6">
              Don't have an account? <Link to="/signup" className="text-gold font-semibold hover:underline">Create one</Link>
            </p>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
}
