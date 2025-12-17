"use client"

import { useState } from "react"
import { ShoppingBag, MapPin, CreditCard, Search, MessageCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useKiosk } from "@/lib/kiosk-context"
import { KioskHeader } from "@/components/kiosk/kiosk-header"
import { OutOfStockModal } from "@/components/kiosk/out-of-stock-modal"
import Image from "next/image"

// Get avatar URL based on user profile
const getAvatarUrl = (avatarUrl: string | null | undefined, userName: string | null | undefined): string => {
  const name = (userName || '').toLowerCase();
  
  // Always use custom local avatar images based on user name (ignore database avatar_url)
  if (name.includes('aarav')) {
    // Aarav: Gen Z, Casual, Bewakoof fan - young male avatar
    return '/aarav.jpg';
  } else if (name.includes('rohan')) {
    // Rohan: Professional, Finance Professional - professional male avatar
    return '/rohan.jpg';
  } else if (name.includes('priya')) {
    // Priya: Premium Gold member, Ethnic & Traditional wear - elegant female avatar with traditional styling
    return '/priya.jpg';
  }
  
  // If avatarUrl is provided and user name doesn't match, use it
  if (avatarUrl) {
    return avatarUrl;
  }
  
  // Default fallback
  return "/placeholder-user.jpg";
};

export function WelcomeBack() {
  const { userSession, cartItems, handleFindProduct, handleCheckout, handleBrowseStore, setCurrentScreen, sessionId } = useKiosk()
  const [showOutOfStockModal, setShowOutOfStockModal] = useState(false)
  const [selectedOutOfStockProduct, setSelectedOutOfStockProduct] = useState<any>(null)

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0)

  const actionCards = [
    {
      icon: MapPin,
      title: "Find Products",
      description: "Locate items in-store",
      action: "Find Now",
      onClick: () => {
        const inStockItem = cartItems.find((item) => item.inStock)
        if (inStockItem) handleFindProduct(inStockItem)
      },
    },
    {
      icon: CreditCard,
      title: "Check Out",
      description: "Complete your purchase now",
      action: "Proceed",
      onClick: handleCheckout,
    },
    {
      icon: Search,
      title: "Browse More",
      description: "Discover similar products",
      action: "Explore",
      onClick: handleBrowseStore,
    },
    {
      icon: MessageCircle,
      title: "Ask Agent",
      description: "Get help from our AI assistant",
      action: "Chat Now",
      onClick: () => {
        // For demo: Show a message or could open chat interface
        alert("AI Assistant feature - Coming soon! For now, you can ask store associates for help.")
      },
    },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Left Sidebar */}
      <aside className="w-[40%] bg-muted p-8 flex flex-col">
        {/* User Info */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-background mb-4 shadow-soft">
            {(() => {
              const avatarSrc = getAvatarUrl(userSession?.avatar, userSession?.userName);
              console.log('Avatar URL:', avatarSrc, 'User:', userSession?.userName);
              return (
                <img
                  src={avatarSrc}
                  alt="User avatar"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    console.error('Image failed to load:', avatarSrc);
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder-user.jpg";
                  }}
                  onLoad={() => {
                    console.log('Image loaded successfully:', avatarSrc);
                  }}
                />
              );
            })()}
          </div>
          <h2 className="text-3xl font-heading font-bold text-foreground">
            {userSession?.loyaltyTier === 'Gold' ? '✨ Welcome back, ' : 'Welcome back, '}
            {userSession?.userName}! 👋
          </h2>
          <p className="text-base font-mono text-primary mt-2">Session: {sessionId}</p>
          
          {/* VIP Treatment for Gold Members */}
          {userSession?.loyaltyTier === 'Gold' && (
            <div className="mt-4 bg-loyalty-gold/10 border border-loyalty-gold/30 rounded-lg p-3 w-full text-center shadow-soft">
              <p className="text-sm font-semibold" style={{ color: 'hsl(var(--loyalty-gold))' }}>
                ✨ Gold Member Exclusive: 30% discount on all items
              </p>
            </div>
          )}
        </div>

        <div className="h-px bg-border mb-6" />

        {/* Cart */}
        <div className="flex-1 overflow-y-auto">
          <h3 className="text-xl font-heading font-bold text-foreground mb-4 flex items-center gap-2">
            <ShoppingBag className="h-6 w-6" />
            YOUR CART ({cartItems.length} items)
          </h3>

          <div className="space-y-4">
            {cartItems.map((item) => {
              // Check if this is Priya's product (W White Floral Printed Round Neck Cotton Top)
              const isPriyasProduct = item.name.toLowerCase().includes('w white floral') || 
                                    item.name.toLowerCase().includes('white floral printed round neck');
              
              return (
                <Card
                  key={item.id}
                  className="p-4 flex gap-4 cursor-pointer hover:shadow-medium transition-shadow shadow-soft"
                  onClick={() => {
                    if (!item.inStock && isPriyasProduct) {
                      // Show overlay modal for Priya's product
                      setSelectedOutOfStockProduct(item);
                      setShowOutOfStockModal(true);
                    } else {
                      // Normal flow for other products
                      handleFindProduct(item);
                    }
                  }}
                >
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={60}
                    height={60}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Size {item.size}</p>
                    <p className="text-lg font-bold text-foreground">₹{item.price.toLocaleString()}</p>
                  </div>
                  {!item.inStock && (
                    <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full h-fit">
                      Out of stock
                    </span>
                  )}
                </Card>
              );
            })}
          </div>
        </div>

        <div className="h-px bg-border my-6" />

        {/* Subtotal */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-lg text-muted-foreground">Subtotal:</span>
          <span className="text-2xl font-bold text-foreground">₹{subtotal.toLocaleString()}</span>
        </div>

        <Button variant="outline" size="lg" className="w-full h-14 text-lg bg-transparent">
          View Full Cart
        </Button>
      </aside>

      {/* Right Content */}
      <main className="flex-1 flex flex-col">
        <KioskHeader />

        <div className="flex-1 p-10">
          <h2 className="text-4xl font-heading font-bold text-foreground mb-8">What would you like to do? 🛍️</h2>

          {/* Action Cards Grid */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {actionCards.map((card) => (
              <Card
                key={card.title}
                className="p-8 cursor-pointer hover:scale-[1.03] hover:shadow-medium transition-all duration-300 shadow-soft"
                onClick={card.onClick}
              >
                <card.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-2xl font-heading font-bold text-foreground mb-2">{card.title}</h3>
                <p className="text-lg text-muted-foreground mb-6">{card.description}</p>
                <Button className="h-12 px-6 text-base">
                  {card.action}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Card>
            ))}
          </div>

          {/* Tip Box */}
          <Card className="p-6 border-l-4 border-l-primary bg-primary/5 shadow-soft">
            <p className="text-lg text-foreground">
              <span className="font-bold">👉 Tip:</span> Your cart is synced across all devices. Continue on mobile
              anytime!
            </p>
          </Card>
        </div>
      </main>

      {/* Out of Stock Modal for Priya's Product */}
      {showOutOfStockModal && selectedOutOfStockProduct && (
        <OutOfStockModal
          product={selectedOutOfStockProduct}
          onClose={() => {
            setShowOutOfStockModal(false);
            setSelectedOutOfStockProduct(null);
          }}
          onHomeDelivery={() => {
            setShowOutOfStockModal(false);
            setSelectedOutOfStockProduct(null);
            handleCheckout();
          }}
        />
      )}
    </div>
  )
}
