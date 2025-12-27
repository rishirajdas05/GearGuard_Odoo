import React from 'react';
import { Bell, Search, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import { isOverdue } from '@/lib/helpers';
import { getInitials } from '@/lib/helpers';

interface AppHeaderProps {
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
}

export function AppHeader({ onOpenSearch, onOpenNotifications }: AppHeaderProps) {
  const { user, logout } = useAuth();
  const { requests } = useData();
  const navigate = useNavigate();

  // Calculate notification count
  const overdueCount = requests.filter(r => isOverdue(r)).length;
  const assignedToMe = requests.filter(
    r => r.assignedToId === user?.id && r.stage !== 'repaired' && r.stage !== 'scrap'
  ).length;
  const notificationCount = overdueCount + (user?.role === 'technician' ? assignedToMe : 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const roleLabels: Record<string, string> = {
    admin: 'Administrator',
    manager: 'Manager',
    technician: 'Technician',
    requester: 'Requester',
  };

  const roleColors: Record<string, string> = {
    admin: 'bg-destructive/10 text-destructive border-destructive/20',
    manager: 'bg-primary/10 text-primary border-primary/20',
    technician: 'bg-success/10 text-success border-success/20',
    requester: 'bg-muted text-muted-foreground border-border',
  };

  return (
    <header className="h-14 border-b border-border flex items-center px-4 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <SidebarTrigger className="mr-4 -ml-1" />
      
      {/* Search trigger */}
      <Button
        variant="outline"
        size="sm"
        className="hidden sm:flex items-center gap-2 text-muted-foreground hover:text-foreground w-64 justify-start"
        onClick={onOpenSearch}
      >
        <Search className="h-4 w-4" />
        <span className="text-sm">Search...</span>
        <kbd className="ml-auto pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      {/* Mobile search button */}
      <Button
        variant="ghost"
        size="icon"
        className="sm:hidden"
        onClick={onOpenSearch}
      >
        <Search className="h-4 w-4" />
      </Button>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          onClick={onOpenNotifications}
        >
          <Bell className="h-4 w-4" />
          {notificationCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-medium flex items-center justify-center">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2">
              <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">
                {user ? getInitials(user.name) : 'U'}
              </div>
              <div className="hidden md:flex flex-col items-start text-left">
                <span className="text-sm font-medium leading-tight">{user?.name}</span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5">
              <Badge variant="outline" className={`text-xs ${roleColors[user?.role || 'requester']}`}>
                {roleLabels[user?.role || 'requester']}
              </Badge>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
