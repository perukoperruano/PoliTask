
import React from 'react';
import UserAvatar from '../UserAvatar';
import {
  CheckCircle, Circle, XCircle, Ban, FileSearch2, Archive,
  ChevronUp, BarChartBig, ChevronDown, Tag as PriorityTagIcon,
  CalendarDays,
  ListTodo as InProgressIcon,
  Clock
} from 'lucide-react';

const getTaskStatusVisuals = (status) => {
  status = status ? status.toUpperCase() : 'PENDING';
  switch (status) {
    case 'DONE': return { Icon: CheckCircle, color: 'text-green-500' };
    case 'CLOSED': return { Icon: Archive, color: 'text-green-600' };
    case 'IN PROGRESS': return { Icon: InProgressIcon, color: 'text-blue-500' };
    case 'IN REVIEW': return { Icon: FileSearch2, color: 'text-purple-500' };
    case 'BLOCKED': return { Icon: Ban, color: 'text-red-500' };
    case 'REJECTED': return { Icon: XCircle, color: 'text-stone-500' };
    case 'PENDING': return { Icon: Clock, color: 'text-yellow-500' };
    default: return { Icon: Circle, color: 'text-gray-400' };
  }
};

const getPriorityVisuals = (priority) => {
  switch (priority) {
    case 'alta': return { Icon: ChevronUp, label: 'Alta', color: 'text-red-500' };
    case 'media': return { Icon: BarChartBig, label: 'Media', color: 'text-yellow-500' };
    case 'baja': return { Icon: ChevronDown, label: 'Baja', color: 'text-green-500' };
    default: return { Icon: PriorityTagIcon, label: priority || 'No asignada', color: 'text-gray-400' };
  }
};

const TaskRow = ({ task, onTaskClick, allUsers = [] }) => {
  const { Icon: StatusIcon, color: statusColor } = getTaskStatusVisuals(task.status);
  const { Icon: PrioIcon, label: prioLabel, color: prioColor } = getPriorityVisuals(task.priority);

  const assignee = task.assignee_id ? allUsers.find(u => u.id === task.assignee_id) : null;

  return (
    <div
      className="flex items-center py-2.5 px-1 border-b border-border last:border-b-0 hover:bg-accent/50 transition-colors duration-150 cursor-pointer group"
      onClick={() => onTaskClick(task.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onTaskClick(task.id);}}
    >
      {/* Column 1: Status Icon + Title (Nombre) */}
      <div className="w-1/2 flex items-center pr-2 min-w-0"> {/* min-w-0 for truncate */}
        <StatusIcon size={18} className={`mr-2 flex-shrink-0 ${statusColor}`} />
        <span className="text-sm text-foreground truncate group-hover:text-primary" title={task.title}>
          {task.title}
        </span>
      </div>

      {/* Column 2: Assignee (Persona asignada) */}
      <div className="w-[20%] flex items-center justify-start pl-2">
        {assignee ? (
          <UserAvatar name={assignee.name} imageUrl={assignee.avatar_url} size="xs" />
        ) : (
          <span className="text-xs text-muted-foreground">-</span>
        )}
      </div>

      {/* Column 3: Due Date (Fecha límite) */}
      <div className="w-[15%] flex items-center justify-center text-muted-foreground">
        {task.due_date ? (
          <div className="flex items-center text-xs">
            <CalendarDays size={14} className="mr-1 flex-shrink-0" />
            <span className="truncate">
              {new Date(task.due_date).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}
            </span>
          </div>
        ) : (
          <span className="text-xs">-</span>
        )}
      </div>

      {/* Column 4: Priority (Prioridad) */}
      <div className="w-[15%] flex items-center justify-start pl-2 text-muted-foreground">
        <PrioIcon size={16} className={`mr-1 flex-shrink-0 ${prioColor}`} />
        <span className={`text-xs ${prioColor} truncate`}>{prioLabel}</span>
      </div>
    </div>
  );
};

export default TaskRow;
