import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus, Clock } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';
import { isOverdue } from '@/lib/helpers';

export function CalendarPage() {
  const navigate = useNavigate();
  const { requests, equipment } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Get preventive requests with scheduled dates
  const preventiveRequests = useMemo(() => {
    return requests.filter(r => r.type === 'preventive' && r.scheduledDate);
  }, [requests]);

  const getRequestsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return preventiveRequests.filter(r => r.scheduledDate === dateStr);
  };

  const getEquipmentName = (equipmentId: string) => {
    return equipment.find(e => e.id === equipmentId)?.name || 'Unknown';
  };

  const handleDateClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    navigate(`/requests/new?date=${dateStr}`);
  };

  const days = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-24 sm:h-32 border border-border/50 bg-muted/20" />);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayRequests = getRequestsForDate(day);
    const today = new Date();
    const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

    days.push(
      <div 
        key={day} 
        className={`h-24 sm:h-32 border border-border/50 p-1 sm:p-2 overflow-hidden hover:bg-muted/30 transition-colors cursor-pointer ${
          isToday ? 'bg-primary/5 border-primary/30' : ''
        }`}
        onClick={() => handleDateClick(day)}
      >
        <div className="flex items-center justify-between mb-1">
          <span className={`text-sm font-medium ${isToday ? 'text-primary' : 'text-foreground'}`}>
            {day}
          </span>
          {dayRequests.length > 0 && (
            <Badge variant="secondary" className="text-xs h-5 px-1.5">
              {dayRequests.length}
            </Badge>
          )}
        </div>
        <div className="space-y-1 overflow-hidden">
          {dayRequests.slice(0, 2).map(req => {
            const overdue = isOverdue(req);
            return (
              <div
                key={req.id}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/requests/${req.id}/edit`);
                }}
                className={`text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 ${
                  overdue 
                    ? 'bg-destructive/10 text-destructive' 
                    : 'bg-primary/10 text-primary'
                }`}
              >
                {req.subject}
              </div>
            );
          })}
          {dayRequests.length > 2 && (
            <div className="text-xs text-muted-foreground">
              +{dayRequests.length - 2} more
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Calendar" description="Preventive maintenance schedule">
        <Button onClick={() => navigate('/requests/new')} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          New Request
        </Button>
      </PageHeader>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold">
              {monthNames[month]} {year}
            </h2>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-px">
            {dayNames.map(name => (
              <div key={name} className="h-10 flex items-center justify-center text-sm font-medium text-muted-foreground bg-muted/50">
                {name}
              </div>
            ))}
            {days}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardContent className="p-4">
          <h3 className="font-medium mb-3">Upcoming Preventive Maintenance</h3>
          <div className="space-y-2">
            {preventiveRequests
              .filter(r => new Date(r.scheduledDate!) >= new Date())
              .sort((a, b) => new Date(a.scheduledDate!).getTime() - new Date(b.scheduledDate!).getTime())
              .slice(0, 5)
              .map(req => (
                <div 
                  key={req.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
                  onClick={() => navigate(`/requests/${req.id}/edit`)}
                >
                  <div>
                    <p className="font-medium text-sm">{req.subject}</p>
                    <p className="text-xs text-muted-foreground">{getEquipmentName(req.equipmentId)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{req.scheduledDate}</span>
                  </div>
                </div>
              ))}
            {preventiveRequests.filter(r => new Date(r.scheduledDate!) >= new Date()).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No upcoming preventive maintenance scheduled
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}