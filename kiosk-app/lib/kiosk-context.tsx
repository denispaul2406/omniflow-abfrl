"use client"

import { createContext, useContext } from "react"
import type { KioskScreen } from "@/app/page"

export interface CartItem {
  id: string // Cart item ID
  productId: string // Product ID from database
  name: string
  size: string
  price: number
  quantity: number
  image: string
  inStock: boolean
  location: string | null
}

export interface UserSession {
  id: string
  userName: string
  avatar: string
  loyaltyPoints: number
  loyaltyTier: 'Gold' | 'Silver' | 'Bronze'
  isGoldMember: boolean
}

interface KioskContextType {
  currentScreen: KioskScreen
  setCurrentScreen: (screen: KioskScreen) => void
  sessionId: string
  kioskSessionId: string // The session ID displayed as QR code on kiosk
  userSession: UserSession | null
  cartItems: CartItem[]
  selectedProduct: CartItem | null
  setSelectedProduct: (product: CartItem | null) => void
  handleScanComplete: (sessionId: string) => void
  handleReturnHome: () => void
  handleFindProduct: (product: CartItem) => void
  handleBrowseStore: () => Promise<void>
  handleCheckout: () => void
  handleCompleteOrder: () => void
  idleTimeRemaining: string
  orderId: string
  orderTotal: number
  orderItemsCount: number
  orderPointsEarned: number
}

export const KioskContext = createContext<KioskContextType | null>(null)

export function useKiosk() {
  const context = useContext(KioskContext)
  if (!context) {
    throw new Error("useKiosk must be used within KioskContext.Provider")
  }
  return context
}
