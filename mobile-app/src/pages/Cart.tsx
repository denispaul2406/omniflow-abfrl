import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Header } from '@/components/Header';
import { CartItemCard } from '@/components/CartItem';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag, Sparkles, ArrowRight } from 'lucide-react';

const Cart = () => {
  const { currentUser, cart, cartTotal, loyaltyDiscount } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const finalTotal = cartTotal - loyaltyDiscount;

  if (!currentUser) return null;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      
      <main className="flex-1 px-5 py-6">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Your Cart</h2>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg">Your cart is empty</h3>
            <p className="text-muted-foreground mt-1 mb-6">Start shopping to add items here</p>
            <Button onClick={() => navigate('/chat')}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              {cart.map((item, index) => (
                <div 
                  key={item.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CartItemCard item={item} />
                </div>
              ))}
            </div>

            <Card className="border-0 shadow-soft">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                
                {loyaltyDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-loyalty-gold" />
                      Loyalty Discount ({currentUser.loyalty_tier} - {Math.round((loyaltyDiscount / cartTotal) * 100)}%)
                    </span>
                    <span className="text-success">-{formatPrice(loyaltyDiscount)}</span>
                  </div>
                )}
                
                <div className="border-t border-border pt-3 flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(finalTotal)}</span>
                </div>

                {currentUser.loyalty_points > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Using {Math.min(currentUser.loyalty_points, Math.floor(cartTotal * (currentUser.loyalty_tier === 'Gold' ? 0.30 : currentUser.loyalty_tier === 'Silver' ? 0.20 : 0.10)))} of your {currentUser.loyalty_points} loyalty points ({currentUser.loyalty_tier} tier)
                  </p>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>

      {cart.length > 0 && (
        <div className="sticky bottom-0 p-5 bg-background border-t border-border shadow-elevated">
          <Button 
            className="w-full h-12 text-base font-semibold rounded-lg"
            onClick={() => navigate('/try-before-buy')}
          >
            Proceed to Checkout
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cart;
