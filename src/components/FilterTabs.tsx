import { ApplicationStatus, STATUS_LABELS } from '@/types/application';
import { cn } from '@/lib/utils';

interface FilterTabsProps {
  activeFilter: ApplicationStatus | 'all';
  onFilterChange: (filter: ApplicationStatus | 'all') => void;
  counts: Record<ApplicationStatus | 'all', number>;
}

export function FilterTabs({ activeFilter, onFilterChange, counts }: FilterTabsProps) {
  const filters: (ApplicationStatus | 'all')[] = [
    'all',
    'applied',
    'hr-call',
    'technical',
    'offer',
    'rejected',
    'no-response',
  ];

  const getLabel = (filter: ApplicationStatus | 'all') => {
    if (filter === 'all') return 'All';
    return STATUS_LABELS[filter];
  };

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            activeFilter === filter
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          {getLabel(filter)}
          <span className="ml-2 text-xs opacity-70">({counts[filter]})</span>
        </button>
      ))}
    </div>
  );
}
