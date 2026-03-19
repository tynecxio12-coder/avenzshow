import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useStore } from '@/contexts/StoreContext';
import { toast } from 'sonner';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    login({ name, email });
    toast.success('Account created successfully!');
    navigate('/account');
  };

  return (
    <Layout>
      <section className="section-padding py-16 flex items-center justify-center min-h-[70vh]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="bg-card rounded-2xl border border-border p-8">
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl font-bold">Create Account</h1>
              <p className="text-muted-foreground text-sm mt-2">Join AvenzShoe for exclusive benefits</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input required value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input required type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Password (min. 8 characters)" minLength={8} className="w-full pl-10 pr-10 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                </button>
              </div>
              <label className="flex items-start gap-2 text-sm text-muted-foreground">
                <input type="checkbox" required className="rounded border-border mt-0.5" />
                <span>I agree to the <Link to="/terms" className="text-gold hover:underline">Terms</Link> and <Link to="/privacy" className="text-gold hover:underline">Privacy Policy</Link></span>
              </label>
              <button type="submit" className="w-full py-3 gold-gradient text-primary font-semibold text-sm uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity">
                Create Account
              </button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account? <Link to="/login" className="text-gold font-semibold hover:underline">Sign In</Link>
            </p>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
}
