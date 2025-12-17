import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { ArrowLeft, MoreVertical, Search, Phone, Video, Send, Clock, CheckCircle2, ShoppingCart, CreditCard, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { TimeLimitedOffer } from '@/components/TimeLimitedOffer';
import { getCrossBrandRecommendations, getRecommendationReason, filterProductsByGender, getUserGender } from '@/lib/recommendationEngine';
import { Product, User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface WhatsAppMessage {
  id: string;
  type: 'agent' | 'user';
  content: string;
  timestamp: Date;
  product?: Product & { discountPercent?: number; expiresIn?: number };
  actionButtons?: { text: string; action: string }[];
  isRead?: boolean;
}

const WhatsApp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, cart, addToCart, sessionId, setCurrentUser } = useApp();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('UPI');
  const [isFromKiosk, setIsFromKiosk] = useState(false);
  const initialMessageSentRef = useRef(false);
  const messageIdCounterRef = useRef(0);
  const orderDataRef = useRef<any>(null);
  const recommendationRetryCountRef = useRef(0);
  const rohanRecommendationShownRef = useRef(false); // Track if Rohan's recommendation was shown
  const MAX_RETRIES = 10; // Maximum retries before giving up
  
  // Get order data from URL params (for kiosk) or location state (for mobile)
  const getOrderData = () => {
    // Check URL params first (for kiosk navigation)
    const urlParams = new URLSearchParams(window.location.search);
    const urlData = urlParams.get('data');
    if (urlData) {
      try {
        return JSON.parse(decodeURIComponent(urlData));
      } catch (e) {
        console.error('Failed to parse URL data:', e);
      }
    }
    
    // Fallback to location state
    return location.state?.orderData || {
      orderId: location.state?.orderId || 'ORD-2025-5678',
      productName: location.state?.product?.name || cart[0]?.product?.name || 'Product',
      userName: currentUser?.name || 'Customer',
      product: location.state?.product || cart[0]?.product
    };
  };

  const orderData = getOrderData();
  orderDataRef.current = orderData; // Store in ref for use in async callbacks

  useEffect(() => {
    // Prevent duplicate initial messages
    if (initialMessageSentRef.current) return;
    
    const initializeWhatsApp = async () => {
      // Check if coming from kiosk (from URL params or state)
      const urlParams = new URLSearchParams(window.location.search);
      const urlData = urlParams.get('data');
      const fromKiosk = urlData ? true : (location.state?.fromKiosk || false);
      setIsFromKiosk(fromKiosk);

      // Fetch all products for recommendations first
      const fetchProducts = async () => {
        try {
          const { data, error } = await supabase.from('products').select('*');
          if (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products. Please refresh the page.');
            return;
          }
          if (data && data.length > 0) {
            setAllProducts(data as Product[]);
            console.log(`✅ Loaded ${data.length} products for recommendations`);
          } else {
            console.warn('⚠️ No products found in database');
            toast.error('No products available. Please ensure products are imported.');
          }
        } catch (err) {
          console.error('Exception fetching products:', err);
          toast.error('Failed to load products. Please refresh the page.');
        }
      };
      await fetchProducts();

      // If coming from kiosk, try to auto-select user and fetch full product details
      if (fromKiosk) {
        // Fetch user if userName is provided
        if (!currentUser && orderData.userName) {
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .ilike('name', `%${orderData.userName}%`)
            .limit(1)
            .single();
          
          if (userData) {
            setCurrentUser(userData as User);
          }
        }

        // Fetch full product details if we only have productId or basic info
        if (orderData.product) {
          if (orderData.product.id && (!orderData.product.brand || !orderData.product.category)) {
            const { data: productData } = await supabase
              .from('products')
              .select('*')
              .eq('id', orderData.product.id)
              .single();
            
            if (productData) {
              orderData.product = productData as Product;
              orderDataRef.current.product = productData as Product;
            }
          } else if (!orderData.product.id && orderData.product.name) {
            // Try to find by name if no ID
            const { data: productData } = await supabase
              .from('products')
              .select('*')
              .ilike('name', `%${orderData.product.name}%`)
              .limit(1)
              .single();
            
            if (productData) {
              orderData.product = productData as Product;
              orderDataRef.current.product = productData as Product;
            }
          }
        }

        // Mark as sent BEFORE adding message to prevent duplicates
        initialMessageSentRef.current = true;

        // Check if it's Rohan (Use Case 2: Kiosk checkout - skip Track Order, show recommendations directly)
        const isRohan = orderData.userName?.toLowerCase().includes('rohan') || 
                        currentUser?.name.toLowerCase().includes('rohan');

        if (isRohan) {
          // Rohan: Skip Track Order, directly show cross-brand recommendations
          // Show order confirmation immediately
          setTimeout(() => {
            addMessage({
              type: 'agent',
              content: `Thank you for shopping at ABFRL! 🎉\n\nYour order ${orderData.orderId} has been confirmed.\n\nWe hope you love your purchase! 💙`
            });
            // Recommendations will be shown via useEffect when products load
          }, 1000);
        } else {
          // Other users: Show Track Order button
          setTimeout(() => {
            addMessage({
              type: 'agent',
              content: `Thank you for shopping at ABFRL! 🎉\n\nYour order ${orderData.orderId} has been confirmed.\n\nWe hope you love your purchase! 💙`,
              actionButtons: [
                { text: 'Track Order', action: 'track' }
              ]
            });
          }, 1000);
        }
      } else {
        // Only redirect if not from kiosk and no user
        if (!currentUser) {
          navigate('/');
          return;
        }

        // Mark as sent BEFORE adding message to prevent duplicates
        initialMessageSentRef.current = true;

        // Mobile app order confirmation message
        setTimeout(() => {
          addMessage({
            type: 'agent',
            content: `Hey ${orderData.userName || currentUser?.name || 'there'}! Your ${orderData.productName} is on the way 🚚\n\nOrder ID: ${orderData.orderId}\nDelivery: Tomorrow by 6 PM\n\nTrack your order: [Track Now]`,
            actionButtons: [
              { text: 'Track Order', action: 'track' }
            ]
          });
        }, 1000);
      }
    };

    initializeWhatsApp();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run once on mount

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Watch for products to load and show recommendations for Rohan
  useEffect(() => {
    if (isFromKiosk && allProducts.length > 0 && !rohanRecommendationShownRef.current) {
      const currentOrderData = orderDataRef.current;
      console.log('🔍 Checking for Rohan recommendations:', {
        hasOrderData: !!currentOrderData,
        userName: currentOrderData?.userName,
        currentUserName: currentUser?.name,
        allProductsCount: allProducts.length,
        messagesCount: messages.length
      });
      
      if (!currentOrderData) {
        console.log('❌ No order data found');
        return;
      }
      
      const isRohan = currentOrderData.userName?.toLowerCase().includes('rohan') || 
                      currentUser?.name.toLowerCase().includes('rohan');
      
      console.log('👤 Is Rohan?', isRohan);
      
      if (isRohan) {
        // Check if order confirmation message was already sent
        const hasOrderMessage = messages.some(m => 
          m.type === 'agent' && m.content.includes('Thank you for shopping at ABFRL')
        );
        
        console.log('📨 Has order message?', hasOrderMessage);
        
        if (hasOrderMessage) {
          // Order message exists, show recommendations after delay
          console.log('✅ Showing recommendations for Rohan');
          rohanRecommendationShownRef.current = true;
          setTimeout(() => {
            showCrossBrandRecommendations();
          }, 2000);
        } else {
          console.log('⏳ Waiting for order message...');
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allProducts, messages, isFromKiosk, currentUser]);

  const addMessage = (message: Omit<WhatsAppMessage, 'id' | 'timestamp'>) => {
    messageIdCounterRef.current += 1;
    const newMessage: WhatsAppMessage = {
      ...message,
      id: `${Date.now()}-${messageIdCounterRef.current}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleAction = async (action: string, product?: Product) => {
    if (action === 'track') {
      addMessage({
        type: 'user',
        content: 'Track Order'
      });
      
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addMessage({
          type: 'agent',
          content: `📦 Order Status: ${orderData.orderId}\n\n✅ Confirmed\n🔄 Processing\n📦 Packed\n🚚 Out for Delivery\n\nExpected delivery: Tomorrow by 6 PM\n\nYour order is being prepared!`
        });

        // After tracking, show cross-brand recommendations with time-limited deals
        setTimeout(() => {
          showCrossBrandRecommendations();
        }, 2000);
      }, 1500);
    } else if (action === 'add_to_cart' && product) {
      await addToCart(product);
      addMessage({
        type: 'user',
        content: 'YES'
      });
      
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const discountedPrice = product.price - (product.price * (product.discountPercent || 0) / 100);
        addMessage({
          type: 'agent',
          content: `Awesome! Added to cart 🛒\n\n${product.name}\nPrice: ₹${product.price}\nDiscount: ${product.discountPercent}% OFF\nFinal: ₹${discountedPrice}\n\nWant to checkout now?`,
          actionButtons: [
            { text: 'Checkout', action: 'checkout' },
            { text: 'Browse More', action: 'browse' }
          ]
        });
      }, 1500);
    } else if (action === 'checkout') {
      if (!selectedProduct && product) {
        setSelectedProduct(product);
      }
      if (!selectedProduct && !product) {
        toast.error('Please select a product first');
        return;
      }
      setShowPayment(true);
    } else if (action === 'browse') {
      showCrossBrandRecommendations();
    } else if (action === 'pay') {
      handlePayment();
    }
  };

  const showCrossBrandRecommendations = () => {
    if (allProducts.length === 0) {
      recommendationRetryCountRef.current += 1;
      
      if (recommendationRetryCountRef.current > MAX_RETRIES) {
        console.error('❌ Max retries reached. Products not loaded. Skipping recommendations.');
        toast.error('Unable to load product recommendations. Please refresh the page.');
        return;
      }
      
      console.log(`No products loaded yet, retrying (${recommendationRetryCountRef.current}/${MAX_RETRIES})...`);
      
      // Try to fetch products again if they're not loaded
      if (recommendationRetryCountRef.current === 1) {
        // First retry - try fetching products again
        supabase.from('products').select('*').then(({ data, error }) => {
          if (error) {
            console.error('Error fetching products on retry:', error);
          } else if (data && data.length > 0) {
            setAllProducts(data as Product[]);
            console.log(`✅ Loaded ${data.length} products on retry`);
            // Reset retry count and try again
            recommendationRetryCountRef.current = 0;
            showCrossBrandRecommendations();
            return;
          }
        });
      }
      
      setTimeout(() => showCrossBrandRecommendations(), 1000);
      return;
    }
    
    // Reset retry count on success
    recommendationRetryCountRef.current = 0;
    
    // Use order product from ref (which may have been updated) or current orderData or cart
    const currentOrderData = orderDataRef.current || orderData;
    let currentProduct =
      currentOrderData.product ||
      orderData.product ||
      cart[0]?.product ||
      null;
    
    // For Rohan: Try to find Allen Solly product if no product in order data
    // For Aarav: Try to find Bewakoof product if no product in order data
    const userName = currentOrderData.userName?.toLowerCase() || currentUser?.name.toLowerCase() || '';
    if (!currentProduct && userName.includes('rohan')) {
      // Find Allen Solly product for Rohan
      const allenSollyProduct = allProducts.find(p => {
        const brandLower = p.brand.toLowerCase();
        const nameLower = p.name.toLowerCase();
        return (brandLower.includes('allen solly') || nameLower.includes('allen solly')) &&
               (nameLower.includes('blue') || nameLower.includes('shirt'));
      });
      if (allenSollyProduct) {
        currentProduct = allenSollyProduct;
        console.log('✅ Found Allen Solly product for Rohan:', allenSollyProduct.name);
      }
    } else if (!currentProduct && userName.includes('aarav')) {
      // Find Bewakoof product for Aarav
      const bewakoofProduct = allProducts.find(p => {
        const brandLower = (p.brand || '').toLowerCase();
        const nameLower = (p.name || '').toLowerCase();
        return (brandLower.includes('bewakoof') || nameLower.includes('bewakoof')) &&
               (nameLower.includes('oversized') || nameLower.includes('graphic') || nameLower.includes('tee'));
      });
      if (bewakoofProduct) {
        currentProduct = bewakoofProduct;
        console.log('✅ Found Bewakoof product for Aarav:', bewakoofProduct.name);
      }
    } else if (!currentProduct && userName.includes('priya')) {
      // Find W White Floral product for Priya
      const wProduct = allProducts.find(p => {
        const nameLower = (p.name || '').toLowerCase();
        return nameLower.includes('w white floral') || 
               nameLower.includes('white floral printed round neck') ||
               (nameLower.includes('white') && nameLower.includes('floral') && nameLower.includes('top'));
      });
      if (wProduct) {
        currentProduct = wProduct;
        console.log('✅ Found W White Floral product for Priya:', wProduct.name);
      }
    }
    
    // If we only have basic product info (from kiosk), try to find full product details
    if (currentProduct && (!currentProduct.brand || !currentProduct.category)) {
      const fullProduct = allProducts.find(p => 
        p.id === currentProduct?.id || 
        p.name === currentProduct?.name ||
        (currentProduct?.name && p.name.includes(currentProduct.name.split(' ')[0]))
      );
      if (fullProduct) {
        currentProduct = fullProduct;
        // Update ref for future use
        if (orderDataRef.current) {
          orderDataRef.current.product = fullProduct;
        }
      }
    }
    
    // Fallback: use any product if still no product found
    if (!currentProduct && allProducts.length > 0) {
      currentProduct = allProducts[0];
      console.log('⚠️ Using fallback product:', currentProduct.name);
    }
    
    if (!currentProduct) {
      console.log('❌ No product found for recommendations. Order data:', currentOrderData || orderData);
      toast.error('Unable to find a product to recommend. Please try again.');
      return;
    }
    
    console.log('🎯 Using product for recommendations:', currentProduct.name);

    // Use currentUser if available, otherwise create a mock user for recommendations
    const userForRecommendations = currentUser || {
      id: 'temp',
      name: orderData.userName || 'Customer',
      loyalty_tier: 'Bronze' as const,
      loyalty_points: 0,
      favorite_brands: [],
      style_preference: null,
    } as User;

    // Filter products by gender before recommendations
    // BUT: For hardcoded recommendations (Aarav/Rohan/Priya), use all products to ensure we find the specific products
    const userGender = getUserGender(userForRecommendations.name);
    const userForRecName = userForRecommendations.name.toLowerCase();
    const isHardcodedUseCase = userForRecName.includes('aarav') || userForRecName.includes('rohan') || userForRecName.includes('priya');
    
    // For hardcoded use cases, use all products (gender filter will be applied inside getCrossBrandRecommendations if needed)
    // For other cases, apply gender filter first
    const productsForRecommendations = isHardcodedUseCase ? allProducts : filterProductsByGender(allProducts, userGender);

    const recommendations = getCrossBrandRecommendations(
      currentProduct,
      productsForRecommendations,
      userForRecommendations,
      {
        crossBrand: true,
        timeLimited: true,
        discountPercent: userForRecommendations.loyalty_tier === 'Gold' ? 30 : userForRecommendations.loyalty_tier === 'Silver' ? 20 : 20,
        expiresIn: 120 // 2 hours
      }
    );

    if (recommendations.length > 0) {
      // For Priya's use case, show both recommendations
      if (recommendations.length > 1 && userForRecommendations.name.toLowerCase().includes('priya')) {
        // Show first recommendation
        const recProduct1 = recommendations[0];
        const reason1 = getRecommendationReason(recProduct1, userForRecommendations, currentProduct);
        const discountedPrice1 = recProduct1.price - (recProduct1.price * (recProduct1.discountPercent || 0) / 100);
        
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          addMessage({
            type: 'agent',
            content: `BTW, these ${recProduct1.brand} items go INSANE with your new ${currentProduct.brand} style! 👟\n\n${recProduct1.name}\n${reason1}\n\n💰 Special Price: ₹${discountedPrice1} (${recProduct1.discountPercent}% OFF)\n⏰ Limited time offer - expires soon!`,
            product: {
              ...recProduct1,
              discountPercent: recProduct1.discountPercent,
              expiresIn: recProduct1.expiresIn
            },
            actionButtons: [
              { text: 'Add to Cart', action: 'add_to_cart' },
              { text: 'Checkout Now', action: 'checkout' }
            ]
          });
          setSelectedProduct({
            ...recProduct1,
            discountPercent: recProduct1.discountPercent,
            expiresIn: recProduct1.expiresIn
          } as Product);
          
          // Show second recommendation after a delay
          setTimeout(() => {
            const recProduct2 = recommendations[1];
            if (recProduct2) {
              const reason2 = getRecommendationReason(recProduct2, userForRecommendations, currentProduct);
              const discountedPrice2 = recProduct2.price - (recProduct2.price * (recProduct2.discountPercent || 0) / 100);
              
              setIsTyping(true);
              setTimeout(() => {
                setIsTyping(false);
                addMessage({
                  type: 'agent',
                  content: `And this ${recProduct2.brand} piece complements your style perfectly! 💫\n\n${recProduct2.name}\n${reason2}\n\n💰 Special Price: ₹${discountedPrice2} (${recProduct2.discountPercent}% OFF)\n⏰ Limited time offer - expires soon!`,
                  product: {
                    ...recProduct2,
                    discountPercent: recProduct2.discountPercent,
                    expiresIn: recProduct2.expiresIn
                  },
                  actionButtons: [
                    { text: 'Add to Cart', action: 'add_to_cart' },
                    { text: 'Checkout Now', action: 'checkout' }
                  ]
                });
                setSelectedProduct({
                  ...recProduct2,
                  discountPercent: recProduct2.discountPercent,
                  expiresIn: recProduct2.expiresIn
                } as Product);
              }, 1500);
            }
          }, 3000);
        }, 1500);
      } else {
        // Single recommendation for other use cases
        const recProduct = recommendations[0];
        const reason = getRecommendationReason(recProduct, userForRecommendations, currentProduct);
        const discountedPrice = recProduct.price - (recProduct.price * (recProduct.discountPercent || 0) / 100);
        
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          // Customize message based on user
          const userName = userForRecommendations.name.toLowerCase();
          const isRohan = userName.includes('rohan');
          const isAarav = userName.includes('aarav');
          
          let messageContent = '';
          if (isRohan) {
            messageContent = `BTW, these ${recProduct.brand} items go INSANE with your new ${currentProduct.brand} style! 👟\n\n${recProduct.name}\n${reason}\n\n💰 Special Price: ₹${discountedPrice} (${recProduct.discountPercent}% OFF)\n⏰ Limited time offer - expires in 2 hours!\n\nComplete your look with this perfect pair!`;
          } else if (isAarav) {
            messageContent = `BTW, these ${recProduct.brand} items go INSANE with your new ${currentProduct.brand} style! 👟\n\n${recProduct.name}\n${reason}\n\n💰 Special Price: ₹${discountedPrice} (${recProduct.discountPercent}% OFF)\n⏰ Limited time offer - expires in 2 hours!\n\nWant to complete your streetwear look?`;
          } else {
            messageContent = `BTW, these ${recProduct.brand} items go INSANE with your new ${currentProduct.brand} style! 👟\n\n${recProduct.name}\n${reason}\n\n💰 Special Price: ₹${discountedPrice} (${recProduct.discountPercent}% OFF)\n⏰ Limited time offer - expires soon!`;
          }
          
          addMessage({
            type: 'agent',
            content: messageContent,
            product: {
              ...recProduct,
              discountPercent: recProduct.discountPercent,
              expiresIn: recProduct.expiresIn
            },
            actionButtons: [
              { text: 'Add to Cart', action: 'add_to_cart' },
              { text: 'Checkout Now', action: 'checkout' }
            ]
          });
          // Set selected product for checkout
          setSelectedProduct({
            ...recProduct,
            discountPercent: recProduct.discountPercent,
            expiresIn: recProduct.expiresIn
          } as Product);
        }, 1500);
      }
    }
  };

  const handlePayment = async () => {
    if (!selectedProduct) return;
    
    // If no user, show error
    if (!currentUser) {
      toast.error('Please select a user profile first');
      return;
    }
    
    setIsTyping(true);
    setTimeout(async () => {
      setIsTyping(false);
      
      // Create order for the WhatsApp purchase
      const discountedPrice = selectedProduct.price - (selectedProduct.price * (selectedProduct.discountPercent || 0) / 100);
      
      try {
        const { data: order, error } = await supabase
          .from('orders')
          .insert({
            user_id: currentUser.id,
            total_amount: discountedPrice,
            discount_applied: selectedProduct.price - discountedPrice,
            order_status: 'confirmed',
            session_id: sessionId
          })
          .select()
          .single();

        if (error) throw error;

        // Create order item
        await supabase
          .from('order_items')
          .insert({
            order_id: order.id,
            product_id: selectedProduct.id,
            quantity: 1,
            price: selectedProduct.price
          });

        addMessage({
          type: 'agent',
          content: `✅ Payment successful!\n\nOrder ID: ${order.id}\nAmount: ₹${discountedPrice}\nSame delivery (tomorrow 6 PM)\n\nTrack: [Track Order]\n\nThanks for shopping with ABFRL! 🙌`,
          timestamp: new Date(),
          actionButtons: [
            { text: 'Track Order', action: 'track' }
          ]
        });

        setShowPayment(false);
        toast.success('Order placed via WhatsApp!');
      } catch (error) {
        console.error('Payment error:', error);
        addMessage({
          type: 'agent',
          content: 'Sorry, there was an error processing your payment. Please try again.',
          timestamp: new Date()
        });
      }
    }, 2000);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    addMessage({
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    });
    
    setInputValue('');
    
    // Auto-reply for common messages
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const lower = inputValue.toLowerCase();
      if (lower.includes('yes') || lower.includes('add') || lower.includes('buy')) {
        if (selectedProduct) {
          handleAction('add_to_cart', selectedProduct);
        }
      } else {
        addMessage({
          type: 'agent',
          content: 'Thanks for your message! How can I help you today?',
          timestamp: new Date()
        });
      }
    }, 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <div className="flex flex-col h-screen bg-[#ECE5DD] overflow-hidden">
      {/* WhatsApp Header */}
      <div className="bg-[#075E54] text-white px-4 py-3 flex items-center gap-3 shadow-md z-10">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20 h-9 w-9"
          onClick={() => navigate('/confirmation', { state: { orderId: orderData.orderId } })}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <span className="text-lg font-semibold">AB</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base">ABFRL Shopping</h3>
          <p className="text-xs text-white/80">online</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-white/20 rounded-full">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-white/20 rounded-full">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-white/20 rounded-full">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-2" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3Cpattern id=\'grid\' width=\'100\' height=\'100\' patternUnits=\'userSpaceOnUse\'%3E%3Cpath d=\'M 100 0 L 0 0 0 100\' fill=\'none\' stroke=\'%23e0e0e0\' stroke-width=\'0.5\' opacity=\'0.3\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'100\' height=\'100\' fill=\'url(%23grid)\'/%3E%3C/svg%3E")' }}>
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} mb-1`}
            >
              <div className={`max-w-[75%] ${msg.type === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                {/* Product Card in Message */}
                {msg.product && (
                  <Card className="mb-2 p-0 overflow-hidden bg-white border-0 shadow-md max-w-[280px]">
                    <div className="aspect-square overflow-hidden bg-muted">
                      <img 
                        src={msg.product.image_url || '/placeholder.jpg'} 
                        alt={msg.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-gray-900">{msg.product.name}</p>
                          <p className="text-xs text-gray-500">{msg.product.brand}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm text-gray-900">₹{msg.product.price}</p>
                          {msg.product.discountPercent && (
                            <p className="text-xs text-green-600 line-through text-gray-400">
                              ₹{Math.round(msg.product.price / (1 - msg.product.discountPercent / 100))}
                            </p>
                          )}
                        </div>
                      </div>
                      {msg.product.discountPercent && msg.product.expiresIn && (
                        <TimeLimitedOffer
                          expiresIn={msg.product.expiresIn}
                          discountPercent={msg.product.discountPercent}
                          compact
                        />
                      )}
                    </div>
                  </Card>
                )}

                {/* Message Bubble */}
                <div
                  className={`rounded-lg px-3 py-2 shadow-sm ${
                    msg.type === 'user'
                      ? 'bg-[#DCF8C6] rounded-tr-none'
                      : 'bg-white rounded-tl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line text-gray-900" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                    {msg.content}
                  </p>
                  <div className={`flex items-center gap-1 mt-1 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-[10px] text-gray-500">
                      {formatTime(msg.timestamp)}
                    </span>
                    {msg.type === 'user' && (
                      <CheckCircle2 className={`w-3 h-3 ${msg.isRead ? 'text-blue-500' : 'text-gray-400'}`} />
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {msg.actionButtons && msg.actionButtons.length > 0 && (
                  <div className="mt-2 space-y-2 w-full max-w-[280px]">
                    {msg.actionButtons.map((btn, btnIdx) => (
                      <Button
                        key={btnIdx}
                        onClick={() => {
                          if (msg.product) {
                            setSelectedProduct(msg.product);
                          }
                          handleAction(btn.action, msg.product);
                        }}
                        className={`w-full text-sm font-normal rounded-lg ${
                          btn.action === 'checkout' || btn.action === 'pay'
                            ? 'bg-[#25D366] hover:bg-[#20BA5A] text-white'
                            : 'bg-white hover:bg-gray-50 text-[#075E54] border border-gray-300'
                        }`}
                      >
                        {btn.text}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start mb-1">
            <div className="bg-white rounded-lg rounded-tl-none px-4 py-2 shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPayment && selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => setShowPayment(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto"
            >
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-4">Complete Payment</h3>
              
              <Card className="p-4 mb-4">
                <div className="flex gap-3 mb-3">
                  <img 
                    src={selectedProduct.image_url || '/placeholder.jpg'} 
                    alt={selectedProduct.name}
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{selectedProduct.name}</p>
                    <p className="text-xs text-gray-500">{selectedProduct.brand}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {selectedProduct.discountPercent && (
                        <span className="text-xs text-green-600 line-through text-gray-400">
                          ₹{selectedProduct.price}
                        </span>
                      )}
                      <span className="font-bold text-sm">
                        ₹{selectedProduct.price - (selectedProduct.price * (selectedProduct.discountPercent || 0) / 100)}
                      </span>
                    </div>
                  </div>
                </div>
                {selectedProduct.discountPercent && (
                  <Badge className="bg-green-100 text-green-700 text-xs">
                    {selectedProduct.discountPercent}% OFF
                  </Badge>
                )}
              </Card>

              <div className="space-y-3 mb-6">
                <h4 className="font-semibold text-sm">Payment Method</h4>
                <div className="space-y-2">
                  {['UPI', 'Card', 'Wallet'].map((method) => (
                    <Card 
                      key={method} 
                      className={`p-3 cursor-pointer transition-all ${
                        selectedPaymentMethod === method 
                          ? 'bg-[#25D366]/10 border-2 border-[#25D366]' 
                          : 'hover:bg-gray-50 border-2 border-transparent'
                      }`}
                      onClick={() => setSelectedPaymentMethod(method)}
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-gray-600" />
                        <span className="flex-1 font-medium">{method}</span>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          selectedPaymentMethod === method 
                            ? 'border-[#25D366] bg-[#25D366]' 
                            : 'border-gray-300'
                        }`}>
                          {selectedPaymentMethod === method && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => handleAction('pay')}
                className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white h-12 text-base font-semibold"
              >
                Pay ₹{selectedProduct.price - (selectedProduct.price * (selectedProduct.discountPercent || 0) / 100)}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="bg-[#F0F0F0] px-2 py-2 flex items-center gap-2">
        <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-full">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </button>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message"
          className="flex-1 bg-white rounded-full px-4 py-2.5 text-sm border-0 outline-none focus:ring-0"
          style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
        />
        <button
          onClick={handleSend}
          className="p-2 text-[#075E54] hover:bg-gray-200 rounded-full"
        >
          <Send className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default WhatsApp;

