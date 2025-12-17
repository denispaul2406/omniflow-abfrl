"use client"

import { useEffect, useState, useRef } from "react"
import { CheckCircle, Package, Truck, Smartphone, QrCode, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useKiosk } from "@/lib/kiosk-context"
import { supabase } from "@/lib/supabase/client"

export function OrderConfirmation() {
  const { orderId, cartItems, userSession, handleReturnHome, orderTotal, orderItemsCount, orderPointsEarned } = useKiosk()
  const [showConfetti, setShowConfetti] = useState(true)
  const [autoReturn, setAutoReturn] = useState(30)
  const hasReturnedRef = useRef(false)

  // Use stored order values if available, otherwise calculate from cartItems (fallback)
  const total = orderTotal > 0 ? orderTotal : cartItems.reduce((sum, item) => sum + item.price, 0)
  const itemsCount = orderItemsCount > 0 ? orderItemsCount : cartItems.length
  const pointsEarned = orderPointsEarned > 0 ? orderPointsEarned : Math.floor(total * 0.05)
  
  const inStoreItems = cartItems.filter((item) => item.inStock).length
  const deliveryItems = cartItems.filter((item) => !item.inStock)
  const deliveryItemsCount = deliveryItems.length

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setAutoReturn((prev) => {
        const newValue = prev - 1
        if (newValue <= 0 && !hasReturnedRef.current) {
          hasReturnedRef.current = true
          // Clear interval first
          clearInterval(interval)
          // Defer the parent state update to avoid updating during render
          setTimeout(() => {
            handleReturnHome()
          }, 0)
        }
        return newValue
      })
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [handleReturnHome])

  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-5%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ["#CF2E2E", "#F68529", "#C58A24"][Math.floor(Math.random() * 3)],
                width: "10px",
                height: "10px",
                borderRadius: Math.random() > 0.5 ? "50%" : "0",
              }}
            />
          ))}
        </div>
      )}

      <Card className="max-w-3xl w-full p-12 shadow-soft text-center relative">
        {/* Success Animation */}
        <div className="mb-8 flex justify-center">
          <div className="w-32 h-32 rounded-full bg-success/10 flex items-center justify-center animate-scale-in">
            <CheckCircle className="w-20 h-20 text-success" />
          </div>
        </div>

        <h1 className="text-5xl font-heading font-bold text-foreground mb-6">Order Confirmed! 🎉</h1>

        {/* Order Details */}
        <Card className="p-6 bg-muted mb-8 inline-block shadow-soft">
          <p className="text-2xl font-mono text-primary mb-3">Order ID: {orderId}</p>
          <div className="text-lg text-foreground space-y-1">
            <p>Items: {itemsCount}</p>
            <p>Total Paid: ₹{total.toLocaleString()}</p>
            <p className="font-semibold" style={{ color: 'hsl(var(--loyalty-gold))' }}>Loyalty Points Earned: {pointsEarned}</p>
          </div>
        </Card>

        {/* What's Next */}
        <div className="text-left mb-8">
          <h3 className="text-2xl font-heading font-bold text-foreground mb-4">What's Next?</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-lg">
              <Package className="h-6 w-6 text-success" />
              <span>Pick up your in-store items at checkout</span>
            </div>
            {deliveryItemsCount > 0 && (
              <div className="flex items-center gap-3 text-lg">
                <Truck className="h-6 w-6 text-primary" />
                <span>
                  {deliveryItemsCount === 1
                    ? `${deliveryItems[0].name} delivery tomorrow by 6 PM`
                    : `${deliveryItemsCount} items delivery tomorrow by 6 PM`}
                </span>
              </div>
            )}
            <div className="flex items-center gap-3 text-lg">
              <Smartphone className="h-6 w-6 text-secondary" />
              <span>Track order on your mobile app</span>
            </div>
          </div>
        </div>

        {/* QR Code */}
        <Card className="p-6 bg-background inline-block mb-8 shadow-soft">
          <div className="w-44 h-44 bg-muted rounded-xl flex items-center justify-center mb-3 mx-auto">
            <QrCode className="w-32 h-32 text-foreground" />
          </div>
          <p className="text-muted-foreground">Scan to track order on mobile</p>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-4 w-full max-w-md">
            <Button 
              size="lg" 
              className="flex-1 h-16 text-xl bg-[#25D366] hover:bg-[#20BA5A] text-white"
              onClick={async () => {
                // Open mobile app WhatsApp page with order data
                // Get full product details from Supabase if we have productId
                let productData = null;
                if (cartItems[0]?.productId) {
                  try {
                    const { data } = await supabase
                      .from('products')
                      .select('*')
                      .eq('id', cartItems[0].productId)
                      .single();
                    if (data) {
                      productData = data;
                    }
                  } catch (e) {
                    console.error('Error fetching product:', e);
                  }
                }
                
                const orderData = {
                  orderId,
                  productName: cartItems[0]?.name || 'Product',
                  userName: userSession?.userName || 'Customer',
                  fromKiosk: true,
                  product: productData || (cartItems[0] ? {
                    id: cartItems[0].productId,
                    name: cartItems[0].name,
                    brand: cartItems[0].name.split(' ')[0], // Fallback: extract brand from name
                    price: cartItems[0].price,
                    image_url: cartItems[0].image,
                    category: null
                  } : null)
                };
                
                // Encode order data to pass via URL
                const encodedData = encodeURIComponent(JSON.stringify(orderData));
                // Open mobile app WhatsApp page (mobile app runs on port 8080)
                window.open(`http://localhost:8080/whatsapp?data=${encodedData}`, '_blank');
              }}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Continue on WhatsApp
            </Button>
            <Button 
              size="lg" 
              className="flex-1 h-16 px-8 text-xl" 
              variant="outline"
              onClick={handleReturnHome}
            >
              Done
            </Button>
          </div>
          <p className="text-muted-foreground">Auto-return in {autoReturn} seconds...</p>
        </div>
      </Card>
    </div>
  )
}
