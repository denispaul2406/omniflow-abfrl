import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, CartItem, ChatMessage, Product } from '@/types';
import { supabase } from '@/integrations/supabase/client';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  sessionId: string;
  cart: CartItem[];
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateCartQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  messages: ChatMessage[];
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  cartTotal: number;
  loyaltyDiscount: number;
  refreshCart: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const generateSessionId = () => {
  return `SES-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [sessionId] = useState(() => generateSessionId());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const refreshCart = async () => {
    if (!currentUser) {
      setCart([]);
      return;
    }

    const { data, error } = await supabase
      .from('cart')
      .select(`
        *,
        product:products(*)
      `)
      .eq('user_id', currentUser.id)
      .eq('session_id', sessionId);

    if (!error && data) {
      setCart(data.map(item => ({
        ...item,
        product: item.product as Product
      })));
    }
  };

  useEffect(() => {
    if (currentUser) {
      refreshCart();
    } else {
      setCart([]);
    }
  }, [currentUser, sessionId]);

  const addToCart = async (product: Product) => {
    if (!currentUser) return;

    const existingItem = cart.find(item => item.product_id === product.id);

    if (existingItem) {
      await updateCartQuantity(existingItem.id, existingItem.quantity + 1);
    } else {
      const { error } = await supabase
        .from('cart')
        .insert({
          user_id: currentUser.id,
          product_id: product.id,
          quantity: 1,
          session_id: sessionId
        });

      if (!error) {
        await refreshCart();
      }
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('id', cartItemId);

    if (!error) {
      await refreshCart();
    }
  };

  const updateCartQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(cartItemId);
      return;
    }

    const { error } = await supabase
      .from('cart')
      .update({ quantity })
      .eq('id', cartItemId);

    if (!error) {
      await refreshCart();
    }
  };

  const clearCart = async () => {
    if (!currentUser) return;

    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('user_id', currentUser.id)
      .eq('session_id', sessionId);

    if (!error) {
      setCart([]);
    }
  };

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const cartTotal = cart.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);

  // Tier-based discount logic: Gold 30%, Silver 20%, Bronze 10%
  const getLoyaltyDiscount = (tier: string, points: number, total: number): number => {
    const tierMultipliers: Record<string, number> = {
      'Gold': 0.30,    // 30% max discount
      'Silver': 0.20,  // 20% max discount
      'Bronze': 0.10   // 10% max discount (default)
    };
    
    const maxDiscountPercent = tierMultipliers[tier] || 0.10;
    const maxDiscount = total * maxDiscountPercent;
    
    // Can't use more points than available
    return Math.min(points, maxDiscount);
  };

  const loyaltyDiscount = currentUser 
    ? getLoyaltyDiscount(currentUser.loyalty_tier, currentUser.loyalty_points, cartTotal)
    : 0;

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      sessionId,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      messages,
      addMessage,
      cartTotal,
      loyaltyDiscount,
      refreshCart
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
