import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { Equipment, MaintenanceRequest, MaintenanceTeam } from "@/types";
import { apiFetch } from "@/lib/api";
import {
  ApiEquipment,
  ApiRequest,
  ApiTeam,
  mapApiEquipment,
  mapApiRequest,
  mapApiTeam,
  toApiEquipmentCreate,
  toApiEquipmentUpdate,
  toApiRequestCreate,
  toApiRequestUpdate,
  toApiTeamCreate,
  toApiTeamUpdate,
} from "@/lib/mappers";
import { useAuth } from "@/contexts/AuthContext";

interface DataContextType {
  equipment: Equipment[];
  teams: MaintenanceTeam[];
  requests: MaintenanceRequest[];
  isLoadingData: boolean;
  refreshData: () => Promise<void>;

  addEquipment: (data: Omit<Equipment, "id" | "createdAt" | "updatedAt">) => Promise<Equipment>;
  updateEquipment: (id: string, data: Partial<Equipment>) => Promise<Equipment | undefined>;
  deleteEquipment: (id: string) => Promise<boolean>;

  addTeam: (data: Omit<MaintenanceTeam, "id">) => Promise<MaintenanceTeam>;
  updateTeam: (id: string, data: Partial<MaintenanceTeam>) => Promise<MaintenanceTeam | undefined>;
  deleteTeam: (id: string) => Promise<boolean>;

  addRequest: (data: Omit<MaintenanceRequest, "id" | "createdAt" | "updatedAt">) => Promise<MaintenanceRequest>;
  updateRequest: (id: string, data: Partial<MaintenanceRequest>) => Promise<MaintenanceRequest | undefined>;
  deleteRequest: (id: string) => Promise<boolean>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: isAuthLoading } = useAuth();

  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [teams, setTeams] = useState<MaintenanceTeam[]>([]);
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const refreshData = useCallback(async () => {
    if (!user) {
      setEquipment([]);
      setTeams([]);
      setRequests([]);
      return;
    }

    setIsLoadingData(true);
    try {
      const [apiEq, apiTeams, apiReq] = await Promise.all([
        apiFetch<ApiEquipment[]>("/api/v1/equipment", { method: "GET" }),
        apiFetch<ApiTeam[]>("/api/v1/teams", { method: "GET" }),
        apiFetch<ApiRequest[]>("/api/v1/requests", { method: "GET" }),
      ]);

      setEquipment(apiEq.map(mapApiEquipment));
      setTeams(apiTeams.map(mapApiTeam));
      setRequests(apiReq.map(mapApiRequest));
    } finally {
      setIsLoadingData(false);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthLoading) return;
    refreshData().catch(() => {});
  }, [isAuthLoading, refreshData]);

  const addEquipment = async (data: Omit<Equipment, "id" | "createdAt" | "updatedAt">) => {
    const created = await apiFetch<ApiEquipment>("/api/v1/equipment", {
      method: "POST",
      body: JSON.stringify(toApiEquipmentCreate(data)),
    });
    const mapped = mapApiEquipment(created);
    setEquipment((prev) => [mapped, ...prev]);
    return mapped;
  };

  const updateEquipment = async (id: string, data: Partial<Equipment>) => {
    const updated = await apiFetch<ApiEquipment>(`/api/v1/equipment/${id}`, {
      method: "PATCH",
      body: JSON.stringify(toApiEquipmentUpdate(data)),
    });
    const mapped = mapApiEquipment(updated);
    setEquipment((prev) => prev.map((e) => (e.id === id ? mapped : e)));
    return mapped;
  };

  const deleteEquipment = async (id: string) => {
    await apiFetch<void>(`/api/v1/equipment/${id}`, { method: "DELETE" });
    setEquipment((prev) => prev.filter((e) => e.id !== id));
    setRequests((prev) => prev.filter((r) => r.equipmentId !== id));
    return true;
  };

  const addTeam = async (data: Omit<MaintenanceTeam, "id">) => {
    const created = await apiFetch<ApiTeam>("/api/v1/teams", {
      method: "POST",
      body: JSON.stringify(toApiTeamCreate(data)),
    });
    const mapped = mapApiTeam(created);
    setTeams((prev) => [mapped, ...prev]);
    return mapped;
  };

  const updateTeam = async (id: string, data: Partial<MaintenanceTeam>) => {
    const updated = await apiFetch<ApiTeam>(`/api/v1/teams/${id}`, {
      method: "PATCH",
      body: JSON.stringify(toApiTeamUpdate(data)),
    });
    const mapped = mapApiTeam(updated);
    setTeams((prev) => prev.map((t) => (t.id === id ? mapped : t)));
    return mapped;
  };

  const deleteTeam = async (id: string) => {
    await apiFetch<void>(`/api/v1/teams/${id}`, { method: "DELETE" });
    setTeams((prev) => prev.filter((t) => t.id !== id));
    return true;
  };

  const addRequest = async (data: Omit<MaintenanceRequest, "id" | "createdAt" | "updatedAt">) => {
    const created = await apiFetch<ApiRequest>("/api/v1/requests", {
      method: "POST",
      body: JSON.stringify(toApiRequestCreate(data)),
    });
    const mapped = mapApiRequest(created);
    setRequests((prev) => [mapped, ...prev]);
    return mapped;
  };

  const updateRequest = async (id: string, data: Partial<MaintenanceRequest>) => {
    const updated = await apiFetch<ApiRequest>(`/api/v1/requests/${id}`, {
      method: "PATCH",
      body: JSON.stringify(toApiRequestUpdate(data)),
    });
    const mapped = mapApiRequest(updated);
    setRequests((prev) => prev.map((r) => (r.id === id ? mapped : r)));
    return mapped;
  };

  const deleteRequest = async (id: string) => {
    await apiFetch<void>(`/api/v1/requests/${id}`, { method: "DELETE" });
    setRequests((prev) => prev.filter((r) => r.id !== id));
    return true;
  };

  const value = useMemo(
    () => ({
      equipment,
      teams,
      requests,
      isLoadingData,
      refreshData,
      addEquipment,
      updateEquipment,
      deleteEquipment,
      addTeam,
      updateTeam,
      deleteTeam,
      addRequest,
      updateRequest,
      deleteRequest,
    }),
    [equipment, teams, requests, isLoadingData, refreshData]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}

