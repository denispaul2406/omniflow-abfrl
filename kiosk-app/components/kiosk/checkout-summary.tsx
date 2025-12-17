"use client"

import { useState } from "react"
import { ArrowLeft, CreditCard, Smartphone, Banknote, Lock, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useKiosk } from "@/lib/kiosk-context"
import { KioskHeader } from "@/components/kiosk/kiosk-header"

type PaymentMethod = "card" | "upi" | "cash" | null

export function CheckoutSummary() {
  const { cartItems, userSession, setCurrentScreen, handleCompleteOrder } = useKiosk()
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0)
  
  // Tier-based discount: Gold 30%, Silver 20%, Bronze 10%
  const tierMultipliers: Record<string, number> = {
    'Gold': 0.30,
    'Silver': 0.20,
    'Bronze': 0.10
  };
  const tier = userSession?.loyaltyTier || 'Bronze'
  const maxDiscountPercent = tierMultipliers[tier] || 0.10
  const loyaltyDiscount = Math.min(userSession?.loyaltyPoints || 0, subtotal * maxDiscountPercent)
  
  const deliveryFee = 0 // Free for gold members
  const total = subtotal - loyaltyDiscount + deliveryFee
  
  // Get out-of-stock items that will be delivered
  const deliveryItems = cartItems.filter((item) => !item.inStock)
  const deliveryItemNames = deliveryItems.map((item) => item.name).join(", ") || "None"

  const paymentMethods = [
    { id: "card" as const, icon: CreditCard, label: "Card" },
    { id: "upi" as const, icon: Smartphone, label: "UPI" },
    { id: "cash" as const, icon: Banknote, label: "Cash" },
  ]

  const handleComplete = () => {
    if (!selectedPayment) return
    setIsProcessing(true)
    setTimeout(() => {
      handleCompleteOrder()
    }, 1500)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <KioskHeader />

      <main className="flex-1 flex items-center justify-center p-8">
        <Card className="max-w-4xl w-full p-10 shadow-soft">
          <Button variant="ghost" className="mb-6 text-lg" onClick={() => setCurrentScreen("welcome")}>
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Button>

          <h2 className="text-4xl font-heading font-bold text-foreground text-center mb-8">CHECKOUT</h2>

          {/* Order Summary */}
          <Card className="p-8 bg-primary/5 mb-8 shadow-soft">
            <h3 className="text-2xl font-semibold text-foreground mb-6">Order Summary</h3>
            <div className="h-px bg-border mb-6" />

            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-lg">
                  <span className="text-foreground">
                    {item.name} ({item.size})
                    {!item.inStock && <span className="text-sm text-muted-foreground ml-2">(delivery)</span>}
                  </span>
                  <span className="font-semibold">₹{item.price.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="h-px bg-border my-6" />

            <div className="space-y-3">
              <div className="flex justify-between text-lg">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg text-success">
                <span>Loyalty Discount ({loyaltyDiscount} pts):</span>
                <span>-₹{loyaltyDiscount.toLocaleString()}</span>
              </div>
              {deliveryItems.length > 0 && (
                <div className="flex justify-between text-lg">
                  <span className="text-muted-foreground">
                    Delivery ({deliveryItems.length === 1 ? deliveryItems[0].name : `${deliveryItems.length} items`}):
                  </span>
                  <span className="text-success flex items-center gap-1">
                    Free <Check className="h-4 w-4" />
                  </span>
                </div>
              )}
            </div>

            <div className="h-px bg-border my-6" />

            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-foreground">TOTAL:</span>
              <span className="text-3xl font-bold text-foreground">₹{total.toLocaleString()}</span>
            </div>
          </Card>

          {/* Payment Methods */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-4">Payment Method:</h3>
            <div className="flex gap-4">
              {paymentMethods.map((method) => (
                <Card
                  key={method.id}
                  className={`flex-1 p-6 cursor-pointer transition-all hover:shadow-medium ${
                    selectedPayment === method.id
                      ? "border-2 border-primary bg-primary/5 shadow-soft"
                      : "border-2 border-transparent shadow-soft"
                  }`}
                  onClick={() => setSelectedPayment(method.id)}
                >
                  <div className="flex flex-col items-center gap-3">
                    <method.icon className="h-10 w-10 text-foreground" />
                    <span className="text-lg font-semibold">{method.label}</span>
                    {selectedPayment === method.id && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Complete Button */}
          <Button
            size="lg"
            className="w-full h-16 text-2xl font-semibold animate-pulse-gentle"
            onClick={handleComplete}
            disabled={!selectedPayment || isProcessing}
          >
            {isProcessing ? "Processing..." : "Complete Purchase"}
          </Button>

          <p className="text-center text-muted-foreground mt-4 flex items-center justify-center gap-2">
            <Lock className="h-4 w-4" />
            Secure payment via ABFRL POS
          </p>
        </Card>
      </main>
    </div>
  )
}
