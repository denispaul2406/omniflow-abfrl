import { CartItem as CartItemType } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface CartItemProps {
  item: CartItemType;
}

export function CartItemCard({ item }: CartItemProps) {
  const { updateCartQuantity, removeFromCart } = useApp();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (!item.product) return null;

  return (
    <Card className="border-0 shadow-soft overflow-hidden animate-fade-in">
      <CardContent className="p-0">
        <div className="flex">
          <img 
            src={item.product.image_url || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200'}
            alt={item.product.name}
            className="w-24 h-24 object-cover"
          />
          <div className="flex-1 p-3 flex flex-col justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">{item.product.brand}</p>
              <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
              <p className="text-sm font-semibold text-primary mt-1">
                {formatPrice(item.product.price * item.quantity)}
              </p>
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-7 w-7"
                  onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-7 w-7"
                  onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-destructive hover:text-destructive"
                onClick={() => removeFromCart(item.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
