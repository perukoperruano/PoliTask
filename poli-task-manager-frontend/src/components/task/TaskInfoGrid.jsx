import React from 'react';
import { Tag, Clock, List as ListIcon, CheckSquare, ChevronUp, ChevronDown, UserCircle, CalendarDays, BarChartBig, Ban, FileSearch, XOctagon, Archive } from 'lucide-react';
import UserAvatar from '../UserAvatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { differenceInCalendarDays, isPast, formatDistanceToNowStrict, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

// Helper functions and constants
const getPriorityInfo = (priority) => {
  switch (priority) {
    case 'alta': return { text: 'Alta', icon: <ChevronUp size={16} />, color: 'text-red-500', bgColorClass: 'bg-red-100 dark:bg-red-900/50', circleColorClass: 'bg-red-500' };
    case 'media': return { text: 'Media', icon: <BarChartBig size={16} />, color: 'text-yellow-500', bgColorClass: 'bg-yellow-100 dark:bg-yellow-900/50', circleColorClass: 'bg-yellow-500' };
    case 'baja': return { text: 'Baja', icon: <ChevronDown size={16} />, color: 'text-green-500', bgColorClass: 'bg-green-100 dark:bg-green-900/50', circleColorClass: 'bg-green-500' };
    default: return { text: priority || 'No asignada', icon: <Tag size={16} />, color: 'text-gray-500', bgColorClass: 'bg-gray-100 dark:bg-gray-700/50', circleColorClass: 'bg-gray-500' };
  }
};

const priorityOptions = [
  { value: 'alta', label: 'Alta', info: getPriorityInfo('alta') },
  { value: 'media', label: 'Media', info: getPriorityInfo('media') },
  { value: 'baja', label: 'Baja', info: getPriorityInfo('baja') },
];

const getStatusInfo = (status) => {
  switch (status ? status.toUpperCase() : 'PENDING') { // Default to PENDING if status is null/undefined
    case 'PENDING': 
      return { text: 'Pendiente', icon: <Clock size={16} />, color: 'text-yellow-800', bgColorClass: 'bg-yellow-200', circleColorClass: 'bg-yellow-200' };
    case 'IN PROGRESS': 
      return { text: 'En Progreso', icon: <ListIcon size={16} />, color: 'text-blue-800', bgColorClass: 'bg-blue-200', circleColorClass: 'bg-blue-200' };
    case 'BLOCKED': 
      return { text: 'Bloqueada', icon: <Ban size={16} />, color: 'text-red-800', bgColorClass: 'bg-red-200', circleColorClass: 'bg-red-200' };
    case 'IN REVIEW': 
      return { text: 'En Revisión', icon: <FileSearch size={16} />, color: 'text-purple-800', bgColorClass: 'bg-purple-200', circleColorClass: 'bg-purple-200' };
    case 'DONE': 
      return { text: 'Terminada', icon: <CheckSquare size={16} />, color: 'text-green-800', bgColorClass: 'bg-green-200', circleColorClass: 'bg-green-200' };
    case 'REJECTED': 
      return { text: 'Rechazada', icon: <XOctagon size={16} />, color: 'text-stone-900', bgColorClass: 'bg-stone-400', circleColorClass: 'bg-stone-400' };
    case 'CLOSED': 
      return { text: 'Cerrada', icon: <Archive size={16} />, color: 'text-white', bgColorClass: 'bg-green-700', circleColorClass: 'bg-green-700' };
    // Fallback for old statuses if they appear, map them or provide a default
    case 'PENDIENTE': // Assuming old value
      return { text: 'Pendiente', icon: <Clock size={16} />, color: 'text-yellow-800', bgColorClass: 'bg-yellow-200', circleColorClass: 'bg-yellow-200' };
    case 'EN_PROGRESO': // Assuming old value
      return { text: 'En Progreso', icon: <ListIcon size={16} />, color: 'text-blue-800', bgColorClass: 'bg-blue-200', circleColorClass: 'bg-blue-200' };
    case 'COMPLETADA': // Assuming old value
      return { text: 'Terminada', icon: <CheckSquare size={16} />, color: 'text-green-800', bgColorClass: 'bg-green-200', circleColorClass: 'bg-green-200' };
    default: 
      return { text: status || 'Desconocido', icon: <Tag size={16} />, color: 'text-gray-500', bgColorClass: 'bg-gray-100 dark:bg-gray-700/50', circleColorClass: 'bg-gray-500' };
  }
};

const statusOptions = [
  { value: 'PENDING', label: 'Pendiente', info: getStatusInfo('PENDING') },
  { value: 'IN PROGRESS', label: 'En Progreso', info: getStatusInfo('IN PROGRESS') },
  { value: 'BLOCKED', label: 'Bloqueada', info: getStatusInfo('BLOCKED') },
  { value: 'IN REVIEW', label: 'En Revisión', info: getStatusInfo('IN REVIEW') },
  { value: 'DONE', label: 'Terminada', info: getStatusInfo('DONE') },
  { value: 'REJECTED', label: 'Rechazada', info: getStatusInfo('REJECTED') },
  { value: 'CLOSED', label: 'Cerrada', info: getStatusInfo('CLOSED') },
];

const formatFullDate = (isoString) => {
  if (!isoString) return 'No especificada';
  return new Date(isoString).toLocaleDateString('es-CO', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
};

const getDueDateStatus = (dueDateString) => {
  if (!dueDateString) return null;
  const dueDate = parseISO(dueDateString);
  const today = new Date();
  
  if (isPast(dueDate) && !differenceInCalendarDays(dueDate, today) === 0) { // Check if it's past and not today
     return `Vencida ${formatDistanceToNowStrict(dueDate, { addSuffix: true, locale: es })}`;
  }

  const daysRemaining = differenceInCalendarDays(dueDate, today);

  if (daysRemaining === 0) return "Vence hoy";
  if (daysRemaining === 1) return "Vence mañana";
  if (daysRemaining > 1) return `Vence en ${daysRemaining} días`;
  // If it's past but was today, it might fall through, formatDistanceToNowStrict handles "hace X horas" if needed.
  // For simplicity, if it's past and not caught above, we'll rely on formatDistanceToNowStrict
  if (daysRemaining < 0) return `Vencida ${formatDistanceToNowStrict(dueDate, { addSuffix: true, locale: es })}`; // Redundant given isPast, but safe

  return null; 
};


const TaskInfoGrid = ({ task, allUsers, assignee, isUpdatingTask, isLoading, handleAssigneeChange, handleStatusChange, handlePriorityChange }) => {
  if (!task) return null;

  const currentPriorityInfo = getPriorityInfo(task.priority);
  const currentStatusInfo = getStatusInfo(task.status || 'PENDING'); 
  const dueDateStatus = getDueDateStatus(task.due_date);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
      
      {/* Prioridad (Select) */}
      <div className="flex flex-col">
        <label htmlFor="task-priority" className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5 flex items-center">
           {currentPriorityInfo.icon && React.cloneElement(currentPriorityInfo.icon, { className: `mr-1.5 ${currentPriorityInfo.color}`, size:14 })}
          Prioridad:
        </label>
        <Select
          value={task.priority || 'media'}
          onValueChange={handlePriorityChange}
          disabled={isUpdatingTask || isLoading}
        >
          <SelectTrigger id="task-priority" className="text-sm">
            <SelectValue placeholder="Seleccionar prioridad..." />
          </SelectTrigger>
          <SelectContent>
            {priorityOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center">
                  <span className={`w-2.5 h-2.5 ${option.info.circleColorClass} rounded-full mr-2 border border-gray-300 dark:border-gray-600`}></span>
                  {option.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Estado (Select) */}
      <div className="flex flex-col">
        <label htmlFor="task-status" className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5 flex items-center">
          {currentStatusInfo.icon && React.cloneElement(currentStatusInfo.icon, { className: `mr-1.5 ${currentStatusInfo.color}`, size:14 })}
          Estado:
        </label>
        <Select
          value={task.status || 'PENDING'}
          onValueChange={handleStatusChange}
          disabled={isUpdatingTask || isLoading}
        >
          <SelectTrigger id="task-status" className="text-sm">
            <SelectValue placeholder="Seleccionar estado..." />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center">
                  <span className={`w-2.5 h-2.5 ${option.info.circleColorClass} rounded-full mr-2 border border-gray-300 dark:border-gray-600`}></span>
                  {option.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Asignado a (Select) */}
      <div className="flex flex-col">
        <label htmlFor="task-assignee" className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5 flex items-center">
          {assignee && assignee.name ? (
            <UserAvatar name={assignee.name} size="xs" className="mr-1.5" />
          ) : (
            <UserCircle size={14} className="mr-1.5 text-gray-400 dark:text-gray-500" />
          )}
          Asignado a:
        </label>
        <Select
          value={task.assignee_id || 'none'}
          onValueChange={handleAssigneeChange}
          disabled={isUpdatingTask || isLoading || !allUsers || allUsers.length === 0}
        >
          <SelectTrigger id="task-assignee" className="text-sm">
            <SelectValue placeholder="Seleccionar asignado..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No asignado</SelectItem>
            {allUsers && allUsers.map(user => (
              <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Fecha de Vencimiento */}
      {task.due_date && (
        <div className="flex flex-col">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">Vencimiento</span>
          <div className="flex items-baseline">
            <CalendarDays size={14} className="mr-1.5 mt-px flex-shrink-0" />
            <span className="flex-grow">
              {formatFullDate(task.due_date)}
              {dueDateStatus && (
                <span className={`block text-xs ${isPast(parseISO(task.due_date)) && differenceInCalendarDays(parseISO(task.due_date), new Date()) !== 0 ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'} mt-0.5`}>
                  ({dueDateStatus})
                </span>
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskInfoGrid;
