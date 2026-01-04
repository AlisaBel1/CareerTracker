import { Briefcase, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onAddClick: () => void;
}

export function EmptyState({ onAddClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in">
      <div className="p-6 rounded-full bg-primary/10 mb-6 shadow-glow">
        <Briefcase className="h-14 w-14 text-primary" />
      </div>

      <h2 className="text-2xl font-bold mb-2">Your job hunt starts here</h2>
      <p className="text-muted-foreground mb-6 max-w-sm">
        Track your applications, interviews, and offers all in one place.
        Stay organized and never miss an opportunity.
      </p>

      <Button
        onClick={onAddClick}
        className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg transition-all"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add your first application
      </Button>
    </div>
  );
}
