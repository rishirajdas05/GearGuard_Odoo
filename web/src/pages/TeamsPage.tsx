import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Trash2, Edit } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';
import { getUsers } from '@/lib/storage';

export function TeamsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { teams, addTeam, updateTeam, deleteTeam, requests } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<string | null>(null);
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');

  const users = getUsers();
  const technicians = users.filter(u => u.role === 'technician');

  const getTeamMembers = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return [];
    return technicians.filter(t => team.memberIds.includes(t.id));
  };

  const getTeamRequestCount = (teamId: string) => {
    return requests.filter(r => r.maintenanceTeamId === teamId).length;
  };

  const handleOpenDialog = (team?: typeof teams[0]) => {
    if (team) {
      setEditingTeam(team.id);
      setTeamName(team.name);
      setTeamDescription(team.description || '');
    } else {
      setEditingTeam(null);
      setTeamName('');
      setTeamDescription('');
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!teamName.trim()) {
      toast({ title: 'Team name is required', variant: 'destructive' });
      return;
    }

    if (editingTeam) {
      updateTeam(editingTeam, { name: teamName, description: teamDescription });
      toast({ title: 'Team updated successfully' });
    } else {
      addTeam({ name: teamName, description: teamDescription, memberIds: [] });
      toast({ title: 'Team created successfully' });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (teamId: string) => {
    const requestCount = getTeamRequestCount(teamId);
    if (requestCount > 0) {
      toast({ 
        title: 'Cannot delete team', 
        description: `This team has ${requestCount} associated requests`,
        variant: 'destructive' 
      });
      return;
    }
    deleteTeam(teamId);
    toast({ title: 'Team deleted successfully' });
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title="Teams" description="Manage maintenance teams">
        <Button onClick={() => handleOpenDialog()} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Team
        </Button>
      </PageHeader>

      {teams.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No teams yet"
          description="Create your first maintenance team"
          action={
            <Button onClick={() => handleOpenDialog()} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Team
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map(team => {
            const members = getTeamMembers(team.id);
            const requestCount = getTeamRequestCount(team.id);
            
            return (
              <Card key={team.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base font-medium">{team.name}</CardTitle>
                      {team.description && (
                        <p className="text-sm text-muted-foreground mt-1">{team.description}</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleOpenDialog(team)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(team.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Members ({members.length})</p>
                      {members.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {members.map(member => (
                            <Badge key={member.id} variant="secondary">
                              {member.name}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No members assigned</p>
                      )}
                    </div>
                    <div className="pt-2 border-t border-border">
                      <p className="text-sm">
                        <span className="text-muted-foreground">Total Requests: </span>
                        <span className="font-medium">{requestCount}</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTeam ? 'Edit Team' : 'Create Team'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Team Name</Label>
              <Input
                id="name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g., Mechanics"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                value={teamDescription}
                onChange={(e) => setTeamDescription(e.target.value)}
                placeholder="e.g., Heavy machinery maintenance"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingTeam ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}