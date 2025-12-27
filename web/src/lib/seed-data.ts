import { User, MaintenanceTeam, Equipment, MaintenanceRequest, EquipmentCategory } from '@/types';

export const seedUsers: User[] = [
  { id: 'user-1', email: 'admin@gearguard.com', name: 'Alex Admin', role: 'admin' },
  { id: 'user-2', email: 'manager@gearguard.com', name: 'Morgan Manager', role: 'manager' },
  { id: 'user-3', email: 'tech1@gearguard.com', name: 'Taylor Tech', role: 'technician', teamId: 'team-1' },
  { id: 'user-4', email: 'tech2@gearguard.com', name: 'Jordan Wright', role: 'technician', teamId: 'team-2' },
  { id: 'user-5', email: 'requester@gearguard.com', name: 'Riley Request', role: 'requester' },
];

export const seedTeams: MaintenanceTeam[] = [
  { id: 'team-1', name: 'Mechanics', description: 'Heavy machinery and mechanical systems', memberIds: ['user-3'] },
  { id: 'team-2', name: 'Electricians', description: 'Electrical systems and wiring', memberIds: ['user-4'] },
  { id: 'team-3', name: 'IT Support', description: 'IT equipment and networks', memberIds: [] },
];

const today = new Date();
const formatDate = (d: Date) => d.toISOString().split('T')[0];
const daysAgo = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return formatDate(d);
};
const daysFromNow = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return formatDate(d);
};

export const seedEquipment: Equipment[] = [
  {
    id: 'eq-1', name: 'CNC Milling Machine', serialNumber: 'CNC-2021-001', category: 'machinery',
    department: 'Production', ownerEmployeeName: 'John Smith', purchaseDate: '2021-03-15',
    warrantyExpiry: '2026-03-15', location: 'Building A - Floor 1', maintenanceTeamId: 'team-1',
    defaultTechnicianId: 'user-3', isScrapped: false, createdAt: daysAgo(300), updatedAt: daysAgo(10),
  },
  {
    id: 'eq-2', name: 'Industrial Lathe', serialNumber: 'LAT-2020-045', category: 'machinery',
    department: 'Production', ownerEmployeeName: 'John Smith', purchaseDate: '2020-07-22',
    warrantyExpiry: '2025-07-22', location: 'Building A - Floor 1', maintenanceTeamId: 'team-1',
    defaultTechnicianId: 'user-3', isScrapped: false, createdAt: daysAgo(400), updatedAt: daysAgo(5),
  },
  {
    id: 'eq-3', name: 'Main Electrical Panel', serialNumber: 'ELP-2019-003', category: 'electrical',
    department: 'Facilities', ownerEmployeeName: 'Mike Johnson', purchaseDate: '2019-01-10',
    warrantyExpiry: '2024-01-10', location: 'Building B - Utility Room', maintenanceTeamId: 'team-2',
    defaultTechnicianId: 'user-4', isScrapped: false, createdAt: daysAgo(500), updatedAt: daysAgo(15),
  },
  {
    id: 'eq-4', name: 'Rooftop HVAC Unit', serialNumber: 'HVAC-2022-012', category: 'hvac',
    department: 'Facilities', ownerEmployeeName: 'Mike Johnson', purchaseDate: '2022-05-01',
    warrantyExpiry: '2027-05-01', location: 'Building A - Roof', maintenanceTeamId: 'team-2',
    defaultTechnicianId: 'user-4', isScrapped: false, createdAt: daysAgo(200), updatedAt: daysAgo(3),
  },
  {
    id: 'eq-5', name: 'Server Rack #1', serialNumber: 'SRV-2023-001', category: 'it_equipment',
    department: 'IT', ownerEmployeeName: 'Sarah Lee', purchaseDate: '2023-02-20',
    warrantyExpiry: '2028-02-20', location: 'Server Room', maintenanceTeamId: 'team-3',
    defaultTechnicianId: 'user-3', isScrapped: false, createdAt: daysAgo(150), updatedAt: daysAgo(8),
  },
  {
    id: 'eq-6', name: 'Forklift #2', serialNumber: 'FLT-2018-002', category: 'vehicles',
    department: 'Warehouse', ownerEmployeeName: 'Tom Brown', purchaseDate: '2018-11-30',
    warrantyExpiry: '2023-11-30', location: 'Warehouse A', maintenanceTeamId: 'team-1',
    defaultTechnicianId: 'user-3', isScrapped: false, createdAt: daysAgo(600), updatedAt: daysAgo(20),
  },
  {
    id: 'eq-7', name: 'Emergency Generator', serialNumber: 'GEN-2020-001', category: 'electrical',
    department: 'Facilities', ownerEmployeeName: 'Mike Johnson', purchaseDate: '2020-09-15',
    warrantyExpiry: '2025-09-15', location: 'Building B - Outdoor', maintenanceTeamId: 'team-2',
    defaultTechnicianId: 'user-4', isScrapped: false, createdAt: daysAgo(450), updatedAt: daysAgo(12),
  },
  {
    id: 'eq-8', name: 'Old Conveyor Belt', serialNumber: 'CNV-2015-003', category: 'machinery',
    department: 'Production', ownerEmployeeName: 'John Smith', purchaseDate: '2015-06-01',
    warrantyExpiry: '2020-06-01', location: 'Building A - Floor 2', maintenanceTeamId: 'team-1',
    defaultTechnicianId: 'user-3', isScrapped: true, scrappedAt: daysAgo(30), scrappedReason: 'Motor failure beyond repair',
    createdAt: daysAgo(800), updatedAt: daysAgo(30),
  },
];

export const seedRequests: MaintenanceRequest[] = [
  {
    id: 'req-1', type: 'corrective', subject: 'CNC Machine vibration issue',
    description: 'Unusual vibration detected during operation', equipmentId: 'eq-1',
    equipmentCategory: 'machinery', maintenanceTeamId: 'team-1', stage: 'new',
    createdById: 'user-5', createdAt: daysAgo(2), updatedAt: daysAgo(2),
  },
  {
    id: 'req-2', type: 'corrective', subject: 'Lathe coolant leak',
    description: 'Coolant leaking from the main reservoir', equipmentId: 'eq-2',
    equipmentCategory: 'machinery', maintenanceTeamId: 'team-1', stage: 'in_progress',
    assignedToId: 'user-3', createdById: 'user-5', createdAt: daysAgo(5), updatedAt: daysAgo(3),
  },
  {
    id: 'req-3', type: 'preventive', subject: 'Monthly electrical panel inspection',
    description: 'Routine monthly inspection of main electrical panel', equipmentId: 'eq-3',
    equipmentCategory: 'electrical', maintenanceTeamId: 'team-2', stage: 'new',
    scheduledDate: daysFromNow(5), createdById: 'user-2', createdAt: daysAgo(10), updatedAt: daysAgo(10),
  },
  {
    id: 'req-4', type: 'preventive', subject: 'HVAC filter replacement',
    description: 'Quarterly filter replacement and inspection', equipmentId: 'eq-4',
    equipmentCategory: 'hvac', maintenanceTeamId: 'team-2', stage: 'repaired',
    scheduledDate: daysAgo(7), durationHours: 2, assignedToId: 'user-4',
    createdById: 'user-2', createdAt: daysAgo(20), updatedAt: daysAgo(7),
  },
  {
    id: 'req-5', type: 'corrective', subject: 'Server overheating',
    description: 'Server rack temperature exceeding normal range', equipmentId: 'eq-5',
    equipmentCategory: 'it_equipment', maintenanceTeamId: 'team-3', stage: 'in_progress',
    createdById: 'user-5', createdAt: daysAgo(1), updatedAt: daysAgo(1),
  },
  {
    id: 'req-6', type: 'corrective', subject: 'Forklift brake issue',
    description: 'Brakes making squeaking noise', equipmentId: 'eq-6',
    equipmentCategory: 'vehicles', maintenanceTeamId: 'team-1', stage: 'repaired',
    durationHours: 4, assignedToId: 'user-3', createdById: 'user-5',
    createdAt: daysAgo(15), updatedAt: daysAgo(12),
  },
  {
    id: 'req-7', type: 'preventive', subject: 'Generator monthly test run',
    description: 'Monthly test run and inspection', equipmentId: 'eq-7',
    equipmentCategory: 'electrical', maintenanceTeamId: 'team-2', stage: 'new',
    scheduledDate: daysAgo(3), createdById: 'user-2', createdAt: daysAgo(15), updatedAt: daysAgo(15),
  },
  {
    id: 'req-8', type: 'corrective', subject: 'Conveyor belt motor failure',
    description: 'Motor completely failed, equipment unusable', equipmentId: 'eq-8',
    equipmentCategory: 'machinery', maintenanceTeamId: 'team-1', stage: 'scrap',
    durationHours: 8, assignedToId: 'user-3', createdById: 'user-5',
    createdAt: daysAgo(35), updatedAt: daysAgo(30),
  },
  {
    id: 'req-9', type: 'preventive', subject: 'CNC annual calibration',
    description: 'Annual precision calibration check', equipmentId: 'eq-1',
    equipmentCategory: 'machinery', maintenanceTeamId: 'team-1', stage: 'new',
    scheduledDate: daysFromNow(14), createdById: 'user-2', createdAt: daysAgo(5), updatedAt: daysAgo(5),
  },
  {
    id: 'req-10', type: 'corrective', subject: 'Electrical panel buzzing',
    description: 'Unusual buzzing sound from panel section B', equipmentId: 'eq-3',
    equipmentCategory: 'electrical', maintenanceTeamId: 'team-2', stage: 'new',
    scheduledDate: daysAgo(5), createdById: 'user-5', createdAt: daysAgo(8), updatedAt: daysAgo(8),
  },
  {
    id: 'req-11', type: 'preventive', subject: 'Lathe lubrication service',
    description: 'Scheduled lubrication and bearing check', equipmentId: 'eq-2',
    equipmentCategory: 'machinery', maintenanceTeamId: 'team-1', stage: 'repaired',
    scheduledDate: daysAgo(10), durationHours: 3, assignedToId: 'user-3',
    createdById: 'user-2', createdAt: daysAgo(25), updatedAt: daysAgo(10),
  },
  {
    id: 'req-12', type: 'corrective', subject: 'HVAC thermostat malfunction',
    description: 'Thermostat not responding to adjustments', equipmentId: 'eq-4',
    equipmentCategory: 'hvac', maintenanceTeamId: 'team-2', stage: 'in_progress',
    assignedToId: 'user-4', createdById: 'user-5', createdAt: daysAgo(3), updatedAt: daysAgo(2),
  },
  {
    id: 'req-13', type: 'preventive', subject: 'Forklift safety inspection',
    description: 'Quarterly safety inspection and certification', equipmentId: 'eq-6',
    equipmentCategory: 'vehicles', maintenanceTeamId: 'team-1', stage: 'new',
    scheduledDate: daysFromNow(7), createdById: 'user-2', createdAt: daysAgo(3), updatedAt: daysAgo(3),
  },
  {
    id: 'req-14', type: 'corrective', subject: 'Generator fuel leak',
    description: 'Small fuel leak detected near fuel line', equipmentId: 'eq-7',
    equipmentCategory: 'electrical', maintenanceTeamId: 'team-2', stage: 'repaired',
    durationHours: 5, assignedToId: 'user-4', createdById: 'user-5',
    createdAt: daysAgo(20), updatedAt: daysAgo(18),
  },
  {
    id: 'req-15', type: 'preventive', subject: 'Server UPS battery check',
    description: 'Check UPS batteries and replace if needed', equipmentId: 'eq-5',
    equipmentCategory: 'it_equipment', maintenanceTeamId: 'team-3', stage: 'new',
    scheduledDate: daysFromNow(21), createdById: 'user-2', createdAt: daysAgo(7), updatedAt: daysAgo(7),
  },
];