import { Equipment, MaintenanceRequest, MaintenanceTeam, User, UserRole } from "@/types";

/**
 * Backend uses snake_case; frontend uses camelCase.
 * These helpers keep the UI unchanged while integrating with the FastAPI API.
 */

export type ApiUser = {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  team_id?: string | null;
  avatar_url?: string | null;
};

export function mapApiUser(u: ApiUser): User {
  return {
    id: u.id,
    email: u.email,
    name: u.full_name,
    role: u.role,
    teamId: u.team_id ?? undefined,
    avatar: u.avatar_url ?? undefined,
  };
}

export type ApiTeam = {
  id: string;
  name: string;
  description?: string | null;
  member_ids: string[];
};

export function mapApiTeam(t: ApiTeam): MaintenanceTeam {
  return {
    id: t.id,
    name: t.name,
    description: t.description ?? undefined,
    memberIds: t.member_ids ?? [],
  };
}

export type ApiEquipment = {
  id: string;
  name: string;
  serial_number: string;
  category: Equipment["category"];
  department: string;
  owner_employee_name: string;
  purchase_date: string | null;
  warranty_expiry: string | null;
  location: string;
  maintenance_team_id: string;
  default_technician_id: string;
  is_scrapped: boolean;
  scrapped_at?: string | null;
  scrapped_reason?: string | null;
  created_at: string;
  updated_at: string;
};

export function mapApiEquipment(e: ApiEquipment): Equipment {
  return {
    id: e.id,
    name: e.name,
    serialNumber: e.serial_number,
    category: e.category,
    department: e.department,
    ownerEmployeeName: e.owner_employee_name,
    purchaseDate: e.purchase_date ?? "",
    warrantyExpiry: e.warranty_expiry ?? "",
    location: e.location,
    maintenanceTeamId: e.maintenance_team_id,
    defaultTechnicianId: e.default_technician_id,
    isScrapped: e.is_scrapped,
    scrappedAt: e.scrapped_at ?? undefined,
    scrappedReason: e.scrapped_reason ?? undefined,
    createdAt: e.created_at,
    updatedAt: e.updated_at,
  };
}

export function toApiEquipmentCreate(data: Omit<Equipment, "id" | "createdAt" | "updatedAt">) {
  return {
    name: data.name,
    serial_number: data.serialNumber,
    category: data.category,
    department: data.department,
    owner_employee_name: data.ownerEmployeeName,
    purchase_date: data.purchaseDate || null,
    warranty_expiry: data.warrantyExpiry || null,
    location: data.location,
    maintenance_team_id: data.maintenanceTeamId,
    default_technician_id: data.defaultTechnicianId,
  };
}

export function toApiEquipmentUpdate(data: Partial<Equipment>) {
  return {
    name: data.name,
    serial_number: data.serialNumber,
    category: data.category,
    department: data.department,
    owner_employee_name: data.ownerEmployeeName,
    purchase_date: data.purchaseDate ?? undefined,
    warranty_expiry: data.warrantyExpiry ?? undefined,
    location: data.location,
    maintenance_team_id: data.maintenanceTeamId,
    default_technician_id: data.defaultTechnicianId,
    is_scrapped: data.isScrapped,
    scrapped_reason: data.scrappedReason,
  };
}

export type ApiRequest = {
  id: string;
  type: MaintenanceRequest["type"];
  subject: string;
  description: string;
  equipment_id: string;
  equipment_category: MaintenanceRequest["equipmentCategory"];
  maintenance_team_id: string;
  stage: MaintenanceRequest["stage"];
  scheduled_date?: string | null;
  duration_hours?: number | null;
  assigned_to_id?: string | null;
  created_by_id: string;
  created_at: string;
  updated_at: string;
};

export function mapApiRequest(r: ApiRequest): MaintenanceRequest {
  return {
    id: r.id,
    type: r.type,
    subject: r.subject,
    description: r.description,
    equipmentId: r.equipment_id,
    equipmentCategory: r.equipment_category,
    maintenanceTeamId: r.maintenance_team_id,
    stage: r.stage,
    scheduledDate: r.scheduled_date ?? undefined,
    durationHours: r.duration_hours ?? undefined,
    assignedToId: r.assigned_to_id ?? undefined,
    createdById: r.created_by_id,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export function toApiRequestCreate(data: Omit<MaintenanceRequest, "id" | "createdAt" | "updatedAt">) {
  return {
    type: data.type,
    subject: data.subject,
    description: data.description,
    equipment_id: data.equipmentId,
    equipment_category: data.equipmentCategory,
    maintenance_team_id: data.maintenanceTeamId,
    stage: data.stage,
    scheduled_date: data.scheduledDate ?? null,
    duration_hours: data.durationHours ?? null,
    assigned_to_id: data.assignedToId ?? null,
    created_by_id: data.createdById,
  };
}

export function toApiRequestUpdate(data: Partial<MaintenanceRequest>) {
  return {
    type: data.type,
    subject: data.subject,
    description: data.description,
    equipment_id: data.equipmentId,
    equipment_category: data.equipmentCategory,
    maintenance_team_id: data.maintenanceTeamId,
    stage: data.stage,
    scheduled_date: data.scheduledDate ?? undefined,
    duration_hours: data.durationHours ?? undefined,
    assigned_to_id: data.assignedToId ?? undefined,
  };
}

export function toApiTeamCreate(data: Omit<MaintenanceTeam, "id">) {
  return {
    name: data.name,
    description: data.description ?? null,
    member_ids: data.memberIds ?? [],
  };
}

export function toApiTeamUpdate(data: Partial<MaintenanceTeam>) {
  return {
    name: data.name,
    description: data.description ?? undefined,
    member_ids: data.memberIds ?? undefined,
  };
}

