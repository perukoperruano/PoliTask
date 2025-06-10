
import React from 'react';
import { ChevronUp, Tag, ChevronDown, Clock, List as ListIcon, SquareCheck, MessageSquare, Ban, FileSearch, XOctagon, Archive, BarChartBig } from 'lucide-react';

/**
 * Componente para mostrar un ítem de tarea con diseño mejorado.
 * @param {object} props - Propiedades del componente.
 * @param {object} props.task - Objeto de la tarea.
 * @param {function} props.onClick - Función a llamar al hacer clic en la tarea.
 */
const TaskItem = ({ task, onClick }) => {
  const getPriorityInfo = (priority) => {
    switch (priority) {
      case 'alta':
        return { icon: <ChevronUp size={16} className="mr-1 text-red-500" />, label: 'Alta', color: 'text-red-500', bgColor: 'bg-red-100 dark:bg-red-500/20', borderColorClass: 'border-red-500' };
      case 'media':
        return { icon: <BarChartBig size={16} className="mr-1 text-yellow-500" />, label: 'Media', color: 'text-yellow-500', bgColor: 'bg-yellow-100 dark:bg-yellow-500/20', borderColorClass: 'border-yellow-500' };
      case 'baja':
        return { icon: <ChevronDown size={16} className="mr-1 text-green-500" />, label: 'Baja', color: 'text-green-500', bgColor: 'bg-green-100 dark:bg-green-500/20', borderColorClass: 'border-green-500' };
      default:
        return { icon: <Tag size={16} className="mr-1 text-gray-500" />, label: priority, color: 'text-gray-500', bgColor: 'bg-gray-100 dark:bg-gray-500/20', borderColorClass: 'border-gray-500' };
    }
  };

  const getStatusInfo = (status) => {
    // Values for status are expected to be: PENDING, IN PROGRESS, BLOCKED, IN REVIEW, DONE, REJECTED, CLOSED
    switch (status ? status.toUpperCase() : 'PENDING') { // Default to PENDING if status is null/undefined
      case 'PENDING': 
        return { icon: <Clock size={16} className="mr-1 text-yellow-800" />, text: 'Pendiente', color: 'text-yellow-800', bgColor: 'bg-yellow-200' };
      case 'IN PROGRESS': 
        return { icon: <ListIcon size={16} className="mr-1 text-blue-800" />, text: 'En Progreso', color: 'text-blue-800', bgColor: 'bg-blue-200' };
      case 'BLOCKED': 
        return { icon: <Ban size={16} className="mr-1 text-red-800" />, text: 'Bloqueada', color: 'text-red-800', bgColor: 'bg-red-200' };
      case 'IN REVIEW': 
        return { icon: <FileSearch size={16} className="mr-1 text-purple-800" />, text: 'En Revisión', color: 'text-purple-800', bgColor: 'bg-purple-200' };
      case 'DONE': 
        return { icon: <SquareCheck size={16} className="mr-1 text-green-800" />, text: 'Terminada', color: 'text-green-800', bgColor: 'bg-green-200' };
      case 'REJECTED': 
        return { icon: <XOctagon size={16} className="mr-1 text-stone-900" />, text: 'Rechazada', color: 'text-stone-900', bgColor: 'bg-stone-400' };
      case 'CLOSED': 
        return { icon: <Archive size={16} className="mr-1 text-white" />, text: 'Cerrada', color: 'text-white', bgColor: 'bg-green-700' };
      // Fallback for old statuses for display consistency
      case 'PENDIENTE':
         return { icon: <Clock size={16} className="mr-1 text-yellow-800" />, text: 'Pendiente', color: 'text-yellow-800', bgColor: 'bg-yellow-200' };
      case 'EN_PROGRESO':
        return { icon: <ListIcon size={16} className="mr-1 text-blue-800" />, text: 'En Progreso', color: 'text-blue-800', bgColor: 'bg-blue-200' };
      case 'COMPLETADA':
        return { icon: <SquareCheck size={16} className="mr-1 text-green-800" />, text: 'Terminada', color: 'text-green-800', bgColor: 'bg-green-200' };
      default:
        return { icon: <Tag size={16} className="mr-1 text-gray-500" />, text: status ? status.replace('_', ' ') : 'Desconocido', color: 'text-gray-500', bgColor: 'bg-gray-100 dark:bg-gray-700/20' };
    }
  };

  const priorityInfo = getPriorityInfo(task.priority);
  const statusInfo = getStatusInfo(task.status);

  return (
    <li
      className={`bg-card text-card-foreground shadow-md rounded-lg p-4 mb-3 hover:shadow-lg transition-shadow duration-200 cursor-pointer border-l-4 ${priorityInfo.borderColorClass}`}
      onClick={() => onClick(task.id || task)} // Modified to handle if task.id is not present, then pass task itself
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="flex-1 min-w-0 mb-2 sm:mb-0">
          <h3 className="text-lg font-semibold text-foreground truncate" title={task.title}>
            {task.title}
          </h3>
          <p className="text-sm text-muted-foreground truncate" title={task.description}>
            {task.description || 'Sin descripción.'}
          </p>
        </div>
        <div className="flex items-center space-x-3 text-xs sm:text-sm">
          {task.due_date && (
            <div className="flex items-center text-muted-foreground">
              <Clock size={14} className="mr-1" />
              <span>{new Date(task.due_date).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}</span>
            </div>
          )}
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-border flex flex-wrap gap-2 justify-between items-center">
        <div className="flex items-center space-x-3">
            <span className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityInfo.bgColor} ${priorityInfo.color}`}>
              {priorityInfo.icon}
              {priorityInfo.label.charAt(0).toUpperCase() + priorityInfo.label.slice(1)}
            </span>
            <span className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
              {statusInfo.icon}
              {statusInfo.text}
            </span>
        </div>
        <div className="flex items-center text-xs text-muted-foreground">
            <MessageSquare size={14} className="mr-1" />
            <span>{task.comments_count || 0} Comentarios</span>
        </div>
      </div>
    </li>
  );
};

export default TaskItem;
