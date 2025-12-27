export type UserRole = 'admin' | 'manager' | 'technician' | 'requester';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  teamId?: string;
  avatar?: string;
}

export interface MaintenanceTeam {
  id: string;
  name: string;
  description?: string;
  memberIds: string[];
}

export type EquipmentCategory = 
  | 'machinery' 
  | 'electrical' 
  | 'hvac' 
  | 'plumbing' 
  | 'it_equipment' 
  | 'vehicles' 
  | 'safety' 
  | 'other';

export interface Equipment {
  id: string;
  name: string;
  serialNumber: string;
  category: EquipmentCategory;
  department: string;
  ownerEmployeeName: string;
  purchaseDate: string;
  warrantyExpiry: string;
  location: string;
  maintenanceTeamId: string;
  defaultTechnicianId: string;
  isScrapped: boolean;
  scrappedAt?: string;
  scrappedReason?: string;
  createdAt: string;
  updatedAt: string;
}

export type RequestType = 'corrective' | 'preventive';
export type RequestStage = 'new' | 'in_progress' | 'repaired' | 'scrap';

export interface MaintenanceRequest {
  id: string;
  type: RequestType;
  subject: string;
  description: string;
  equipmentId: string;
  equipmentCategory: EquipmentCategory;
  maintenanceTeamId: string;
  stage: RequestStage;
  scheduledDate?: string;
  durationHours?: number;
  assignedToId?: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export const EQUIPMENT_CATEGORIES: { value: EquipmentCategory; label: string }[] = [
  { value: 'machinery', label: 'Machinery' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'hvac', label: 'HVAC' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'it_equipment', label: 'IT Equipment' },
  { value: 'vehicles', label: 'Vehicles' },
  { value: 'safety', label: 'Safety Equipment' },
  { value: 'other', label: 'Other' },
];

export const DEPARTMENTS = [
  'Production',
  'Warehouse',
  'Office',
  'IT',
  'Facilities',
  'Quality Control',
];

export const REQUEST_STAGES: { value: RequestStage; label: string; color: string }[] = [
  { value: 'new', label: 'New', color: 'bg-primary/10 text-primary' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-warning/10 text-warning' },
  { value: 'repaired', label: 'Repaired', color: 'bg-success/10 text-success' },
  { value: 'scrap', label: 'Scrap', color: 'bg-destructive/10 text-destructive' },
];