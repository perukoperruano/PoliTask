
import React from 'react';
import TaskItem from '../TaskItem';
import { ListTodo } from 'lucide-react';

const TaskList = ({ tasks, onTaskClick, activeFilters }) => {
  if (tasks.length === 0) {
    const noFiltersApplied = activeFilters.status === 'all' && activeFilters.priority === 'all' && activeFilters.assigneeId === 'all';
    return (
      <div className="text-center py-10 bg-card text-card-foreground rounded-lg shadow-md p-6">
        <ListTodo size={48} className="mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-medium text-foreground mb-2">
          {noFiltersApplied
            ? "Este proyecto no tiene tareas." 
            : "No hay tareas que coincidan con los filtros aplicados."}
        </h2>
        <p className="text-muted-foreground">
          {noFiltersApplied
            ? "¡Añade la primera tarea para comenzar!" 
            : "Prueba con otros filtros o añade nuevas tareas."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      <ul className="list-none p-0">
        {tasks.map(task => (
          <TaskItem key={task.id} task={task} onClick={() => onTaskClick(task.id)} />
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
