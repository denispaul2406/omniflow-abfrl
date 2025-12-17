import { Button } from '@/components/ui/button';

interface QuickActionsProps {
  actions: string[];
  onAction: (action: string) => void;
}

export function QuickActions({ actions, onAction }: QuickActionsProps) {
  return (
    <div className="flex flex-wrap gap-2 px-4 py-3 border-t border-border bg-secondary/30">
      {actions.map((action) => (
        <Button
          key={action}
          variant="outline"
          size="sm"
          className="rounded-full text-xs h-8 px-4 border-primary/30 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all font-medium"
          onClick={() => onAction(action)}
        >
          {action}
        </Button>
      ))}
    </div>
  );
}
