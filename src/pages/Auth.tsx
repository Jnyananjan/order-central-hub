import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Lock, User, Shield } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const ADMIN_EMAIL = 'jnyananjan@admin';
const ADMIN_PASSWORD = 'Jnyananjan@01';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const isAdminMode = searchParams.get('admin') === 'true';
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, signUp, signIn, isConfigured } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { 
    if (user && !isAdminMode) {
      // User is already signed in
      navigate('/');
    }
  }, [user, navigate, isAdminMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if it's admin login
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      sessionStorage.setItem('adminLoggedIn', 'true');
      toast({ title: 'Welcome Admin!', description: 'Redirecting to admin dashboard.' });
      navigate('/admin');
      return;
    }

    // If admin mode was requested but wrong credentials
    if (isAdminMode) {
      toast({ title: 'Invalid Admin Credentials', description: 'Please check your email and password.', variant: 'destructive' });
      return;
    }

    // Check if user is already signed in and trying to sign up
    if (user && isSignUp) {
      toast({ 
        title: 'Already Signed In', 
        description: 'You are already signed in. Please sign out first to create a new account.', 
        variant: 'destructive' 
      });
      return;
    }

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
            {user && !isAdminMode ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-green-500" />
                </div>
                <h1 className="font-display text-2xl font-bold mb-2">Already Signed In</h1>
                <p className="text-muted-foreground mb-6">
                  You're signed in as {user.user_metadata?.full_name || user.email}
                </p>
                <Link to="/">
                  <Button className="w-full">Go to Home</Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center gap-2 mb-2">
                  {isAdminMode && <Shield className="w-5 h-5 text-primary" />}
                  <h1 className="font-display text-2xl font-bold text-center">
                    {isAdminMode ? 'Admin Login' : isSignUp ? 'Create Account' : 'Welcome Back'}
                  </h1>
                </div>
                
                {isAdminMode && (
                  <p className="text-sm text-muted-foreground text-center mb-6">
                    Enter admin credentials to access the dashboard
                  </p>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  {isSignUp && !isAdminMode && (
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input className="pl-10" value={name} onChange={(e) => setName(e.target.value)} required />
                      </div>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        type={isAdminMode ? 'text' : 'email'} 
                        className="pl-10" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder={isAdminMode ? 'Admin email' : 'your@email.com'}
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input type="password" className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Loading...' : isAdminMode ? 'Login' : isSignUp ? 'Sign Up' : 'Sign In'}
                  </Button>
                </form>
                
                {!isAdminMode && (
                  <p className="text-center text-sm text-muted-foreground mt-6">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button onClick={() => setIsSignUp(!isSignUp)} className="text-foreground hover:underline">
                      {isSignUp ? 'Sign In' : 'Sign Up'}
                    </button>
                  </p>
                )}

                {isAdminMode && (
                  <p className="text-center text-sm text-muted-foreground mt-6">
                    <Link to="/auth" className="text-foreground hover:underline">
                      Back to User Login
                    </Link>
                  </p>
                )}
              </>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;