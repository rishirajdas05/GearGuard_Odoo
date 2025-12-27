import { MaintenanceRequest, RequestStage } from '@/types';

export function isOverdue(request: MaintenanceRequest): boolean {
  if (request.stage === 'repaired' || request.stage === 'scrap') {
    return false;
  }
  if (!request.scheduledDate) {
    return false;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const scheduled = new Date(request.scheduledDate);
  scheduled.setHours(0, 0, 0, 0);
  return scheduled < today;
}

export function getDaysOverdue(request: MaintenanceRequest): number {
  if (!request.scheduledDate) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const scheduled = new Date(request.scheduledDate);
  scheduled.setHours(0, 0, 0, 0);
  const diff = today.getTime() - scheduled.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getStageColor(stage: RequestStage): string {
  switch (stage) {
    case 'new':
      return 'bg-primary/10 text-primary border-primary/20';
    case 'in_progress':
      return 'bg-warning/10 text-warning border-warning/20';
    case 'repaired':
      return 'bg-success/10 text-success border-success/20';
    case 'scrap':
      return 'bg-destructive/10 text-destructive border-destructive/20';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}