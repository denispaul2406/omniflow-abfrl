import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, CreditCard, Sparkles } from 'lucide-react';

const Checkout = () => {
  const { currentUser, cart, cartTotal, loyaltyDiscount, clearCart, sessionId } = useApp();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [currentUser, cart, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const finalTotal = cartTotal - loyaltyDiscount;

  const handleCheckout = async () => {
    if (!currentUser) return;
    
    setIsProcessing(true);

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: currentUser.id,
          total_amount: finalTotal,
          discount_applied: loyaltyDiscount,
          order_status: 'confirmed',
          session_id: sessionId
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product?.price || 0
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      toast.success('Order placed successfully!');
      
      // Navigate to confirmation with order data
      navigate('/confirmation', { 
        state: { 
          orderId: order.id,
          orderData: {
            orderId: order.id,
            productName: cart[0]?.product?.name || 'Product',
            userName: currentUser.name,
            product: cart[0]?.product
          }
        } 
      });
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!currentUser || cart.length === 0) return null;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      
      <main className="flex-1 px-5 py-6">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Checkout</h2>

        <div className="space-y-4">
          <Card className="border-0 shadow-soft">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Delivery Details</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="name" className="text-xs text-muted-foreground">Name</Label>
                  <Input id="name" value={currentUser.name} readOnly className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="address" className="text-xs text-muted-foreground">Delivery Address</Label>
                  <Input id="address" placeholder="Enter delivery address" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-xs text-muted-foreground">Phone</Label>
                  <Input id="phone" placeholder="Enter phone number" className="mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-soft">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Payment
              </h3>
              <p className="text-sm text-muted-foreground">
                Pay at store pickup or use in-store payment options
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-soft">
            <CardContent className="p-4 space-y-3">
              <h3 className="font-semibold">Order Summary</h3>
              
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{cart.length} items</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                
                {loyaltyDiscount > 0 && (
                  <div className="flex justify-between text-success">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Loyalty Discount ({currentUser.loyalty_tier} - {Math.round((loyaltyDiscount / cartTotal) * 100)}%)
                    </span>
                    <span>-{formatPrice(loyaltyDiscount)}</span>
                  </div>
                )}
                
                <div className="border-t border-border pt-2 flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(finalTotal)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <div className="sticky bottom-0 p-5 bg-background border-t border-border shadow-elevated">
        <Button 
          className="w-full h-12 text-base font-semibold rounded-lg"
          onClick={handleCheckout}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 rounded-full gradient-sun-spinner mr-2"></div>
              Processing...
            </>
          ) : (
            `Pay ${formatPrice(finalTotal)}`
          )}
        </Button>
      </div>
    </div>
  );
};

export default Checkout;
