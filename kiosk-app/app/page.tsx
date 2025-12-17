"use client"

import { useState, useEffect, useCallback } from "react"
import { KioskHome } from "@/components/kiosk/kiosk-home"
import { SessionLoading } from "@/components/kiosk/session-loading"
import { WelcomeBack } from "@/components/kiosk/welcome-back"
import { ProductLocation } from "@/components/kiosk/product-location"
import { OutOfStock } from "@/components/kiosk/out-of-stock"
import { CheckoutSummary } from "@/components/kiosk/checkout-summary"
import { OrderConfirmation } from "@/components/kiosk/order-confirmation"
import { BrowseStore } from "@/components/kiosk/browse-store"
import { KioskContext, type CartItem, type UserSession } from "@/lib/kiosk-context"
import { supabase } from "@/lib/supabase/client"
import type { Tables } from "@/lib/supabase/types"

export type KioskScreen = "home" | "loading" | "welcome" | "find-product" | "out-of-stock" | "checkout" | "confirmation" | "browse"

// Generate a unique kiosk session ID that will be displayed as QR code
const generateKioskSessionId = () => {
  return `KIOSK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
}

const aisles = [1, 2, 3, 4, 5, 6]
const positions = ["Right", "Left", "Center"]

export default function KioskPage() {
  // Kiosk session ID - displayed as QR code, generated only on client to avoid hydration mismatch
  const [kioskSessionId, setKioskSessionId] = useState<string>("")
  
  // Generate session ID only on client side
  useEffect(() => {
    setKioskSessionId(generateKioskSessionId())
  }, [])
  
  const [currentScreen, setCurrentScreen] = useState<KioskScreen>("home")
  const [sessionId, setSessionId] = useState<string>("") // Scanned session ID from mobile app
  const [userSession, setUserSession] = useState<UserSession | null>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState<CartItem | null>(null)
  const [idleTime, setIdleTime] = useState(0)
  const [orderId, setOrderId] = useState<string>("")
  const [orderTotal, setOrderTotal] = useState<number>(0)
  const [orderItemsCount, setOrderItemsCount] = useState<number>(0)
  const [orderPointsEarned, setOrderPointsEarned] = useState<number>(0)

  const IDLE_TIMEOUT = 300 // 5 minutes in seconds

  const resetIdleTimer = useCallback(() => {
    setIdleTime(0)
  }, [])

  // Idle timeout handler
  useEffect(() => {
    if (currentScreen === "home") return

    const interval = setInterval(() => {
      setIdleTime((prev) => {
        if (prev >= IDLE_TIMEOUT) {
          handleReturnHome()
          return 0
        }
        return prev + 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [currentScreen])

  // Reset idle timer on user interaction
  useEffect(() => {
    const handleActivity = () => resetIdleTimer()
    window.addEventListener("click", handleActivity)
    window.addEventListener("touchstart", handleActivity)
    window.addEventListener("keydown", handleActivity)

    return () => {
      window.removeEventListener("click", handleActivity)
      window.removeEventListener("touchstart", handleActivity)
      window.removeEventListener("keydown", handleActivity)
    }
  }, [resetIdleTimer])

  const handleScanComplete = async (scannedSessionId: string) => {
    setSessionId(scannedSessionId)
    setCurrentScreen("loading")

    try {
      // Fetch user data from cart (get first user_id from cart items with this session_id)
      const { data: cartData, error: cartError } = await supabase
        .from("cart")
        .select(`
          *,
          product:products(*),
          user:users(*)
        `)
        .eq("session_id", scannedSessionId)

      if (cartError) {
        console.error("Error fetching cart:", cartError)
        // Fallback to mock data for demo
        setTimeout(() => {
          setUserSession({
            id: scannedSessionId,
            userName: "Guest",
            avatar: "/placeholder-user.jpg",
            loyaltyPoints: 0,
            isGoldMember: false,
          })
          setCartItems([])
          setCurrentScreen("welcome")
        }, 2000)
        return
      }

      if (!cartData || cartData.length === 0) {
        // No cart items found for this session
        setTimeout(() => {
          setUserSession({
            id: scannedSessionId,
            userName: "Guest",
            avatar: "/placeholder-user.jpg",
            loyaltyPoints: 0,
            isGoldMember: false,
          })
          setCartItems([])
          setCurrentScreen("welcome")
        }, 2000)
        return
      }

      // Get user from first cart item
      const firstCartItem = cartData[0]
      const user = firstCartItem.user as Tables<"users">
      
      // Map cart items to CartItem format
      const mappedCartItems: CartItem[] = cartData.map((item) => {
        const product = item.product as Tables<"products">
        const quantity = item.quantity || 1
        const stockCount = product.stock_count || 0
        
        // Determine size from product or use default
        const sizes = product.size || []
        const defaultSize = sizes[0] || "M"
        
        // Use Case 3: Priya's product (W White Floral Printed Round Neck Cotton Top) should be out of stock
        const isPriyasProduct = product.name.toLowerCase().includes('w white floral') || 
                              product.name.toLowerCase().includes('white floral printed round neck');
        const finalStockCount = isPriyasProduct ? 0 : stockCount; // Force out of stock for Priya's product
        
        // Mock location based on product (in real app, this would come from inventory system)
        // Randomize aisle locations for variety
        const aisles = [1, 2, 3, 4, 5, 6]
        const positions = ["Right", "Left", "Center"]
        const randomAisle = aisles[Math.floor(Math.random() * aisles.length)]
        const randomPosition = positions[Math.floor(Math.random() * positions.length)]
        const location = finalStockCount > 0 ? `Aisle ${randomAisle}, ${randomPosition}` : null

        return {
          id: item.id,
          productId: product.id,
          name: product.name,
          size: defaultSize,
          price: product.price * quantity,
          quantity: quantity,
          image: product.image_url || "/placeholder.jpg",
          inStock: finalStockCount > 0,
          location: location,
        }
      })

      // Map user to UserSession format
      const loyaltyTier = (user.loyalty_tier as 'Gold' | 'Silver' | 'Bronze') || 'Bronze'
      const mappedUserSession: UserSession = {
        id: user.id,
        userName: user.name,
        avatar: user.avatar_url || "/placeholder-user.jpg",
        loyaltyPoints: user.loyalty_points || 0,
        loyaltyTier: loyaltyTier,
        isGoldMember: loyaltyTier === "Gold",
      }

      // Simulate loading delay for better UX
      setTimeout(() => {
        setUserSession(mappedUserSession)
        setCartItems(mappedCartItems)
        setCurrentScreen("welcome")
      }, 2000)
    } catch (error) {
      console.error("Error loading session:", error)
      // Fallback to empty state
      setTimeout(() => {
        setUserSession({
          id: scannedSessionId,
          userName: "Guest",
          avatar: "/placeholder-user.jpg",
          loyaltyPoints: 0,
          isGoldMember: false,
        })
        setCartItems([])
        setCurrentScreen("welcome")
      }, 2000)
    }
  }

  const handleReturnHome = () => {
    setCurrentScreen("home")
    setSessionId("")
    setUserSession(null)
    setCartItems([])
    setSelectedProduct(null)
    setIdleTime(0)
    setOrderId("")
    setOrderTotal(0)
    setOrderItemsCount(0)
    setOrderPointsEarned(0)
  }

  const handleFindProduct = (product: CartItem) => {
    setSelectedProduct(product)
    if (product.inStock) {
      setCurrentScreen("find-product")
    } else {
      setCurrentScreen("out-of-stock")
    }
  }

  const mapProductToCartItem = (product: Tables<"products">): CartItem => {
    const quantity = 1
    const stockCount = product.stock_count || 0
    const sizes = product.size || []
    const defaultSize = sizes[0] || "M"
    const randomAisle = aisles[Math.floor(Math.random() * aisles.length)]
    const randomPosition = positions[Math.floor(Math.random() * positions.length)]
    const location = stockCount > 0 ? `Aisle ${randomAisle}, ${randomPosition}` : null

    return {
      id: product.id,
      productId: product.id,
      name: product.name,
      size: defaultSize,
      price: product.price * quantity,
      quantity,
      image: product.image_url || "/placeholder.jpg",
      inStock: stockCount > 0,
      location,
    }
  }

  const handleBrowseStore = () => {
    // Go to dedicated browse screen; it will fetch and show products grouped by brand
    setCurrentScreen("browse")
  }

  const handleCheckout = () => {
    setCurrentScreen("checkout")
  }

  const handleCompleteOrder = async () => {
    if (!userSession || cartItems.length === 0) {
      console.error("Cannot complete order: missing user or cart items")
      return
    }

    try {
      // Calculate totals with tier-based discount
      const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0)
      
      // Tier-based discount: Gold 30%, Silver 20%, Bronze 10%
      const tierMultipliers: Record<string, number> = {
        'Gold': 0.30,
        'Silver': 0.20,
        'Bronze': 0.10
      };
      const tier = userSession.loyaltyTier || 'Bronze'
      const maxDiscountPercent = tierMultipliers[tier] || 0.10
      const loyaltyDiscount = Math.min(userSession.loyaltyPoints || 0, subtotal * maxDiscountPercent)
      
      const total = subtotal - loyaltyDiscount
      
      // Calculate loyalty points earned (5% of total purchase)
      const pointsEarned = Math.floor(total * 0.05)
      
      // Store order details before clearing cart
      setOrderTotal(total)
      setOrderItemsCount(cartItems.length)
      setOrderPointsEarned(pointsEarned)

      // Create order in Supabase
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: userSession.id,
          session_id: sessionId,
          total_amount: total,
          discount_applied: loyaltyDiscount,
          order_status: "confirmed",
        })
        .select()
        .single()

      if (orderError) {
        console.error("Error creating order:", orderError)
        // Still show confirmation with generated ID for demo
        // Store order details even on error
        const pointsEarned = Math.floor(total * 0.05)
        setOrderTotal(total)
        setOrderItemsCount(cartItems.length)
        setOrderPointsEarned(pointsEarned)
        setOrderId(`ORD-2025-${Math.floor(1000 + Math.random() * 9000)}`)
        setCurrentScreen("confirmation")
        return
      }

        // Create order items
        if (orderData) {
          const orderItems = cartItems.map((item) => ({
            order_id: orderData.id,
            product_id: item.productId,
            quantity: item.quantity,
            price: item.price / item.quantity, // Price per unit
          }))

        const { error: itemsError } = await supabase
          .from("order_items")
          .insert(orderItems)

        if (itemsError) {
          console.error("Error creating order items:", itemsError)
        }

        // Clear cart for this session (this will auto-update in mobile app via Supabase)
        const { error: cartDeleteError } = await supabase
          .from("cart")
          .delete()
          .eq("session_id", sessionId)
          .eq("user_id", userSession.id)

        if (cartDeleteError) {
          console.error("Error clearing cart:", cartDeleteError)
        } else {
          // Clear local cart state as well
          setCartItems([])
        }

        setOrderId(orderData.id)
      } else {
        // Fallback: store order details even if orderData is null
        const pointsEarned = Math.floor(total * 0.05)
        setOrderTotal(total)
        setOrderItemsCount(cartItems.length)
        setOrderPointsEarned(pointsEarned)
        setOrderId(`ORD-2025-${Math.floor(1000 + Math.random() * 9000)}`)
      }

      setCurrentScreen("confirmation")
    } catch (error) {
      console.error("Error completing order:", error)
      // Fallback: calculate and store order details
      const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0)
      const tierMultipliers: Record<string, number> = {
        'Gold': 0.30,
        'Silver': 0.20,
        'Bronze': 0.10
      };
      const tier = userSession?.loyaltyTier || 'Bronze'
      const maxDiscountPercent = tierMultipliers[tier] || 0.10
      const loyaltyDiscount = Math.min(userSession?.loyaltyPoints || 0, subtotal * maxDiscountPercent)
      const total = subtotal - loyaltyDiscount
      const pointsEarned = Math.floor(total * 0.05)
      setOrderTotal(total)
      setOrderItemsCount(cartItems.length)
      setOrderPointsEarned(pointsEarned)
      setOrderId(`ORD-2025-${Math.floor(1000 + Math.random() * 9000)}`)
      setCurrentScreen("confirmation")
    }
  }

  const remainingTime = IDLE_TIMEOUT - idleTime
  const minutes = Math.floor(remainingTime / 60)
  const seconds = remainingTime % 60

  return (
    <KioskContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        sessionId,
        kioskSessionId,
        userSession,
        cartItems,
        selectedProduct,
        setSelectedProduct,
        handleScanComplete,
        handleReturnHome,
        handleFindProduct,
        handleBrowseStore,
        handleCheckout,
        handleCompleteOrder,
        idleTimeRemaining: `${minutes}:${seconds.toString().padStart(2, "0")}`,
        orderId,
        orderTotal,
        orderItemsCount,
        orderPointsEarned,
      }}
    >
      <main className="min-h-screen w-full bg-gradient-to-br from-background to-muted">
        {currentScreen === "home" && <KioskHome />}
        {currentScreen === "loading" && <SessionLoading />}
        {currentScreen === "welcome" && <WelcomeBack />}
        {currentScreen === "find-product" && <ProductLocation />}
        {currentScreen === "out-of-stock" && <OutOfStock />}
        {currentScreen === "checkout" && <CheckoutSummary />}
        {currentScreen === "confirmation" && <OrderConfirmation />}
        {currentScreen === "browse" && <BrowseStore />}
      </main>
    </KioskContext.Provider>
  )
}
