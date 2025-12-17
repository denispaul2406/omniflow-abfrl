import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Header } from '@/components/Header';
import { ChatBubble } from '@/components/ChatBubble';
import { ChatInput } from '@/components/ChatInput';
import { QuickActions } from '@/components/QuickActions';
import { Product } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, MessageCircle, Phone, Store } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { getUserGender, filterProductsByGender } from '@/lib/recommendationEngine';

const Chat = () => {
  const { currentUser, messages, addMessage, addToCart } = useApp();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }

    const fetchProducts = async () => {
      const { data } = await supabase.from('products').select('*');
      if (data) setProducts(data as Product[]);
    };

    fetchProducts();

    // Send welcome message
    if (messages.length === 0) {
      setTimeout(() => {
        const welcomeProducts = getRecommendedProducts([]);
        addMessage({
          type: 'agent',
          content: getPersonalizedGreeting(),
          products: welcomeProducts
        });
      }, 500);
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const getRecommendedProducts = (excludeIds: string[]): Product[] => {
    if (!currentUser || products.length === 0) return [];
    
    // Filter by gender first
    const userGender = getUserGender(currentUser.name);
    let filteredProducts = filterProductsByGender(products, userGender);
    
    const userBrands = currentUser.favorite_brands || [];
    const brandProducts = filteredProducts.filter(
      p => userBrands.some(b => p.brand.toLowerCase().includes(b.toLowerCase())) &&
           !excludeIds.includes(p.id)
    );
    
    if (brandProducts.length >= 2) {
      return brandProducts.slice(0, 2);
    }
    
    return filteredProducts.filter(p => !excludeIds.includes(p.id)).slice(0, 2);
  };

  const getPersonalizedGreeting = () => {
    if (!currentUser) return '';
    const firstName = currentUser.name.split(' ')[0];
    const brands = currentUser.favorite_brands?.join(' and ') || 'fashion';
    const style = currentUser.style_preference || 'style';
    const isGold = currentUser.loyalty_tier === 'Gold';
    const isSilver = currentUser.loyalty_tier === 'Silver';
    
    // VIP messaging for Gold members
    if (isGold) {
      const vipGreetings = [
        `Hi ${firstName}! ✨ As a valued Gold member, we've curated some exclusive pieces just for you. Your premium style deserves the best!`,
        `Welcome back, ${firstName}! 🌟 Your Gold membership unlocks premium selections. Let me show you what's perfect for your elegant taste.`,
        `${firstName}! 💎 As our Gold member, you get 30% off on all items. Here are some handpicked ${brands} pieces that match your sophisticated style.`
      ];
      return vipGreetings[Math.floor(Math.random() * vipGreetings.length)];
    }
    
    // Standard greetings for Silver/Bronze
    const greetings = [
      `Hey ${firstName}! 👋 Just dropped some fresh ${brands} pieces—totally your ${style} vibe. Want to see them?`,
      `Hi ${firstName}! 🎯 I've got some ${brands} items that match your ${style} perfectly. Ready to check them out?`,
      `${firstName}! ✨ Your favorite ${brands} just got some new arrivals. Perfect for your ${style} aesthetic!`
    ];
    
    return greetings[Math.floor(Math.random() * greetings.length)];
  };

  const getRecommendationReason = (product: Product): string => {
    if (!currentUser) return 'AI Recommended';
    
    const userBrands = currentUser.favorite_brands || [];
    if (userBrands.some(b => product.brand.toLowerCase().includes(b.toLowerCase()))) {
      return `💼 Matches your ${product.brand} favorites`;
    }
    
    if (product.category === currentUser.style_preference) {
      return `👔 Perfect for ${currentUser.style_preference}`;
    }
    
    if (product.stock_count && product.stock_count < 10) {
      return `🔥 Only ${product.stock_count} left!`;
    }
    
    if (currentUser.size && product.size?.includes(currentUser.size)) {
      return `⭐ Trending in your size (${currentUser.size})`;
    }
    
    return `✨ AI Recommended for you`;
  };

  const handleSendMessage = async (content: string) => {
    addMessage({ type: 'user', content });
    setIsTyping(true);

    // Simulate agent thinking
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    const lowerContent = content.toLowerCase();
    const shownProductIds = messages
      .flatMap(m => m.products || [])
      .map(p => p.id);

    let response = '';
    let recommendedProducts: Product[] = [];
    const firstName = currentUser?.name.split(' ')[0] || 'there';

    // Hardcoded use cases for specific users and searches
    const userName = currentUser?.name.toLowerCase() || '';
    const isAarav = userName.includes('aarav');
    const isRohan = userName.includes('rohan');
    const isPriya = userName.includes('priya');
    
    // Filter by gender first (but for hardcoded use cases, we might need all products)
    const userGender = getUserGender(currentUser?.name || '');
    let filteredProducts = filterProductsByGender(products, userGender);
    
    // Debug: Log available products for Aarav
    if (isAarav && lowerContent.includes('casual')) {
      console.log('🔍 All products count:', products.length);
      console.log('🔍 Filtered products count:', filteredProducts.length);
      console.log('🔍 Bewakoof products in all products:', products.filter(p => 
        (p.brand || '').toLowerCase().includes('bewakoof') || 
        (p.name || '').toLowerCase().includes('bewakoof')
      ).map(p => ({ name: p.name, brand: p.brand, image: p.image_url })));
    }

    if (lowerContent.includes('formal') || lowerContent.includes('office') || lowerContent.includes('work')) {
      // Use Case 2: Rohan - Formal wear - HARDCODED: Show exactly 2 Allen Solly products
      if (isRohan) {
        // Get ALL Allen Solly products (up to 2)
        const allenSollyProducts = filteredProducts
          .filter(p => {
            const brandLower = p.brand.toLowerCase();
            const nameLower = p.name.toLowerCase();
            return (brandLower.includes('allen solly') || nameLower.includes('allen solly')) &&
                   !shownProductIds.includes(p.id);
          })
          .slice(0, 2); // Exactly 2 products
        
        if (allenSollyProducts.length > 0) {
          recommendedProducts = allenSollyProducts;
        } else {
          // Fallback: any formal products from preferred brands
          recommendedProducts = filteredProducts
            .filter(p => {
              const brandLower = p.brand.toLowerCase();
              return (['Shirts', 'Pants', 'Blazers'].includes(p.category || '') ||
                      brandLower.includes('allen solly') ||
                      brandLower.includes('van heusen') ||
                      brandLower.includes('louis philippe')) &&
                     !shownProductIds.includes(p.id);
            })
            .slice(0, 2);
        }
      } else {
        recommendedProducts = filteredProducts
          .filter(p => ['Shirts', 'Pants', 'Blazers'].includes(p.category || '') && !shownProductIds.includes(p.id))
          .slice(0, 2);
      }
      const brandNames = recommendedProducts.map(p => p.brand).join(' and ');
      response = `Perfect! 👔 Here are some great formal options from ${brandNames}—ideal for your office wardrobe. Which one catches your eye?`;
    } else if (lowerContent.includes('casual') || lowerContent.includes('weekend')) {
      // Use Case 1: Aarav - Casual outfit - HARDCODED: Show exactly 2 Bewakoof products
      if (isAarav) {
        // First, find ALL Bewakoof products (before gender filtering)
        const allBewakoofProducts = products.filter(p => {
          const brandLower = (p.brand || '').toLowerCase();
          const nameLower = (p.name || '').toLowerCase();
          return (brandLower.includes('bewakoof') || nameLower.includes('bewakoof')) &&
                 !shownProductIds.includes(p.id);
        });
        
        console.log('🔍 All Bewakoof products (before gender filter):', allBewakoofProducts.length, allBewakoofProducts.map(p => ({ name: p.name, brand: p.brand, image: p.image_url })));
        
        // Apply gender filter to Bewakoof products
        const bewakoofProducts = filterProductsByGender(allBewakoofProducts, userGender);
        
        console.log('🔍 Aarav - Bewakoof products found (after gender filter):', bewakoofProducts.length, bewakoofProducts.map(p => p.name));
        
        if (bewakoofProducts.length >= 2) {
          // We have at least 2 Bewakoof products after gender filter - perfect!
          recommendedProducts = bewakoofProducts.slice(0, 2);
        } else if (bewakoofProducts.length === 1) {
          // Only 1 Bewakoof product after gender filter - get another casual product from Souled Store/Flying Machine
          const otherCasual = filteredProducts
            .filter(p => {
              const brandLower = (p.brand || '').toLowerCase();
              const nameLower = (p.name || '').toLowerCase();
              return (brandLower.includes('souled') || 
                      brandLower.includes('flying machine') ||
                      nameLower.includes('souled') ||
                      nameLower.includes('flying machine')) &&
                     p.id !== bewakoofProducts[0].id &&
                     !shownProductIds.includes(p.id);
            })
            .slice(0, 1);
          recommendedProducts = [...bewakoofProducts, ...otherCasual].slice(0, 2);
        } else if (allBewakoofProducts.length >= 2) {
          // No Bewakoof products after gender filter, but we have them - use all Bewakoof products regardless of gender
          console.warn('⚠️ No Bewakoof products after gender filter, using all Bewakoof products');
          recommendedProducts = allBewakoofProducts.slice(0, 2);
        } else {
          // No Bewakoof products found at all - try to find any casual products
          console.warn('⚠️ No Bewakoof products found, using fallback');
          recommendedProducts = filteredProducts
            .filter(p => {
              const brandLower = (p.brand || '').toLowerCase();
              const nameLower = (p.name || '').toLowerCase();
              return (brandLower.includes('bewakoof') || 
                      brandLower.includes('souled') || 
                      brandLower.includes('flying machine') ||
                      nameLower.includes('bewakoof') ||
                      nameLower.includes('souled') ||
                      nameLower.includes('flying machine') ||
                      ['T-Shirts', 'Hoodies', 'Pants', 'Tees'].includes(p.category || '')) &&
                     !shownProductIds.includes(p.id);
            })
            .slice(0, 2);
        }
      } else {
        recommendedProducts = filteredProducts
          .filter(p => ['T-Shirts', 'Hoodies', 'Pants', 'Tees'].includes(p.category || '') && !shownProductIds.includes(p.id))
          .slice(0, 2);
      }
      response = `Nice choice! 🌟 These casual pieces are perfect for a relaxed weekend. I think they match your ${currentUser?.style_preference || 'style'} vibe perfectly!`;
    } else if (lowerContent.includes('ethnic') || lowerContent.includes('traditional') || lowerContent.includes('indian')) {
      // Use Case 3: Priya - Traditional/Ethnic wear - HARDCODED: Show exactly 2 ethnic products
      if (isPriya) {
        // First try to find W White Floral product
        const wProduct = filteredProducts.find(p => {
          const nameLower = p.name.toLowerCase();
          return (nameLower.includes('w white') || 
                  nameLower.includes('white floral') ||
                  (nameLower.includes('white') && nameLower.includes('floral') && nameLower.includes('top'))) &&
                 !shownProductIds.includes(p.id);
        });
        
        // Get ethnic products (including W product if found)
        const ethnicProducts = filteredProducts
          .filter(p => {
            const nameLower = p.name.toLowerCase();
            const categoryLower = p.category?.toLowerCase() || '';
            const brandLower = p.brand.toLowerCase();
            return (categoryLower.includes('ethnic') || 
                    nameLower.includes('kurta') ||
                    nameLower.includes('palazzo') ||
                    nameLower.includes('saree') ||
                    nameLower.includes('traditional') ||
                    nameLower.includes('ethnic') ||
                    brandLower === 'w' ||
                    nameLower.startsWith('w ')) &&
                   !shownProductIds.includes(p.id);
          })
          .slice(0, 2); // Exactly 2 products
        
        // If W product found, ensure it's first, then add another
        if (wProduct && ethnicProducts.length > 0) {
          const otherEthnic = ethnicProducts.filter(p => p.id !== wProduct.id).slice(0, 1);
          recommendedProducts = [wProduct, ...otherEthnic].slice(0, 2);
        } else if (ethnicProducts.length > 0) {
          recommendedProducts = ethnicProducts.slice(0, 2);
        } else {
          // Fallback: any products matching ethnic keywords
          recommendedProducts = filteredProducts
            .filter(p => {
              const nameLower = p.name.toLowerCase();
              const categoryLower = p.category?.toLowerCase() || '';
              return categoryLower.includes('ethnic') || 
                     nameLower.includes('kurta') ||
                     nameLower.includes('palazzo') ||
                     nameLower.includes('ethnic') ||
                     nameLower.includes('traditional');
            })
            .filter(p => !shownProductIds.includes(p.id))
            .slice(0, 2);
        }
      } else {
        recommendedProducts = filteredProducts
          .filter(p => {
            const nameLower = p.name.toLowerCase();
            const categoryLower = p.category?.toLowerCase() || '';
            return categoryLower.includes('ethnic') || 
                   nameLower.includes('kurta') ||
                   nameLower.includes('palazzo') ||
                   nameLower.includes('ethnic');
          })
          .filter(p => !shownProductIds.includes(p.id))
          .slice(0, 2);
      }
      response = `Beautiful! 🪷 Here's some stunning ethnic wear that'll make you stand out. These pieces are trending right now!`;
    } else if (lowerContent.includes('more') || lowerContent.includes('other') || lowerContent.includes('different')) {
      recommendedProducts = getRecommendedProducts(shownProductIds);
      response = `Sure thing, ${firstName}! ✨ Here are more options I think you'll love. Want me to filter by price or brand?`;
    } else if (lowerContent.includes('cart') || lowerContent.includes('checkout')) {
      navigate('/cart');
      response = `Great! 🛒 Taking you to your cart. You can review everything and checkout when you're ready!`;
    } else if (lowerContent.includes('help') || lowerContent.includes('what can')) {
      response = `I'm here to help you find the perfect outfit, ${firstName}! 💫 Try asking me:\n\n• "Show me formal wear" - for office-ready pieces\n• "Casual outfits" - for weekend vibes\n• "Ethnic wear" - for traditional looks\n• "Show me more" - for more recommendations\n\nWhat are you in the mood for today?`;
    } else {
      recommendedProducts = getRecommendedProducts(shownProductIds);
      if (recommendedProducts.length > 0) {
        const brandMatch = recommendedProducts.some(p => 
          currentUser?.favorite_brands?.some(b => p.brand.toLowerCase().includes(b.toLowerCase()))
        );
        response = brandMatch
          ? `Based on your love for ${currentUser?.favorite_brands?.join(' and ')}, I think you'll love these! 💫 They match your ${currentUser?.style_preference || 'style'} perfectly.`
          : `Here are some picks I think you'll love, ${firstName}! 💫 Want to see more options?`;
      } else {
        response = `I'd be happy to help, ${firstName}! What type of clothing are you looking for today? You can ask for formal wear, casual outfits, or ethnic wear!`;
      }
    }

    setIsTyping(false);
    
    // Ensure we always have products for specific searches (casual/formal/ethnic)
    if (recommendedProducts.length === 0 && 
        (lowerContent.includes('casual') || lowerContent.includes('formal') || 
         lowerContent.includes('ethnic') || lowerContent.includes('traditional'))) {
      // Fallback: get any products matching the category
      const fallbackProducts = filteredProducts
        .filter(p => !shownProductIds.includes(p.id))
        .slice(0, 2);
      recommendedProducts = fallbackProducts;
    }
    
    addMessage({ 
      type: 'agent', 
      content: response,
      products: recommendedProducts.length > 0 ? recommendedProducts : undefined
    });
  };

  // Dynamic quick actions based on user
  const getUserQuickActions = () => {
    const userName = currentUser?.name.toLowerCase() || '';
    if (userName.includes('priya')) {
      return ['Show formal wear', 'Casual outfits', 'Traditional wear', 'View cart', 'More options'];
    }
    return ['Show formal wear', 'Casual outfits', 'View cart', 'More options'];
  };
  
  const quickActions = getUserQuickActions();

  if (!currentUser) return null;

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 relative">
        {/* Multi-Channel Indicator */}
        <div className="sticky top-4 z-10 flex justify-center mb-2">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm shadow-soft animate-fade-in">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse-gradient"></div>
            <span className="text-xs font-semibold text-primary">Connected via:</span>
            <div className="flex items-center gap-1.5">
              <MessageCircle className="w-3 h-3 text-primary" />
              <span className="text-xs text-primary font-medium">Web</span>
              <span className="text-xs text-muted-foreground">•</span>
              <Phone className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Mobile</span>
              <span className="text-xs text-muted-foreground">•</span>
              <Store className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">In-Store</span>
            </div>
          </div>
        </div>

        {messages.map(message => (
          <ChatBubble key={message.id} message={message} />
        ))}
        
        {isTyping && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-soft">
              <div className="w-4 h-4 rounded-full gradient-sun-spinner"></div>
            </div>
            <div className="chat-bubble-agent px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-sm text-muted-foreground">Agent is thinking...</span>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <QuickActions actions={quickActions} onAction={handleSendMessage} />
      <ChatInput onSend={handleSendMessage} disabled={isTyping} />
    </div>
  );
};

export default Chat;
