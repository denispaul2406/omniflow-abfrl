import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Store, QrCode, ShoppingCart, ArrowRight, MapPin, X, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRScanner } from '@/components/QRScanner';
import { BANGALORE_STORES, checkStoreInventory } from '@/lib/storeInventory';

const TryBeforeBuy = () => {
  const { currentUser, cart, sessionId } = useApp();
  const navigate = useNavigate();
  const [showScanner, setShowScanner] = useState(false);
  const [showStores, setShowStores] = useState(false);
  const [storeInventory, setStoreInventory] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [currentUser, cart, navigate]);

  if (!currentUser || cart.length === 0) return null;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      
      <main className="flex-1 px-5 py-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Store className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight font-heading mb-3">
            Want to try before you buy? 👔
          </h2>
          <p className="text-muted-foreground text-base max-w-md mx-auto">
            Visit any ABFRL store and scan the QR code displayed on our kiosk screen. Your cart and preferences will instantly sync—no re-entering info!
          </p>
        </motion.div>

        {/* Session ID prominently displayed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-6"
        >
          <Card className="border-0 shadow-soft">
            <CardContent className="p-5">
              <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-2 font-medium">Your Session ID:</p>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <code className="text-xl font-mono font-bold text-primary">
                    {sessionId}
                  </code>
                </div>
                <p className="text-xs text-muted-foreground">
                  Use this to continue shopping on other devices or in-store
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Options Cards */}
        <div className="space-y-4 mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card className="border-0 shadow-soft hover:shadow-medium transition-shadow group">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                    <QrCode className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">Visit In-Store</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Scan the QR code displayed on the kiosk screen. Your cart will sync instantly!
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-lg"
                      onClick={() => setShowScanner(true)}
                    >
                      Scan Kiosk QR Code
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Card className="border-0 shadow-soft hover:shadow-medium transition-shadow cursor-pointer group"
                  onClick={() => navigate('/checkout')}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <ShoppingCart className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">Continue Online</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Complete your purchase online and get it delivered or pick up in-store.
                    </p>
                    <Button size="sm" className="rounded-lg">
                      Proceed to Checkout
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Store Locator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Button 
            variant="outline" 
            className="w-full rounded-lg"
            onClick={async () => {
              setShowStores(true);
              // Check inventory for first cart item
              if (cart.length > 0 && cart[0].product) {
                const inventory = await checkStoreInventory(
                  cart[0].product.id,
                  cart[0].product.size?.[0] || 'M'
                );
                const stockMap: Record<string, number> = {};
                inventory.forEach(store => {
                  stockMap[store.storeId] = store.products[0]?.stock || 0;
                });
                setStoreInventory(stockMap);
              }
            }}
          >
            <MapPin className="w-4 h-4 mr-2" />
            Find Nearest ABFRL Store
          </Button>
        </motion.div>

        {/* Store List Modal */}
        <AnimatePresence>
          {showStores && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowStores(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-background rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto"
              >
                <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold font-heading">ABFRL Stores in Bangalore</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowStores(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-4 space-y-3">
                  {BANGALORE_STORES.map((store) => {
                    const stock = storeInventory[store.id] ?? Math.floor(Math.random() * 5);
                    return (
                      <Card key={store.id} className="p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm mb-1">{store.name}</h4>
                            <p className="text-xs text-muted-foreground mb-1">{store.address}</p>
                            <p className="text-xs text-muted-foreground">{store.distance}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge 
                              variant={stock === 0 ? 'destructive' : 'default'}
                              className="text-xs"
                            >
                              {stock === 0 ? 'Out of stock' : `${stock} in stock`}
                            </Badge>
                            {store.phone && (
                              <Button variant="ghost" size="sm" className="h-7 text-xs">
                                <Phone className="w-3 h-3 mr-1" />
                                Call
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScanner
          onScanSuccess={() => {
            // Sync successful - scanner will auto-close
            console.log('QR scan successful - cart synced from kiosk');
          }}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
};

export default TryBeforeBuy;

