import { ChatMessage } from '@/types';
import { ProductCard } from './ProductCard';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatBubbleProps {
  message: ChatMessage;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isAgent = message.type === 'agent';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "flex gap-3",
        isAgent ? "justify-start" : "justify-end"
      )}
    >
      {isAgent && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-soft">
          <Bot className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
      
      <div className={cn("max-w-[85%] space-y-3", !isAgent && "order-first")}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className={cn(
            "px-4 py-3 text-sm whitespace-pre-line",
            isAgent 
              ? "chat-bubble-agent" 
              : "chat-bubble-user"
          )}
        >
          {message.content}
        </motion.div>
        
        {message.products && message.products.length > 0 && (
          <div className="space-y-2">
            {message.products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: isAgent ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
              >
                <ProductCard product={product} compact />
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      {!isAgent && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
          <User className="w-4 h-4 text-muted-foreground" />
        </div>
      )}
    </motion.div>
  );
}
