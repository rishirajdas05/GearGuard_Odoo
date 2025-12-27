import React, { useState } from 'react';
import { Shield, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function LoginPage() {
  const { users, login } = useAuth();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!selectedUser) {
      setError('Please select a user');
      return;
    }
    const success = login(selectedUser);
    if (!success) {
      setError('Login failed');
    }
  };

  const roleColors: Record<string, string> = {
    admin: 'bg-destructive/10 text-destructive border-destructive/20',
    manager: 'bg-primary/10 text-primary border-primary/20',
    technician: 'bg-success/10 text-success border-success/20',
    requester: 'bg-muted text-muted-foreground border-border',
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">GearGuard</CardTitle>
          <CardDescription>Ultimate Maintenance Tracker</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Select a demo user to continue:
          </p>
          <div className="space-y-2">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => {
                  setSelectedUser(user.email);
                  setError('');
                }}
                className={`w-full p-3 rounded-lg border text-left transition-all ${
                  selectedUser === user.email
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <Badge variant="outline" className={roleColors[user.role]}>
                    {user.role}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}
          <Button onClick={handleLogin} className="w-full" size="lg">
            Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}