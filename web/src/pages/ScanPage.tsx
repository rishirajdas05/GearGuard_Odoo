import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Camera, CameraOff, CheckCircle2, Copy, QrCode, Search, TriangleAlert } from "lucide-react";

import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

import { useQrScanner } from "@/hooks/use-qr-scanner";
import { getEquipment } from "@/lib/storage"; // fallback (works in your current build)
import type { Equipment } from "@/types";

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL as string | undefined;

function resolveEquipmentId(raw: string): string | null {
  const value = raw.trim();

  // If QR contains URL like https://domain.com/scan/<id>
  try {
    if (value.startsWith("http://") || value.startsWith("https://")) {
      const u = new URL(value);
      const parts = u.pathname.split("/").filter(Boolean);
      // .../scan/:id
      const scanIdx = parts.findIndex((p) => p === "scan");
      if (scanIdx !== -1 && parts[scanIdx + 1]) return parts[scanIdx + 1];
      // .../equipment/:id
      const eqIdx = parts.findIndex((p) => p === "equipment");
      if (eqIdx !== -1 && parts[eqIdx + 1]) return parts[eqIdx + 1];
    }
  } catch {
    // ignore URL parse
  }

  // If QR contains JSON {"equipmentId":"..."}
  try {
    const obj = JSON.parse(value);
    if (obj?.equipmentId && typeof obj.equipmentId === "string") return obj.equipmentId;
    if (obj?.id && typeof obj.id === "string") return obj.id;
  } catch {
    // ignore JSON parse
  }

  // Otherwise assume it's the equipment ID itself
  if (value.length >= 6) return value;
  return null;
}

async function fetchPublicEquipment(equipmentId: string): Promise<Equipment | null> {
  // Try backend public endpoint first (recommended)
  if (API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/public/equipment/${equipmentId}`, {
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        const data = await res.json();

        // Map snake_case -> camelCase
        const eq: Equipment = {
          id: data.id,
          name: data.name,
          serialNumber: data.serial_number,
          category: data.category,
          department: data.department,
          ownerEmployeeName: data.owner_employee_name,
          purchaseDate: data.purchase_date ?? "",
          warrantyExpiry: data.warranty_expiry ?? "",
          location: data.location,
          maintenanceTeamId: data.maintenance_team_id,
          defaultTechnicianId: data.default_technician_id,
          isScrapped: Boolean(data.is_scrapped),
          scrappedAt: data.scrapped_at ?? undefined,
          scrappedReason: data.scrapped_reason ?? undefined,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };

        return eq;
      }
    } catch {
      // ignore and fallback
    }
  }

  // Fallback to your current localStorage (so scan works even before backend is wired)
  const local = getEquipment(equipmentId);
  return local ?? null;
}

export function ScanPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [input, setInput] = useState(id ?? "");
  const [loading, setLoading] = useState(false);
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const onDetect = useCallback(
    (rawValue: string) => {
      const eid = resolveEquipmentId(rawValue);
      if (!eid) {
        toast({
          title: "Couldn’t read equipment ID",
          description: "Try scanning again or paste the equipment ID manually.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "QR detected",
        description: `Equipment ID: ${eid}`,
      });

      // Navigate to deep-link so it can be shared
      navigate(`/scan/${eid}`);
    },
    [navigate, toast]
  );

  const scanner = useQrScanner({ onDetect });

  const canUseCamera = useMemo(() => {
    return !!navigator.mediaDevices?.getUserMedia;
  }, []);

  const loadEquipment = useCallback(async (equipmentId: string) => {
    setLoading(true);
    setErrMsg(null);
    setEquipment(null);

    try {
      const eq = await fetchPublicEquipment(equipmentId);
      if (!eq) {
        setErrMsg("Equipment not found. Check the QR/ID and try again.");
        return;
      }
      setEquipment(eq);
    } catch (e: any) {
      setErrMsg(e?.message ?? "Failed to fetch equipment.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!id) {
      setEquipment(null);
      setErrMsg(null);
      return;
    }
    setInput(id);
    loadEquipment(id);
  }, [id, loadEquipment]);

  const handleSearch = async () => {
    const eid = resolveEquipmentId(input);
    if (!eid) {
      toast({
        title: "Enter a valid ID / QR text",
        description: "Paste the QR content or the equipment ID.",
        variant: "destructive",
      });
      return;
    }
    navigate(`/scan/${eid}`);
  };

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Copied" });
    } catch {
      toast({ title: "Copy failed", variant: "destructive" });
    }
  };

  const scanLink = id ? `${window.location.origin}/scan/${id}` : `${window.location.origin}/scan`;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Scan QR"
        description="Scan an equipment QR to view details instantly (works best on HTTPS/localhost)."
      >
        <div className="flex items-center gap-2">
          {scanner.isRunning ? (
            <Button variant="outline" onClick={scanner.stop}>
              <CameraOff className="h-4 w-4 mr-2" />
              Stop
            </Button>
          ) : (
            <Button
              onClick={scanner.start}
              disabled={!canUseCamera || !scanner.isBarcodeDetectorSupported}
            >
              <Camera className="h-4 w-4 mr-2" />
              Start Camera
            </Button>
          )}
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scanner + Manual */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Scan / Paste
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {scanner.error && (
              <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">
                <TriangleAlert className="h-4 w-4 text-destructive mt-0.5" />
                <div>
                  <p className="font-medium text-destructive">Camera/Scan Issue</p>
                  <p className="text-muted-foreground">{scanner.error}</p>
                </div>
              </div>
            )}

            <div className="rounded-xl overflow-hidden border bg-muted/20">
              <video ref={scanner.videoRef} className="w-full aspect-video bg-black" playsInline muted />
            </div>

            <Separator />

            <div className="space-y-2">
              <p className="text-sm font-medium">Manual lookup</p>
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Paste QR content or Equipment ID"
                />
                <Button onClick={handleSearch} variant="secondary">
                  <Search className="h-4 w-4 mr-2" />
                  Find
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Tip: QR can encode a link like <span className="font-mono">/scan/&lt;equipmentId&gt;</span>
              </p>
            </div>

            <Separator />

            <div className="flex items-center justify-between gap-2">
              <p className="text-xs text-muted-foreground truncate">
                Shareable scan link: <span className="font-mono">{scanLink}</span>
              </p>
              <Button variant="outline" size="sm" onClick={() => copyText(scanLink)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Result */}
        <Card>
          <CardHeader>
            <CardTitle>Equipment</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="text-sm text-muted-foreground">Loading equipment…</div>
            )}

            {!loading && errMsg && (
              <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">
                <TriangleAlert className="h-4 w-4 text-destructive mt-0.5" />
                <div>
                  <p className="font-medium text-destructive">Not found</p>
                  <p className="text-muted-foreground">{errMsg}</p>
                </div>
              </div>
            )}

            {!loading && !errMsg && !equipment && (
              <div className="text-sm text-muted-foreground">
                Scan a QR or enter an equipment ID to see details here.
              </div>
            )}

            {!loading && equipment && (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">{equipment.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      Serial: <span className="font-mono">{equipment.serialNumber}</span>
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="secondary">{equipment.category}</Badge>
                    {equipment.isScrapped && (
                      <Badge className="bg-destructive/10 text-destructive">Scrapped</Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Department</p>
                    <p className="font-medium">{equipment.department}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-medium">{equipment.location}</p>
                  </div>
                  <div className="rounded-lg border p-3 col-span-2">
                    <p className="text-xs text-muted-foreground">Owner</p>
                    <p className="font-medium">{equipment.ownerEmployeeName}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button asChild>
                    <Link to={`/equipment/${equipment.id}`}>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Open Equipment
                    </Link>
                  </Button>

                  <Button variant="secondary" asChild>
                    <Link to={`/requests/new?equipment=${encodeURIComponent(equipment.id)}`}>
                      Create Request
                    </Link>
                  </Button>

                  <Button variant="outline" onClick={() => copyText(equipment.id)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy ID
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground">
                  If you’re using the backend, the scan page can be fully public via <span className="font-mono">/api/v1/public/equipment/:id</span>.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

