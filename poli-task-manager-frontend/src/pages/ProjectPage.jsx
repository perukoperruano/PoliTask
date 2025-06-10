import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { getProjectById, getTasksByProjectId, getUsers } from '../services/api';
import { 
  Clock, ListTodo as ListTodoIcon, Ban, FileSearch2, CheckCircle, XCircle, Archive,
  Filter, Folder // Keep Folder for breadcrumbs consistency if needed, else use specific task icons
} from 'lucide-react'; // Updated imports for status icons
import CreateTaskModal from '../components/CreateTaskModal';
import { Toaster, toast } from 'sonner';
import ProjectHeader from '../components/project/ProjectHeader';
import ProjectActions from '../components/project/ProjectActions';
import TaskList from '../components/project/TaskList'; // For list view mode
import GroupedTaskView from '../components/project/GroupedTaskView'; // For grouped view mode

/**
 * Página para mostrar los detalles de un proyecto específico, incluyendo sus tareas.
 */
const ProjectPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]); // This is allUsers for TaskRow
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grouped'); // Default to grouped view as per image

  const initialFilters = {
    status: "all",
    priority: "all",
    assigneeId: "all",
  };
  const [activeFilters, setActiveFilters] = useState(initialFilters);

  // Updated statusOptions with bgColor and textColor for group headers
  const statusOptions = [
    { value: "all", label: "Todos los Estados" }, // For filter dropdown
    { value: "PENDING", label: "Pendiente", Icon: Clock, bgColor: "bg-yellow-400", textColor: "text-yellow-900", colorClass: "text-yellow-600" },
    { value: "IN PROGRESS", label: "En Progreso", Icon: ListTodoIcon, bgColor: "bg-blue-400", textColor: "text-blue-900", colorClass: "text-blue-600" },
    { value: "BLOCKED", label: "Bloqueada", Icon: Ban, bgColor: "bg-red-400", textColor: "text-red-900", colorClass: "text-red-600" },
    { value: "IN REVIEW", label: "En Revisión", Icon: FileSearch2, bgColor: "bg-purple-400", textColor: "text-purple-900", colorClass: "text-purple-600" },
    { value: "DONE", label: "Terminada", Icon: CheckCircle, bgColor: "bg-green-500", textColor: "text-white", colorClass: "text-green-600" },
    { value: "REJECTED", label: "Rechazada", Icon: XCircle, bgColor: "bg-stone-400", textColor: "text-stone-900", colorClass: "text-stone-700" },
    { value: "CLOSED", label: "Cerrada", Icon: Archive, bgColor: "bg-gray-500", textColor: "text-white", colorClass: "text-gray-700" },
    // STAND BY could be added here if it's a distinct status from PENDING
    // { value: "STAND_BY", label: "Stand By", Icon: PauseCircle, bgColor: "bg-orange-400", textColor: "text-orange-900", colorClass: "text-orange-600" },
  ];

  const priorityOptions = [
    { value: "all", label: "Todas las Prioridades" },
    { value: "alta", label: "Alta", Icon: Filter, colorClass: "text-red-500" },
    { value: "media", label: "Media", Icon: Filter, colorClass: "text-yellow-500" },
    { value: "baja", label: "Baja", Icon: Filter, colorClass: "text-green-500" },
  ];

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setIsLoading(true);
        const projectDetails = await getProjectById(projectId);
        if (!projectDetails) {
          setError("Proyecto no encontrado. Serás redirigido al dashboard.");
          setProject(null);
          setTasks([]);
          toast.error("Proyecto no encontrado.");
          setTimeout(() => navigate('/dashboard'), 3000);
          return;
        }
        setProject(projectDetails);
        const projectTasks = await getTasksByProjectId(projectId);
        const tasksWithDefaults = (projectTasks || []).map(task => ({
          ...task,
          status: task.status || "PENDING", 
        }));
        setTasks(tasksWithDefaults);
        setError(null);
      } catch (err) {
        console.error("Error al cargar datos del proyecto:", err);
        setError("No se pudieron cargar los datos del proyecto.");
        toast.error("Error al cargar datos del proyecto.");
        setProject(null);
        setTasks([]);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchUsersData = async () => {
      try {
        setIsLoadingUsers(true);
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers || []);
      } catch (err) {
        console.error("Error al cargar usuarios:", err);
        toast.error("No se pudieron cargar usuarios para filtros.");
        setUsers([]);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    if (projectId) {
      fetchProjectData();
      fetchUsersData();
    }
  }, [projectId, navigate]);

  const handleTaskCreated = (newTask) => {
    const taskWithDefaultStatus = { ...newTask, status: newTask.status || "PENDING" };
    setTasks(prevTasks => [taskWithDefaultStatus, ...prevTasks].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))); // Keep sorted if needed
    toast.success(`Tarea "${taskWithDefaultStatus.title}" creada con éxito.`);
  };
  
  const handleTaskClick = (taskId) => {
    navigate(`/project/${projectId}/task/${taskId}`);
  };

  const handleFilterChange = (filterType, value) => {
    setActiveFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: value,
    }));
  };

  const clearAllFilters = () => {
    setActiveFilters(initialFilters);
  };

  const filteredTasks = tasks.filter(task => {
    const statusMatch = activeFilters.status === "all" || task.status === activeFilters.status;
    const priorityMatch = activeFilters.priority === "all" || task.priority === activeFilters.priority;
    const assigneeMatch = activeFilters.assigneeId === "all" || task.assignee_id === activeFilters.assigneeId;
    return statusMatch && priorityMatch && assigneeMatch;
  });

  const getFilterButtonText = () => {
    let count = 0;
    if (activeFilters.status !== "all") count++;
    if (activeFilters.priority !== "all") count++;
    if (activeFilters.assigneeId !== "all") count++;
    
    if (count === 0) return "Filtros";
    return `Filtros (${count} activo${count > 1 ? 's' : ''})`;
  };

  if (isLoading || isLoadingUsers) { // Consider isLoadingUsers as well
    return <Layout><div className="text-center py-10 text-muted-foreground">Cargando detalles del proyecto...</div></Layout>;
  }

  if (error && !project) {
    return <Layout><div className="text-center py-10 text-destructive">{error}</div></Layout>;
  }
  
  if (!project) {
    // This case might be hit if project is null but no specific error was set, e.g. after redirect logic
    return <Layout><div className="text-center py-10 text-muted-foreground">Proyecto no disponible.</div></Layout>;
  }
  
  const handleNewTaskClick = (statusValue) => {
    // Here you could pass statusValue to CreateTaskModal if you want the new task to default to that status
    console.log("Attempting to create new task, potentially for status:", statusValue);
    setIsCreateTaskModalOpen(true);
  };


  return (
    <Layout>
      <Toaster richColors position="bottom-right" />
      <ProjectHeader name={project.name} description={project.description} />

      <ProjectActions
        onNewTaskClick={handleNewTaskClick} // Main "New Task" button
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearAllFilters}
        users={users}
        isLoadingUsers={isLoadingUsers} 
        priorityOptions={priorityOptions}
        // Pass statusOptions *without* filtering "all" for the filter popover
        statusOptions={statusOptions} 
        filterButtonText={getFilterButtonText()}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {viewMode === 'list' && (
        <TaskList
          tasks={filteredTasks}
          onTaskClick={handleTaskClick}
          activeFilters={activeFilters} 
        />
      )}
      
      {viewMode === 'grouped' && (
        <GroupedTaskView
          tasks={filteredTasks}
          onTaskClick={handleTaskClick}
          // For GroupedTaskView, we still filter out "all" as it's for display groups
          statusOptions={statusOptions.filter(opt => opt.value !== 'all')} 
          allUsers={users} 
          onNewTaskClick={handleNewTaskClick} 
        />
      )}
      
      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        projectId={projectId}
        onTaskCreated={handleTaskCreated}
      />
    </Layout>
  );
};

export default ProjectPage;
