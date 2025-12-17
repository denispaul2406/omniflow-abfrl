import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface TimeLimitedOfferProps {
  expiresIn: number; // minutes
  discountPercent: number;
  onExpire?: () => void;
  compact?: boolean;
}

export function TimeLimitedOffer({ expiresIn, discountPercent, onExpire, compact = false }: TimeLimitedOfferProps) {
  const [timeLeft, setTimeLeft] = useState(expiresIn * 60); // Convert to seconds

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onExpire]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  if (timeLeft <= 0) return null;

  if (compact) {
    return (
      <Badge className="bg-accent text-accent-foreground text-[10px] px-2 py-0.5 flex items-center gap-1 animate-pulse">
        <Clock className="w-3 h-3" />
        <span>{discountPercent}% OFF - {hours > 0 ? `${hours}h ` : ''}{minutes}m {seconds}s</span>
      </Badge>
    );
  }

  return (
    <Badge className="bg-accent text-accent-foreground text-xs px-3 py-1.5 flex items-center gap-2 animate-pulse shadow-soft">
      <Clock className="w-4 h-4" />
      <span className="font-semibold">{discountPercent}% OFF</span>
      <span className="text-[10px]">
        {hours > 0 ? `${hours}h ` : ''}{minutes}m {seconds}s left
      </span>
    </Badge>
  );
}

