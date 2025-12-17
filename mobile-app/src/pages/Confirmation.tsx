import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Package, Home, Copy, MapPin, Truck, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import QRCode from 'react-qr-code';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

const Confirmation = () => {
  const { currentUser, sessionId, setCurrentUser, clearCart, cart } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;
  const orderData = location.state?.orderData;
  const [showQR, setShowQR] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);
  const { width = window.innerWidth, height = window.innerHeight } = useWindowSize();

  useEffect(() => {
    if (!currentUser || !orderId) {
      navigate('/');
      return;
    }
    
    // Clear cart after order is confirmed
    clearCart();
  }, [currentUser, orderId, navigate, clearCart]);

  useEffect(() => {
    // Stop confetti after 5 seconds
    const confettiTimer = setTimeout(() => setShowConfetti(false), 5000);
    
    return () => {
      clearTimeout(confettiTimer);
    };
  }, []);

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    toast.success('Order ID copied to clipboard');
  };

  const qrData = JSON.stringify({
    orderId,
    sessionId,
    userId: currentUser?.id,
    userName: currentUser?.name
  });

  if (!currentUser || !orderId) return null;

  return (
    <>
      {showConfetti && width > 0 && height > 0 && (
        <Confetti 
          width={width} 
          height={height}
          recycle={false}
          numberOfPieces={200}
          colors={['#CF2E2E', '#F68529', '#C58A24', '#1E88E5', '#FFFFFF']}
          style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, pointerEvents: 'none' }}
        />
      )}
      <div className="flex flex-col min-h-screen bg-background relative">
        <Header />
      
      <main className="flex-1 px-5 py-6">
        <div className="text-center mb-8">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full gradient-sun opacity-20 animate-pulse-gradient"></div>
            <div className="relative w-20 h-20 rounded-full bg-success/10 flex items-center justify-center animate-bounce-in">
              <CheckCircle2 className="w-10 h-10 text-success" />
            </div>
          </div>
          <h2 className="text-2xl font-bold tracking-tight font-heading">Order Confirmed!</h2>
          <p className="text-muted-foreground mt-1">Thank you for shopping with ABFRL</p>
        </div>

        <div className="space-y-4">
          <Card className="border-0 shadow-soft animate-fade-in">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Order ID</p>
                  <p className="font-mono text-sm font-medium mt-0.5">{orderId.slice(0, 8)}...</p>
                </div>
                <Button variant="ghost" size="icon" onClick={handleCopyOrderId}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground">Session ID</p>
                <p className="font-mono text-sm font-medium mt-0.5">{sessionId}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-soft animate-fade-in" style={{ animationDelay: '100ms' }}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">Track Your Order</h3>
                  <p className="text-sm text-muted-foreground">Monitor your order status and delivery updates</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                    <span className="text-sm font-medium">Order Confirmed</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Just now</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg opacity-60">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
                    <span className="text-sm text-muted-foreground">Processing</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Upcoming</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg opacity-60">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
                    <span className="text-sm text-muted-foreground">Ready for Pickup</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Upcoming</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <Button 
                  variant="outline" 
                  className="w-full rounded-lg"
                  onClick={() => {
                    toast.info('Order tracking coming soon!', {
                      description: 'You\'ll receive updates via email and SMS'
                    });
                  }}
                >
                  <Truck className="w-4 h-4 mr-2" />
                  View Full Order Details
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-soft animate-fade-in" style={{ animationDelay: '200ms' }}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <QrCode className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">In-Store Pickup</h3>
                  <p className="text-xs text-muted-foreground">Show QR code at any ABFRL store</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowQR(!showQR)}
                  className="rounded-lg"
                >
                  {showQR ? 'Hide' : 'Show QR'}
                </Button>
              </div>
              
              {showQR && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center py-4"
                >
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="p-4 bg-white rounded-xl shadow-soft mb-3"
                  >
                    <QRCode value={qrData} size={200} />
                  </motion.div>
                  <p className="text-xs text-muted-foreground text-center max-w-sm">
                    Show this QR code at any ABFRL store for order pickup
                  </p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <div className="sticky bottom-0 p-5 bg-background border-t border-border shadow-elevated space-y-3">
        <Button 
          className="w-full h-12 text-base font-semibold rounded-lg bg-[#25D366] hover:bg-[#20BA5A] text-white"
          onClick={() => {
            navigate('/whatsapp', {
              state: {
                orderData: orderData || {
                  orderId,
                  productName: cart[0]?.product?.name || 'Product',
                  userName: currentUser?.name || 'Customer',
                  product: cart[0]?.product
                }
              }
            });
          }}
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          Continue on WhatsApp
        </Button>
        <Button 
          variant="outline"
          className="w-full h-12 text-base font-semibold rounded-lg"
          onClick={() => {
            setCurrentUser(null);
            navigate('/');
          }}
        >
          <Home className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>
      </div>
    </>
  );
};

export default Confirmation;
