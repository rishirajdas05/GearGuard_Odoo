import { User, MaintenanceTeam, Equipment, MaintenanceRequest } from '@/types';
import { seedUsers, seedTeams, seedEquipment, seedRequests } from './seed-data';

const STORAGE_KEYS = {
  USERS: 'gearguard_users',
  TEAMS: 'gearguard_teams',
  EQUIPMENT: 'gearguard_equipment',
  REQUESTS: 'gearguard_requests',
  CURRENT_USER: 'gearguard_current_user',
  INITIALIZED: 'gearguard_initialized',
};

function getItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function initializeStorage(): void {
  if (!localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
    setItem(STORAGE_KEYS.USERS, seedUsers);
    setItem(STORAGE_KEYS.TEAMS, seedTeams);
    setItem(STORAGE_KEYS.EQUIPMENT, seedEquipment);
    setItem(STORAGE_KEYS.REQUESTS, seedRequests);
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  }
}

export function resetStorage(): void {
  localStorage.removeItem(STORAGE_KEYS.INITIALIZED);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  initializeStorage();
}

// Users
export const getUsers = (): User[] => getItem(STORAGE_KEYS.USERS, seedUsers);
export const getUser = (id: string): User | undefined => getUsers().find(u => u.id === id);
export const setUsers = (users: User[]): void => setItem(STORAGE_KEYS.USERS, users);

export const getCurrentUser = (): User | null => getItem(STORAGE_KEYS.CURRENT_USER, null);
export const setCurrentUser = (user: User | null): void => setItem(STORAGE_KEYS.CURRENT_USER, user);

// Teams
export const getTeams = (): MaintenanceTeam[] => getItem(STORAGE_KEYS.TEAMS, seedTeams);
export const getTeam = (id: string): MaintenanceTeam | undefined => getTeams().find(t => t.id === id);
export const setTeams = (teams: MaintenanceTeam[]): void => setItem(STORAGE_KEYS.TEAMS, teams);

export const createTeam = (team: Omit<MaintenanceTeam, 'id'>): MaintenanceTeam => {
  const teams = getTeams();
  const newTeam = { ...team, id: `team-${Date.now()}` };
  setTeams([...teams, newTeam]);
  return newTeam;
};

export const updateTeam = (id: string, data: Partial<MaintenanceTeam>): MaintenanceTeam | undefined => {
  const teams = getTeams();
  const index = teams.findIndex(t => t.id === id);
  if (index === -1) return undefined;
  teams[index] = { ...teams[index], ...data };
  setTeams(teams);
  return teams[index];
};

export const deleteTeam = (id: string): boolean => {
  const teams = getTeams();
  const filtered = teams.filter(t => t.id !== id);
  if (filtered.length === teams.length) return false;
  setTeams(filtered);
  return true;
};

// Equipment
export const getEquipmentList = (): Equipment[] => getItem(STORAGE_KEYS.EQUIPMENT, seedEquipment);
export const getEquipment = (id: string): Equipment | undefined => getEquipmentList().find(e => e.id === id);
export const setEquipmentList = (equipment: Equipment[]): void => setItem(STORAGE_KEYS.EQUIPMENT, equipment);

export const createEquipment = (equipment: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>): Equipment => {
  const list = getEquipmentList();
  const now = new Date().toISOString();
  const newEquipment: Equipment = {
    ...equipment,
    id: `eq-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  };
  setEquipmentList([...list, newEquipment]);
  return newEquipment;
};

export const updateEquipment = (id: string, data: Partial<Equipment>): Equipment | undefined => {
  const list = getEquipmentList();
  const index = list.findIndex(e => e.id === id);
  if (index === -1) return undefined;
  list[index] = { ...list[index], ...data, updatedAt: new Date().toISOString() };
  setEquipmentList(list);
  return list[index];
};

export const deleteEquipment = (id: string): boolean => {
  const list = getEquipmentList();
  const filtered = list.filter(e => e.id !== id);
  if (filtered.length === list.length) return false;
  setEquipmentList(filtered);
  return true;
};

// Requests
export const getRequests = (): MaintenanceRequest[] => getItem(STORAGE_KEYS.REQUESTS, seedRequests);
export const getRequest = (id: string): MaintenanceRequest | undefined => getRequests().find(r => r.id === id);
export const setRequests = (requests: MaintenanceRequest[]): void => setItem(STORAGE_KEYS.REQUESTS, requests);

export const createRequest = (request: Omit<MaintenanceRequest, 'id' | 'createdAt' | 'updatedAt'>): MaintenanceRequest => {
  const list = getRequests();
  const now = new Date().toISOString();
  const newRequest: MaintenanceRequest = {
    ...request,
    id: `req-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  };
  setRequests([...list, newRequest]);
  return newRequest;
};

export const updateRequest = (id: string, data: Partial<MaintenanceRequest>): MaintenanceRequest | undefined => {
  const list = getRequests();
  const index = list.findIndex(r => r.id === id);
  if (index === -1) return undefined;
  list[index] = { ...list[index], ...data, updatedAt: new Date().toISOString() };
  setRequests(list);
  return list[index];
};

export const deleteRequest = (id: string): boolean => {
  const list = getRequests();
  const filtered = list.filter(r => r.id !== id);
  if (filtered.length === list.length) return false;
  setRequests(filtered);
  return true;
};