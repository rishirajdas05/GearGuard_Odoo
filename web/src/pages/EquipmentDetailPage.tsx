import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Wrench, AlertTriangle, Calendar, MapPin, User, Users } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';
import { EQUIPMENT_CATEGORIES } from '@/types';
import { formatDate } from '@/lib/helpers';
import { getUsers } from '@/lib/storage';

export function EquipmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { equipment, teams, requests } = useData();

  const eq = equipment.find(e => e.id === id);
  
  if (!eq) {
    return (
      <div className="animate-fade-in">
        <Button variant="ghost" onClick={() => navigate('/equipment')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Equipment
        </Button>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Equipment not found</p>
        </div>
      </div>
    );
  }

  const team = teams.find(t => t.id === eq.maintenanceTeamId);
  const users = getUsers();
  const defaultTechnician = users.find(u => u.id === eq.defaultTechnicianId);
  const categoryLabel = EQUIPMENT_CATEGORIES.find(c => c.value === eq.category)?.label || eq.category;
  
  const equipmentRequests = requests.filter(r => r.equipmentId === eq.id);
  const openRequestCount = equipmentRequests.filter(
    r => r.stage === 'new' || r.stage === 'in_progress'
  ).length;

  const isWarrantyExpired = new Date(eq.warrantyExpiry) < new Date();

  return (
    <div className="animate-fade-in">
      <Button variant="ghost" onClick={() => navigate('/equipment')} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Equipment
      </Button>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-semibold text-foreground">{eq.name}</h1>
            {eq.isScrapped && (
              <Badge variant="destructive" className="text-sm">
                <AlertTriangle className="h-3 w-3 mr-1" />
                SCRAPPED / UNUSABLE
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">Serial: {eq.serialNumber}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => navigate(`/requests?equipment=${eq.id}`)}
            variant="outline"
          >
            <Wrench className="h-4 w-4 mr-2" />
            Maintenance
            {openRequestCount > 0 && (
              <Badge variant="secondary" className="ml-2 bg-warning/10 text-warning">
                {openRequestCount}
              </Badge>
            )}
          </Button>
          <Button onClick={() => navigate(`/equipment/${eq.id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {eq.isScrapped && (
        <Card className="mb-6 border-destructive/50 bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-destructive">This equipment has been scrapped</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Scrapped on {formatDate(eq.scrappedAt!)}
                  {eq.scrappedReason && ` — ${eq.scrappedReason}`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">General Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="font-medium">{categoryLabel}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="font-medium">{eq.department}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{eq.location}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Owner</p>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{eq.ownerEmployeeName}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Purchase & Warranty</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Purchase Date</p>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{formatDate(eq.purchaseDate)}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Warranty Expiry</p>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className={`font-medium ${isWarrantyExpired ? 'text-destructive' : ''}`}>
                    {formatDate(eq.warrantyExpiry)}
                    {isWarrantyExpired && ' (Expired)'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Maintenance Assignment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Maintenance Team</p>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{team?.name || 'Unknown'}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Default Technician</p>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{defaultTechnician?.name || 'Unknown'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Request Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-3xl font-semibold text-foreground">{equipmentRequests.length}</p>
                <p className="text-sm text-muted-foreground">Total Requests</p>
              </div>
              <div>
                <p className="text-3xl font-semibold text-warning">{openRequestCount}</p>
                <p className="text-sm text-muted-foreground">Open Requests</p>
              </div>
            </div>
            {equipmentRequests.length > 0 && (
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => navigate(`/requests?equipment=${eq.id}`)}
              >
                View All Requests
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}