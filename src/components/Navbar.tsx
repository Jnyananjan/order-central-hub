import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, LogOut, Home, User, Package, Globe } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCurrency, setShowCurrency] = useState(false);
  const { itemCount } = useCart();
  const { user, signOut } = useAuth();
  const { currency, setCurrency, currencies } = useCurrency();
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  // Get display name from user metadata or email
  const getDisplayName = () => {
    if (!user) return '';
    const fullName = user.user_metadata?.full_name;
    if (fullName) return fullName.split(' ')[0]; // First name only
    return user.email?.split('@')[0] || 'User';
  };

  const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Setup', href: '/setup' },
    { name: 'Updates', href: '/updates' },
    { name: 'Contact', href: '/contact' },
    { name: 'Orders', href: '/orders', icon: Package },
  ];

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isHomePage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Cart icon on mobile, Menu button on desktop is hidden */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button - moved to left */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Center - Logo */}
          <a
            href="/"
            onClick={handleHomeClick}
            className="font-display font-bold text-xl tracking-tight absolute left-1/2 -translate-x-1/2"
          >
            Techy Pad
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 absolute left-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side - Cart & Auth */}
          <div className="flex items-center gap-4">
            {/* Currency Selector - Desktop */}
            <div className="hidden md:block relative">
              <button
                onClick={() => setShowCurrency(!showCurrency)}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Globe className="w-4 h-4" />
                {currency.code}
              </button>
              <AnimatePresence>
                {showCurrency && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-40 bg-card border border-border rounded-lg shadow-lg py-2 z-50"
                  >
                    {currencies.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => { setCurrency(c); setShowCurrency(false); }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-secondary transition-colors ${c.code === currency.code ? 'text-foreground font-medium' : 'text-muted-foreground'}`}
                      >
                        {c.symbol} {c.code}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {user ? (
              <>
                <span className="hidden md:inline text-sm text-muted-foreground">
                  {getDisplayName()}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSignOut}
                  className="hidden md:flex"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <Link to="/auth" className="hidden md:block">
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="w-4 h-4" />
                  Sign In
                </Button>
              </Link>
            )}

            <Link to="/cart" className="relative p-2">
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-foreground text-background text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-border/30 overflow-hidden"
            >
              <div className="py-4 space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="block px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}

                {/* Currency Selector - Mobile */}
                <div className="px-4 py-2">
                  <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Currency
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {currencies.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => setCurrency(c)}
                        className={`px-3 py-1 rounded-full text-sm border transition-colors ${c.code === currency.code ? 'bg-foreground text-background border-foreground' : 'border-border text-muted-foreground hover:border-foreground'}`}
                      >
                        {c.symbol} {c.code}
                      </button>
                    ))}
                  </div>
                </div>

                {user ? (
                  <div className="px-4 pt-3 border-t border-border/30">
                    <p className="text-sm text-muted-foreground mb-2">Hello, {getDisplayName()}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSignOut}
                      className="w-full gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="px-4 pt-3 border-t border-border/30">
                    <Link to="/auth" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full gap-2">
                        <User className="w-4 h-4" />
                        Sign In
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;