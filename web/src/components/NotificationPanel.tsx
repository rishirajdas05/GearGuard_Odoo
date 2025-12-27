import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ClipboardList, Wrench, X, Clock } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { isOverdue, formatDate, getDaysOverdue } from '@/lib/helpers';

interface NotificationPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Notification {
  id: string;
  type: 'overdue' | 'assigned' | 'scrapped';
  title: string;
  description: string;
  timestamp: string;
  requestId?: string;
  equipmentId?: string;
  icon: typeof AlertTriangle;
  iconColor: string;
  bgColor: string;
}

export function NotificationPanel({ open, onOpenChange }: NotificationPanelProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { requests, equipment } = useData();

  // Generate notifications
  const notifications: Notification[] = React.useMemo(() => {
    const items: Notification[] = [];

    // Overdue requests
    requests.filter(r => isOverdue(r)).forEach(r => {
      const eq = equipment.find(e => e.id === r.equipmentId);
      const daysOverdue = getDaysOverdue(r);
      items.push({
        id: `overdue-${r.id}`,
        type: 'overdue',
        title: `Overdue: ${r.subject}`,
        description: `${eq?.name || 'Unknown'} · ${daysOverdue} day${daysOverdue !== 1 ? 's' : ''} overdue`,
        timestamp: r.scheduledDate || '',
        requestId: r.id,
        icon: AlertTriangle,
        iconColor: 'text-destructive',
        bgColor: 'bg-destructive/10',
      });
    });

    // Assigned to current user (technician)
    if (user?.role === 'technician') {
      requests
        .filter(r => r.assignedToId === user.id && r.stage !== 'repaired' && r.stage !== 'scrap')
        .forEach(r => {
          const eq = equipment.find(e => e.id === r.equipmentId);
          items.push({
            id: `assigned-${r.id}`,
            type: 'assigned',
            title: `Assigned: ${r.subject}`,
            description: `${eq?.name || 'Unknown'} · ${r.type}`,
            timestamp: r.updatedAt,
            requestId: r.id,
            icon: ClipboardList,
            iconColor: 'text-primary',
            bgColor: 'bg-primary/10',
          });
        });
    }

    // Recently scrapped equipment
    equipment
      .filter(e => e.isScrapped && e.scrappedAt)
      .sort((a, b) => new Date(b.scrappedAt!).getTime() - new Date(a.scrappedAt!).getTime())
      .slice(0, 3)
      .forEach(e => {
        items.push({
          id: `scrapped-${e.id}`,
          type: 'scrapped',
          title: `Scrapped: ${e.name}`,
          description: e.scrappedReason || 'Equipment marked as unusable',
          timestamp: e.scrappedAt!,
          equipmentId: e.id,
          icon: Wrench,
          iconColor: 'text-warning',
          bgColor: 'bg-warning/10',
        });
      });

    // Sort by timestamp
    return items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [requests, equipment, user]);

  const handleNotificationClick = (notification: Notification) => {
    onOpenChange(false);
    if (notification.requestId) {
      navigate(`/requests/${notification.requestId}/edit`);
    } else if (notification.equipmentId) {
      navigate(`/equipment/${notification.equipmentId}`);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-0">
        <SheetHeader className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-semibold">Notifications</SheetTitle>
            {notifications.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {notifications.length}
              </Badge>
            )}
          </div>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-80px)]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <ClipboardList className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">All caught up!</p>
              <p className="text-sm text-muted-foreground text-center">
                You have no notifications at the moment.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className="w-full flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors text-left"
                >
                  <div className={`h-9 w-9 rounded-lg ${notification.bgColor} flex items-center justify-center shrink-0`}>
                    <notification.icon className={`h-4 w-4 ${notification.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {notification.description}
                    </p>
                    <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(notification.timestamp)}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
