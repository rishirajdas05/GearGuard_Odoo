import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { useAuth } from '@/contexts/AuthContext';
import { LoginPage } from '@/pages/LoginPage';
import { CommandPalette } from '@/components/CommandPalette';
import { NotificationPanel } from '@/components/NotificationPanel';
import { PageTransition } from '@/components/PageTransition';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, isLoading } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center animate-pulse">
            <div className="h-5 w-5 rounded bg-primary/30" />
          </div>
          <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AppHeader 
            onOpenSearch={() => setSearchOpen(true)}
            onOpenNotifications={() => setNotificationsOpen(true)}
          />
          <main className="flex-1 overflow-auto p-6 bg-background">
            <div className="max-w-7xl mx-auto">
              <PageTransition>
                {children}
              </PageTransition>
            </div>
          </main>
        </div>
      </div>
      
      {/* Global overlays */}
      <CommandPalette open={searchOpen} onOpenChange={setSearchOpen} />
      <NotificationPanel open={notificationsOpen} onOpenChange={setNotificationsOpen} />
    </SidebarProvider>
  );
}
