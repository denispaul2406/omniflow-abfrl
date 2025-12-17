import { ShoppingBag, ArrowLeft, Radio, Copy, Check } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

export function Header() {
  const { cart, currentUser, sessionId } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [copied, setCopied] = useState(false);
  
  const showBack = location.pathname !== '/';
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCopySessionId = () => {
    navigator.clipboard.writeText(sessionId);
    setCopied(true);
    toast.success('Session ID copied!', {
      description: 'Use this to continue on other devices'
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-border shadow-soft">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="h-9 w-9 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div className="flex items-center gap-3">
            <img 
              src="/ABFRL-Logo.png" 
              alt="ABFRL" 
              className="h-8 w-auto object-contain"
              onError={(e) => {
                // Fallback to text if logo not found
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent && !parent.querySelector('.abfrl-text-fallback')) {
                  const fallback = document.createElement('div');
                  fallback.className = 'abfrl-text-fallback';
                  fallback.innerHTML = '<h1 class="text-xl font-bold tracking-tight text-foreground">ABFRL</h1>';
                  parent.appendChild(fallback);
                }
              }}
            />
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground font-heading">ABFRL</h1>
              <p className="text-xs text-muted-foreground font-medium">Fashion Chat Suite</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Session ID Display - Always visible when user is logged in */}
          {currentUser && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors group">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Session active" />
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground font-medium">Session:</span>
                <code className="text-xs font-mono text-primary font-semibold">{sessionId.slice(0, 8)}...</code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handleCopySessionId}
                  title="Copy Session ID"
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-success" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </Button>
              </div>
            </div>
          )}

          {currentUser && location.pathname === '/chat' && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
              <Radio className="w-3 h-3 text-primary animate-pulse-gradient" />
              <span className="text-xs font-medium text-primary">Multi-Channel Active</span>
            </div>
          )}
          
          {currentUser && (
            <Button
              variant="ghost"
              size="icon"
              className="relative h-10 w-10 rounded-lg"
              onClick={() => navigate('/cart')}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-accent text-accent-foreground border-0 rounded-full font-semibold"
                >
                  {cartCount}
                </Badge>
              )}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
