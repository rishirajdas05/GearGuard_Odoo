import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Wrench, ClipboardList, ArrowRight } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';
import { EQUIPMENT_CATEGORIES, REQUEST_STAGES } from '@/types';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();
  const { equipment, requests, teams } = useData();
  const [search, setSearch] = useState('');

  // Filter results based on search
  const filteredEquipment = useMemo(() => {
    if (!search) return equipment.slice(0, 5);
    const lowerSearch = search.toLowerCase();
    return equipment
      .filter(e => 
        e.name.toLowerCase().includes(lowerSearch) ||
        e.serialNumber.toLowerCase().includes(lowerSearch) ||
        e.department.toLowerCase().includes(lowerSearch)
      )
      .slice(0, 5);
  }, [equipment, search]);

  const filteredRequests = useMemo(() => {
    if (!search) return requests.slice(0, 5);
    const lowerSearch = search.toLowerCase();
    return requests
      .filter(r => 
        r.subject.toLowerCase().includes(lowerSearch) ||
        r.description.toLowerCase().includes(lowerSearch)
      )
      .slice(0, 5);
  }, [requests, search]);

  const handleSelect = (type: 'equipment' | 'request', id: string) => {
    onOpenChange(false);
    setSearch('');
    if (type === 'equipment') {
      navigate(`/equipment/${id}`);
    } else {
      navigate(`/requests/${id}/edit`);
    }
  };

  const getEquipmentBadge = (eq: typeof equipment[0]) => {
    if (eq.isScrapped) return <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Scrapped</Badge>;
    const category = EQUIPMENT_CATEGORIES.find(c => c.value === eq.category);
    return <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{category?.label || eq.category}</Badge>;
  };

  const getStageBadge = (stage: string) => {
    const stageInfo = REQUEST_STAGES.find(s => s.value === stage);
    const colors: Record<string, string> = {
      new: 'bg-muted text-muted-foreground',
      in_progress: 'bg-info/10 text-info',
      repaired: 'bg-success/10 text-success',
      scrap: 'bg-destructive/10 text-destructive',
    };
    return (
      <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${colors[stage] || ''}`}>
        {stageInfo?.label || stage}
      </Badge>
    );
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [onOpenChange, open]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput 
        placeholder="Search equipment and requests..." 
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        {filteredEquipment.length > 0 && (
          <CommandGroup heading="Equipment">
            {filteredEquipment.map((eq) => (
              <CommandItem
                key={eq.id}
                value={`equipment-${eq.id}`}
                onSelect={() => handleSelect('equipment', eq.id)}
                className="flex items-center gap-3 py-3"
              >
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Wrench className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{eq.name}</span>
                    {getEquipmentBadge(eq)}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {eq.serialNumber} · {eq.department}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        
        {filteredEquipment.length > 0 && filteredRequests.length > 0 && (
          <CommandSeparator />
        )}
        
        {filteredRequests.length > 0 && (
          <CommandGroup heading="Maintenance Requests">
            {filteredRequests.map((req) => {
              const eq = equipment.find(e => e.id === req.equipmentId);
              return (
                <CommandItem
                  key={req.id}
                  value={`request-${req.id}`}
                  onSelect={() => handleSelect('request', req.id)}
                  className="flex items-center gap-3 py-3"
                >
                  <div className="h-8 w-8 rounded-lg bg-warning/10 flex items-center justify-center">
                    <ClipboardList className="h-4 w-4 text-warning" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{req.subject}</span>
                      {getStageBadge(req.stage)}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {eq?.name || 'Unknown Equipment'} · {req.type}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
