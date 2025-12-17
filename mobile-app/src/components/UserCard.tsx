import { User } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Star, Award } from 'lucide-react';

interface UserCardProps {
  user: User;
  onClick: () => void;
}

const tierConfig = {
  Gold: { icon: Crown, className: 'bg-loyalty-gold/10 text-loyalty-gold border-loyalty-gold/30' },
  Silver: { icon: Star, className: 'bg-loyalty-silver/10 text-loyalty-silver border-loyalty-silver/30' },
  Bronze: { icon: Award, className: 'bg-loyalty-bronze/10 text-loyalty-bronze border-loyalty-bronze/30' }
};

// Get avatar URL based on user profile
const getAvatarUrl = (user: User): string => {
  if (user.avatar_url) {
    return user.avatar_url;
  }
  
  const userName = user.name.toLowerCase();
  
  // Use custom local avatar images
  if (userName.includes('aarav')) {
    // Aarav: Gen Z, Casual, Bewakoof fan - young male avatar
    return '/aarav.jpg';
  } else if (userName.includes('rohan')) {
    // Rohan: Professional, Finance Professional - professional male avatar
    return '/rohan.jpg';
  } else if (userName.includes('priya')) {
    // Priya: Premium Gold member, Ethnic & Traditional wear - elegant female avatar with traditional styling
    return '/priya.jpg';
  }
  
  // Default fallback
  return '/placeholder-user.jpg';
};

export function UserCard({ user, onClick }: UserCardProps) {
  const tier = tierConfig[user.loyalty_tier as keyof typeof tierConfig] || tierConfig.Bronze;
  const TierIcon = tier.icon;

  return (
    <Card 
      className="cursor-pointer transition-all duration-250 hover:shadow-medium hover:-translate-y-1 active:scale-[0.98] border-0 shadow-soft overflow-hidden group"
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="relative">
            <img 
              src={getAvatarUrl(user)}
              alt={user.name}
              className="w-16 h-16 rounded-xl object-cover bg-secondary transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                // Fallback to a simpler avatar if the main one fails
                const target = e.target as HTMLImageElement;
                if (!target.src.includes('dicebear.com')) {
                  target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`;
                }
              }}
            />
            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${tier.className} border-2 border-background shadow-soft`}>
              <TierIcon className="w-3 h-3" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="font-semibold text-foreground truncate">{user.name}</h3>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-primary/30 text-primary">
                Multi-Channel
              </Badge>
              {user.loyalty_tier === 'Gold' && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md border-0">
                  ✨ Gold Member
                </Badge>
              )}
              {user.loyalty_tier === 'Silver' && (
                <Badge className="bg-loyalty-silver text-white text-[10px] font-semibold px-2 py-0.5 rounded-full border-0">
                  Silver
                </Badge>
              )}
              {user.loyalty_tier === 'Bronze' && (
                <Badge className="bg-loyalty-bronze text-white text-[10px] font-semibold px-2 py-0.5 rounded-full border-0">
                  Bronze
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{user.style_preference}</p>
            
            <div className="flex flex-wrap gap-1.5 mt-2">
              {user.favorite_brands?.slice(0, 2).map(brand => (
                <Badge 
                  key={brand} 
                  variant="secondary"
                  className="text-xs font-medium"
                >
                  {brand}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <span>Size: <span className="font-semibold text-foreground">{user.size}</span></span>
              <span>Points: <span className="font-semibold text-primary">{user.loyalty_points}</span></span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
