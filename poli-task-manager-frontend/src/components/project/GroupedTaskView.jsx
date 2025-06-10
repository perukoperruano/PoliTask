
import React, { useState } from 'react';
import TaskRow from './TaskRow'; // Changed from TaskItem
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { ChevronDown, ListChecks, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button'; // For "Añadir Tarea" button

const GroupedTaskView = ({ tasks, onTaskClick, statusOptions, allUsers, onNewTaskClick }) => {
  const [openStates, setOpenStates] = useState(() => {
    const initialStates = {};
    statusOptions.forEach(option => {
      initialStates[option.value] = true; // Abrir todos por defecto
    });
    return initialStates;
  });

  const toggleOpenState = (statusValue) => {
    setOpenStates(prev => ({ ...prev, [statusValue]: !prev[statusValue] }));
  };

  const tasksByStatus = statusOptions.map(statusOption => ({
    ...statusOption,
    tasks: tasks.filter(task => task.status === statusOption.value),
  }));

  if (tasks.length === 0) {
    return (
      <div className="text-center py-10 bg-card text-card-foreground rounded-lg shadow-sm p-6 border border-border">
        <ListChecks size={48} className="mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-medium text-foreground mb-2">
          No hay tareas que coincidan con los filtros activos.
        </h2>
        <p className="text-muted-foreground">
          Intenta ajustar los filtros o verifica si el proyecto tiene tareas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasksByStatus.map(group => {
        // Ensure group.Icon exists before trying to render it for the header tag
        const GroupTagIcon = group.Icon;

        return (
          <CollapsiblePrimitive.Root
            key={group.value}
            open={openStates[group.value]}
            onOpenChange={() => toggleOpenState(group.value)}
            className="bg-card border border-border rounded-lg shadow-sm"
          >
            <CollapsiblePrimitive.Trigger className="flex items-center w-full p-3 hover:bg-accent/50 rounded-t-lg group transition-colors duration-150">
              <ChevronDown
                className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${openStates[group.value] ? 'rotate-180' : ''} mr-2 flex-shrink-0`}
              />
              <span className={`flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${group.bgColor || 'bg-muted'} ${group.textColor || 'text-muted-foreground'}`}>
                {GroupTagIcon && <GroupTagIcon className={`w-3.5 h-3.5 mr-1.5 inline-block ${group.textColor || 'text-muted-foreground'}`} />}
                {group.label}
              </span>
              <span className="ml-2 text-sm text-muted-foreground mr-3">({group.tasks.length})</span>

              {onNewTaskClick && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); onNewTaskClick(group.value); }} // Pass status value if needed
                  className="ml-auto text-muted-foreground hover:text-primary text-xs px-2 py-1 h-auto"
                >
                  <Plus size={14} className="mr-1" />
                  Añadir Tarea
                </Button>
              )}
            </CollapsiblePrimitive.Trigger>
            <CollapsiblePrimitive.Content className="data-[state=open]:border-t data-[state=open]:border-border">
              {openStates[group.value] && ( // Only render content if open to improve performance for many groups
                <div className="px-3 pt-2 pb-1">
                  {/* Column Headers */}
                  <div className="flex text-xs text-muted-foreground mb-1.5 sticky top-0 bg-card z-10 py-1 -mx-3 px-3 border-b border-border">
                    <div className="w-1/2 pl-7">Nombre</div> {/* Adjusted pl for icon */}
                    <div className="w-[20%] text-left pl-2">Persona asignada</div>
                    <div className="w-[15%] text-center">Fecha límite</div>
                    <div className="w-[15%] text-left pl-2">Prioridad</div>
                  </div>
                  {group.tasks.length > 0 ? (
                    <div className="space-y-0"> {/* Removed border-t, TaskRow has its own border-b */}
                      <ul className="list-none p-0">
                        {group.tasks.map(task => (
                          <TaskRow key={task.id} task={task} onTaskClick={onTaskClick} allUsers={allUsers} />
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm py-4 px-1 text-center">No hay tareas en este estado.</p>
                  )}
                </div>
              )}
            </CollapsiblePrimitive.Content>
          </CollapsiblePrimitive.Root>
        );
      })}
    </div>
  );
};

export default GroupedTaskView;

