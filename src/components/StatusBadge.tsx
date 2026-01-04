import { Badge } from '@/components/ui/badge';
import { ApplicationStatus, STATUS_LABELS } from '@/types/application';

interface StatusBadgeProps {
  status: ApplicationStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant={status}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
