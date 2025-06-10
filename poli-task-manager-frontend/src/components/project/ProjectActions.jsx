
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Plus, Filter, LayoutList, LayoutGrid } from 'lucide-react';
import FilterPopoverContent from './FilterPopoverContent';

const ProjectActions = ({
  onNewTaskClick,
  activeFilters,
  onFilterChange,
  onClearFilters,
  users,
  isLoadingUsers,
  priorityOptions,
  statusOptions,
  filterButtonText,
  viewMode,
  onViewModeChange,
}) => {
  return (
    <div className="flex flex-wrap justify-between items-center mb-6 gap-4 p-1">
      <Button
        onClick={onNewTaskClick}
        variant="default"
        className="bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Plus size={20} className="mr-2" />
        Nueva Tarea
      </Button>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 p-1 bg-muted rounded-md">
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('list')}
            aria-label="Vista de lista"
            title="Vista de lista"
            className={`px-2 ${viewMode === 'list' ? 'shadow-sm' : ''}`}
          >
            <LayoutList className="h-5 w-5" />
          </Button>
          <Button
            variant={viewMode === 'grouped' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('grouped')}
            aria-label="Vista agrupada"
            title="Vista agrupada"
            className={`px-2 ${viewMode === 'grouped' ? 'shadow-sm' : ''}`}
          >
            <LayoutGrid className="h-5 w-5" />
          </Button>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="text-foreground border-border hover:bg-accent hover:text-accent-foreground"
            >
              <Filter size={18} className="mr-2" /> {filterButtonText}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-card text-card-foreground border-border p-4 space-y-4">
            <FilterPopoverContent
              activeFilters={activeFilters}
              onFilterChange={onFilterChange}
              onClearFilters={onClearFilters}
              users={users}
              isLoadingUsers={isLoadingUsers}
              priorityOptions={priorityOptions}
              statusOptions={statusOptions}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default ProjectActions;

