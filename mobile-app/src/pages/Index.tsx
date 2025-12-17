import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';
import { UserCard } from '@/components/UserCard';
import { Header } from '@/components/Header';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { setCurrentUser } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('name');
      
      if (!error && data) {
        setUsers(data as User[]);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const handleSelectUser = (user: User) => {
    setCurrentUser(user);
    navigate('/chat');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="px-5 py-6 max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight font-heading mb-2">Your Personal Fashion Assistant</h2>
          <p className="text-muted-foreground text-base">Shop across all channels, one seamless experience</p>
        </div>

        {/* Value Proposition Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <div className="bg-card border border-border rounded-lg p-4 shadow-soft animate-fade-in">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h3 className="font-semibold text-sm mb-1">Multi-Channel Shopping</h3>
            <p className="text-xs text-muted-foreground">Unified experience across web, mobile & WhatsApp</p>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-4 shadow-soft animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="font-semibold text-sm mb-1">AI-Powered Recommendations</h3>
            <p className="text-xs text-muted-foreground">Personalized suggestions based on your style</p>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-4 shadow-soft animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-sm mb-1">Instant Checkout</h3>
            <p className="text-xs text-muted-foreground">Seamless purchase from conversation to cart</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Select Your Profile</h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="w-12 h-12 rounded-full gradient-sun-spinner opacity-20"></div>
              <Loader2 className="h-8 w-8 animate-spin text-primary absolute inset-0 m-auto" />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user, index) => (
              <div 
                key={user.id} 
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <UserCard user={user} onClick={() => handleSelectUser(user)} />
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 pt-8 border-t border-border">
          <p className="text-center text-xs text-muted-foreground">
            Powered by <span className="font-semibold text-foreground">ABFRL</span> • Aditya Birla Fashion & Retail
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
