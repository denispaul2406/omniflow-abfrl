import { Product } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Check, Sparkles } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
  recommendationReason?: string;
}

export function ProductCard({ product, compact = false, recommendationReason }: ProductCardProps) {
  const { addToCart, cart, currentUser } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  
  const inCart = cart.some(item => item.product_id === product.id);

  // Calculate recommendation reason if not provided - shorter versions for badges
  const getRecommendationReason = (short: boolean = false): string => {
    if (recommendationReason) {
      // Remove emojis and shorten if needed
      const clean = recommendationReason.replace(/[💼👔🔥⭐✨]/g, '').trim();
      if (short) {
        // For compact cards, use even shorter version
        if (clean.includes('Matches your')) {
          const brand = clean.split('Matches your')[1]?.split('favorites')[0]?.trim();
          return brand ? `Matches ${brand}` : 'Your brand';
        }
        return clean.length > 15 ? clean.substring(0, 12) + '...' : clean;
      }
      return recommendationReason;
    }
    if (!currentUser) return short ? 'AI Recommended' : '✨ AI Recommended';
    
    const userBrands = currentUser.favorite_brands || [];
    if (userBrands.some(b => product.brand.toLowerCase().includes(b.toLowerCase()))) {
      return short ? `Matches ${product.brand}` : `💼 Matches your ${product.brand}`;
    }
    
    if (product.category === currentUser.style_preference) {
      const style = currentUser.style_preference || 'style';
      return short ? `Perfect ${style}` : `👔 Perfect for ${style}`;
    }
    
    if (product.stock_count && product.stock_count < 10) {
      return short ? `Only ${product.stock_count} left!` : `🔥 Only ${product.stock_count} left!`;
    }
    
    if (currentUser.size && product.size?.includes(currentUser.size)) {
      return short ? `Size ${currentUser.size}` : `⭐ Your size (${currentUser.size})`;
    }
    
    return short ? 'AI Recommended' : '✨ AI Recommended';
  };

  const reason = getRecommendationReason(false);
  const reasonShort = getRecommendationReason(true);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    await addToCart(product);
    toast.success('Added to cart! 🛒', {
      description: `${product.name} (${formatPrice(product.price)})`,
      duration: 3000,
    });
    setTimeout(() => setIsAdding(false), 1000);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (compact) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="overflow-hidden border-0 shadow-soft transition-all duration-250 hover:shadow-medium">
        <div className="flex relative">
          <img 
            src={product.image_url || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200'}
            alt={product.name}
            className="w-24 h-24 object-cover"
          />
          <div className="absolute top-1 left-1 flex flex-col gap-1 max-w-[90px]">
            <Badge className="bg-accent/90 text-accent-foreground text-[9px] px-1.5 py-0.5 border-0 font-semibold flex items-center gap-0.5 whitespace-nowrap">
              <Sparkles className="w-2 h-2 flex-shrink-0" />
              <span className="truncate">AI Match</span>
            </Badge>
            <Badge className="bg-primary/90 text-primary-foreground text-[8px] px-1.5 py-0.5 border-0 font-medium truncate">
              {reasonShort}
            </Badge>
          </div>
          <CardContent className="flex-1 p-3 flex flex-col justify-between min-w-0">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide truncate">{product.brand}</p>
              <p className="text-sm font-medium line-clamp-1 mt-1">{product.name}</p>
              <p className="text-sm font-semibold text-primary mt-1">{formatPrice(product.price)}</p>
            </div>
            <Button
              size="sm"
              variant={inCart || isAdding ? "secondary" : "default"}
              className="w-full h-8 text-xs mt-2 rounded-lg font-semibold"
              onClick={handleAddToCart}
              disabled={isAdding}
            >
              {isAdding ? (
                <Check className="h-3 w-3 mr-1" />
              ) : (
                <Plus className="h-3 w-3 mr-1" />
              )}
              {inCart ? 'Add Another' : 'Add to Cart'}
            </Button>
          </CardContent>
        </div>
      </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ 
        scale: 1.02, 
        boxShadow: "0 8px 24px rgba(207,46,46,0.15)" 
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Card className="overflow-hidden border-0 shadow-soft transition-all duration-250 hover:shadow-medium group">
      <div className="aspect-[4/3] overflow-hidden relative">
        <img 
          src={product.image_url || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10 max-w-[160px]">
          <Badge className="bg-accent/90 text-accent-foreground text-[10px] px-2 py-0.5 border-0 font-semibold flex items-center gap-1 shadow-soft whitespace-nowrap">
            <Sparkles className="w-2.5 h-2.5 flex-shrink-0" />
            <span>AI Recommended</span>
          </Badge>
          <Badge className="bg-primary/90 text-primary-foreground text-[9px] px-2 py-1 border-0 font-medium shadow-soft truncate">
            {reasonShort}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide truncate">{product.brand}</p>
        <p className="font-medium mt-1 line-clamp-2 min-h-[2.5rem]">{product.name}</p>
        <div className="flex items-center justify-between mt-3 gap-2">
          <p className="text-lg font-semibold text-primary flex-shrink-0">{formatPrice(product.price)}</p>
          <Button
            size="sm"
            variant={inCart || isAdding ? "secondary" : "default"}
            onClick={handleAddToCart}
            disabled={isAdding}
            className="h-9 rounded-lg font-semibold flex-shrink-0"
          >
            {isAdding ? (
              <Check className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
}
