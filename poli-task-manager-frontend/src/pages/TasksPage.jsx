
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import TaskItem from '../components/TaskItem'; // For list view
import TaskRow from '../components/project/TaskRow'; // For grouped view rows
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"; // For grouped view
import { getAllTasks, getUsers } from '../services/api';
import { Toaster, toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ListTodo as ListTodoIconPage, LayoutList, LayoutGrid, ChevronDown, Clock, Ban, FileSearch2, CheckCircle, XCircle, Archive } from 'lucide-react';

// Status options for grouping on TasksPage (similar to ProjectPage)
const statusOptionsForGrouping = [
    { value: "PENDING", label: "Pendiente", Icon: Clock, bgColor: "bg-yellow-400", textColor: "text-yellow-900" },
    { value: "IN PROGRESS", label: "En Progreso", Icon: ListTodoIconPage, bgColor: "bg-blue-400", textColor: "text-blue-900" },
    { value: "BLOCKED", label: "Bloqueada", Icon: Ban, bgColor: "bg-red-400", textColor: "text-red-900" },
    { value: "IN REVIEW", label: "En Revisión", Icon: FileSearch2, bgColor: "bg-purple-400", textColor: "text-purple-900" },
    { value: "DONE", label: "Terminada", Icon: CheckCircle, bgColor: "bg-green-500", textColor: "text-white" },
    { value: "REJECTED", label: "Rechazada", Icon: XCircle, bgColor: "bg-stone-400", textColor: "text-stone-900" },
    { value: "CLOSED", label: "Cerrada", Icon: Archive, bgColor: "bg-gray-500", textColor: "text-white" },
];


const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grouped'

  const [openStates, setOpenStates] = useState(() => {
    const initialStates = {};
    statusOptionsForGrouping.forEach(option => {
      initialStates[option.value] = true; 
    });
    return initialStates;
  });

  const toggleOpenState = (statusValue) => {
    setOpenStates(prev => ({ ...prev, [statusValue]: !prev[statusValue] }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setIsLoadingUsers(true); // Reset user loading state too

        const [fetchedTasks, fetchedUsers] = await Promise.all([
          getAllTasks(),
          getUsers()
        ]);
        
        setTasks((fetchedTasks || []).map(task => ({...task, status: task.status || "PENDING"})));
        setAllUsers(fetchedUsers || []);
        setError(null);

      } catch (err) {
        console.error("Error al cargar datos de tareas o usuarios:", err);
        setError("No se pudieron cargar los datos necesarios.");
        toast.error("Error al cargar datos.");
        setTasks([]);
        setAllUsers([]);
      } finally {
        setIsLoading(false);
        setIsLoadingUsers(false);
      }
    };

    fetchData();
  }, []);

  const handleTaskClick = (task) => {
    // Task object here might be the full task from API
    // If TaskRow/TaskItem is passed only ID, adjust navigate call
    navigate(`/project/${task.project_id}/task/${task.id}`);
  };

  const tasksByStatusForGroupedView = statusOptionsForGrouping.map(statusOption => ({
    ...statusOption,
    tasks: tasks.filter(task => task.status === statusOption.value),
  }));
  
  return (
    <Layout>
      <Toaster richColors position="bottom-right" />
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
            Mis Tareas
          </h1>
          <p className="text-muted-foreground mt-1">
            Aquí encontrarás todas tus tareas asignadas de todos los proyectos.
          </p>
        </div>
        <div className="flex items-center gap-1 p-1 bg-muted rounded-md">
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              aria-label="Vista de lista"
              title="Vista de lista"
              className={`px-2.5 ${viewMode === 'list' ? 'shadow-sm' : ''}`}
            >
              <LayoutList className="h-5 w-5" />
            </Button>
            <Button
              variant={viewMode === 'grouped' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grouped')}
              aria-label="Vista agrupada por estado"
              title="Vista agrupada por estado"
              className={`px-2.5 ${viewMode === 'grouped' ? 'shadow-sm' : ''}`}
            >
              <LayoutGrid className="h-5 w-5" />
            </Button>
          </div>
      </div>

      {(isLoading || isLoadingUsers) && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Cargando tareas...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg relative mb-6" role="alert">
          <strong className="font-bold">¡Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {!isLoading && !error && tasks.length === 0 && (
        <div className="text-center py-16 bg-card rounded-lg shadow-sm border border-border p-6">
          <ListTodoIconPage size={56} className="mx-auto text-muted-foreground/70 mb-4" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">No tienes tareas asignadas.</h2>
          <p className="text-muted-foreground">Parece que no tienes tareas o no se han creado tareas aún.</p>
        </div>
      )}

      {!isLoading && !error && tasks.length > 0 && (
        <>
          {viewMode === 'list' && (
            <div className="space-y-0">
              <ul className="list-none p-0">
                {tasks.map((task) => (
                  <TaskItem key={task.id} task={task} onClick={() => handleTaskClick(task)} />
                ))}
              </ul>
            </div>
          )}

          {viewMode === 'grouped' && (
            <div className="space-y-3">
              {tasksByStatusForGroupedView.map(group => {
                if(group.tasks.length === 0 && !openStates[group.value]) return null; // Don't render empty closed groups
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
                      <span className="ml-2 text-sm text-muted-foreground">({group.tasks.length})</span>
                    </CollapsiblePrimitive.Trigger>
                    <CollapsiblePrimitive.Content className="data-[state=open]:border-t data-[state=open]:border-border">
                       {openStates[group.value] && (
                        <div className="px-3 pt-2 pb-1">
                          <div className="flex text-xs text-muted-foreground mb-1.5 sticky top-0 bg-card z-10 py-1 -mx-3 px-3 border-b border-border">
                            <div className="w-1/2 pl-7">Nombre</div>
                            <div className="w-[20%] text-left pl-2">Persona asignada</div>
                            <div className="w-[15%] text-center">Fecha límite</div>
                            <div className="w-[15%] text-left pl-2">Prioridad</div>
                          </div>
                          {group.tasks.length > 0 ? (
                            <ul className="list-none p-0">
                              {group.tasks.map(task => (
                                <TaskRow key={task.id} task={task} onTaskClick={() => handleTaskClick(task)} allUsers={allUsers} />
                              ))}
                            </ul>
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
          )}
        </>
      )}
    </Layout>
  );
};

export default TasksPage;
