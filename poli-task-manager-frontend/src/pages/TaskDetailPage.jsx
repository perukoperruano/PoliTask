import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { getTaskById, getCommentsByTaskId, getUsers, updateTask } from '../services/api';
import { Toaster, toast } from 'sonner';
import TaskDetailHeader from '../components/task/TaskDetailHeader';
import TaskInfoGrid from '../components/task/TaskInfoGrid';
import TaskDescriptionDisplay from '../components/task/TaskDescriptionDisplay';
import TaskComments from '../components/task/TaskComments';

const TaskDetailPage = () => {
  const { projectId, taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [assignee, setAssignee] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingTask, setIsUpdatingTask] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTaskData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [taskDetails, usersList, taskComments] = await Promise.all([
          getTaskById(taskId),
          getUsers(),
          getCommentsByTaskId(taskId)
        ]);

        if (!taskDetails) {
          toast.error("Tarea no encontrada.");
          setError("Tarea no encontrada. Serás redirigido.");
          setTimeout(() => navigate(`/project/${projectId}`), 3000);
          setIsLoading(false);
          return;
        }
        setTask(taskDetails);
        setAllUsers(usersList || []);
        setComments(taskComments || []);

        if (taskDetails.assignee_id) {
          const assigneeData = usersList.find(u => u.id === taskDetails.assignee_id);
          setAssignee(assigneeData || null);
        } else {
          setAssignee(null);
        }
      } catch (err) {
        console.error("Error al cargar datos de la tarea:", err);
        toast.error("Error al cargar datos de la tarea.");
        setError("No se pudieron cargar los datos de la tarea.");
      } finally {
        setIsLoading(false);
      }
    };

    if (taskId && projectId) {
      fetchTaskData();
    }
  }, [taskId, projectId, navigate]);

  const handleCommentCreated = (newComment) => {
    setComments(prevComments => [newComment, ...prevComments]);
  };
  
  const handleAssigneeChange = async (newAssigneeIdValue) => {
    const newAssigneeId = newAssigneeIdValue === "none" ? null : newAssigneeIdValue;
    setIsUpdatingTask(true);
    try {
      const updatedTaskData = await updateTask(taskId, { assignee_id: newAssigneeId });
      setTask(updatedTaskData);
      if (updatedTaskData.assignee_id) {
        const newAssigneeData = allUsers.find(u => u.id === updatedTaskData.assignee_id);
        setAssignee(newAssigneeData || null);
      } else {
        setAssignee(null);
      }
      toast.success("Persona asignada actualizada.");
    } catch (err) {
      console.error("Error updating assignee:", err);
      toast.error("Error al actualizar la persona asignada.");
    } finally {
      setIsUpdatingTask(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setIsUpdatingTask(true);
    try {
      const updatedTaskData = await updateTask(taskId, { status: newStatus });
      setTask(updatedTaskData);
      toast.success("Estado de la tarea actualizado.");
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Error al actualizar el estado.");
    } finally {
      setIsUpdatingTask(false);
    }
  };

  const handlePriorityChange = async (newPriority) => {
    setIsUpdatingTask(true);
    try {
      const updatedTaskData = await updateTask(taskId, { priority: newPriority });
      setTask(updatedTaskData);
      toast.success("Prioridad de la tarea actualizada.");
    } catch (err) {
      console.error("Error updating priority:", err);
      toast.error("Error al actualizar la prioridad.");
    } finally {
      setIsUpdatingTask(false);
    }
  };

  const handleDescriptionSave = async (newDescription) => {
    setIsUpdatingTask(true); // Consider using a different state if description updates are frequent/less critical for global lock
    try {
      const updatedTaskData = await updateTask(taskId, { description: newDescription });
      setTask(updatedTaskData);
      toast.success("Descripción de la tarea actualizada.");
    } catch (err) {
      console.error("Error updating description:", err);
      toast.error("Error al actualizar la descripción.");
      // Optionally revert description display if API call fails
    } finally {
      setIsUpdatingTask(false);
    }
  };

  if (isLoading) {
    return <Layout><div className="text-center py-10 text-muted-foreground">Cargando detalles de la tarea...</div></Layout>;
  }

  if (error) {
    return <Layout><div className="text-center py-10 text-destructive">{error}</div></Layout>;
  }

  if (!task) {
    return <Layout><div className="text-center py-10 text-muted-foreground">Tarea no disponible.</div></Layout>;
  }

  return (
    <Layout>
      <Toaster richColors position="bottom-right" />
      <div className="max-w-4xl mx-auto p-1 md:p-4">
        
        <TaskDetailHeader projectId={projectId} taskTitle={task.title} />

        <div className="bg-card text-card-foreground shadow-xl rounded-lg p-6 md:p-8">
          
          <TaskInfoGrid
            task={task}
            allUsers={allUsers}
            assignee={assignee}
            isUpdatingTask={isUpdatingTask}
            isLoading={isLoading} 
            handleAssigneeChange={handleAssigneeChange}
            handleStatusChange={handleStatusChange}
            handlePriorityChange={handlePriorityChange}
          />

          <TaskDescriptionDisplay 
            description={task.description}
            onDescriptionSave={handleDescriptionSave}
          />

          <TaskComments
            taskId={taskId}
            comments={comments}
            onCommentCreated={handleCommentCreated}
          />
        </div>
      </div>
    </Layout>
  );
};

export default TaskDetailPage;
