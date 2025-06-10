
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { XCircle } from 'lucide-react';

const FilterPopoverContent = ({
  activeFilters,
  onFilterChange,
  onClearFilters,
  users,
  isLoadingUsers,
  priorityOptions,
  statusOptions,
}) => {
  return (
    <>
      <h4 className="font-medium leading-none text-foreground">Aplicar Filtros</h4>
      
      <div className="grid gap-2">
        <Label htmlFor="filter-status" className="text-muted-foreground">Estado</Label>
        <Select
          value={activeFilters.status}
          onValueChange={(value) => onFilterChange('status', value)}
        >
          <SelectTrigger id="filter-status" className="w-full bg-background border-input">
            <SelectValue placeholder="Seleccionar estado" />
          </SelectTrigger>
          <SelectContent className="bg-popover text-popover-foreground border-border">
            {statusOptions.map(option => (
              <SelectItem key={option.value} value={option.value} className="focus:bg-accent focus:text-accent-foreground">
                {option.Icon ? (
                  <div className="flex items-center">
                    <option.Icon className={`mr-2 h-4 w-4 ${option.colorClass || ''}`} />
                    <span className={option.colorClass || ''}>{option.label}</span>
                  </div>
                ) : (
                  option.label
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="filter-priority" className="text-muted-foreground">Prioridad</Label>
        <Select
          value={activeFilters.priority}
          onValueChange={(value) => onFilterChange('priority', value)}
        >
          <SelectTrigger id="filter-priority" className="w-full bg-background border-input">
            <SelectValue placeholder="Seleccionar prioridad" />
          </SelectTrigger>
          <SelectContent className="bg-popover text-popover-foreground border-border">
              {priorityOptions.map(option => (
              <SelectItem key={option.value} value={option.value} className="focus:bg-accent focus:text-accent-foreground">
                {option.Icon ? (
                  <div className="flex items-center">
                    <option.Icon className={`mr-2 h-4 w-4 ${option.colorClass || ''}`} />
                    <span className={option.colorClass || ''}>{option.label}</span>
                  </div>
                ) : (
                  option.label
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="filter-assignee" className="text-muted-foreground">Asignado a</Label>
        <Select
          value={activeFilters.assigneeId}
          onValueChange={(value) => onFilterChange('assigneeId', value)}
          disabled={isLoadingUsers || users.length === 0}
        >
          <SelectTrigger id="filter-assignee" className="w-full bg-background border-input">
            <SelectValue placeholder={isLoadingUsers ? "Cargando usuarios..." : "Seleccionar asignado"} />
          </SelectTrigger>
          <SelectContent className="bg-popover text-popover-foreground border-border">
            <SelectItem value="all" className="focus:bg-accent focus:text-accent-foreground">Todos los Usuarios</SelectItem>
            {users.map(user => (
              <SelectItem key={user.id} value={user.id} className="focus:bg-accent focus:text-accent-foreground">
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {users.length === 0 && !isLoadingUsers && <p className="text-xs text-muted-foreground">No hay usuarios para filtrar.</p>}
      </div>
      
      <Button variant="ghost" onClick={onClearFilters} className="w-full justify-start text-muted-foreground hover:text-foreground">
        <XCircle size={16} className="mr-2" />
        Limpiar todos los filtros
      </Button>
    </>
  );
};

export default FilterPopoverContent;
