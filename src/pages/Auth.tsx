import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Lock, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, signUp, signIn, isConfigured } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (user) navigate('/'); }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfigured) {
      toast({ title: 'Supabase Not Configured', description: 'Please add your Supabase credentials.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    if (isSignUp) {
      const { error, needsVerification } = await signUp(email, password, name);
      if (error) toast({ title: 'Sign Up Failed', description: error.message, variant: 'destructive' });
      else if (needsVerification) toast({ title: 'Check Your Email', description: 'Please verify your email to continue.' });
      else navigate('/');
    } else {
      const { error } = await signIn(email, password);
      if (error) toast({ title: 'Sign In Failed', description: error.message, variant: 'destructive' });
      else navigate('/');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"><ArrowLeft className="w-4 h-4" />Back</Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8">
            <h1 className="font-display text-2xl font-bold text-center mb-6">{isSignUp ? 'Create Account' : 'Welcome Back'}</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && <div className="space-y-2"><Label>Name</Label><div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input className="pl-10" value={name} onChange={(e) => setName(e.target.value)} required /></div></div>}
              <div className="space-y-2"><Label>Email</Label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input type="email" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} required /></div></div>
              <div className="space-y-2"><Label>Password</Label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input type="password" className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} required /></div></div>
              <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}</Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-6">{isSignUp ? 'Already have an account?' : "Don't have an account?"} <button onClick={() => setIsSignUp(!isSignUp)} className="text-foreground hover:underline">{isSignUp ? 'Sign In' : 'Sign Up'}</button></p>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
