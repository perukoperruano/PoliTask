import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Breadcrumbs from './Breadcrumbs';
import { getProjects, getAllTasks } from '../services/api';
import { Home, Folder, ListTodo, Search, LockKeyholeIcon as LockIcon, LogOut } from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();
  const params = useParams();
  const [breadcrumbItems, setBreadcrumbItems] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const [fetchedProjects, fetchedTasks] = await Promise.all([
          getProjects(),
          getAllTasks()
        ]);

        // Validamos que sean arrays antes de asignar
        if (Array.isArray(fetchedProjects)) {
          setProjects(fetchedProjects);
        } else {
          console.warn("getProjects() devolvió un tipo inesperado:", fetchedProjects);
          setProjects([]);
        }

        if (Array.isArray(fetchedTasks)) {
          setTasks(fetchedTasks);
        } else {
          console.warn("getAllTasks() devolvió un tipo inesperado:", fetchedTasks);
          setTasks([]);
        }
      } catch (error) {
        console.error("Error fetching data for breadcrumbs:", error);
        setProjects([]); // fallback seguro
        setTasks([]);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const pathParts = location.pathname.split('/').filter(part => part);
    const items = [{ label: 'Inicio', href: '/dashboard', icon: Home }];

    if (location.pathname === '/dashboard') {
      // nada más
    } else if (location.pathname === '/projects') {
      items.push({ label: 'Proyectos', href: '/projects', icon: Folder });
    } else if (location.pathname === '/tasks') {
      items.push({ label: 'Mis Tareas', href: '/tasks', icon: ListTodo });
    } else if (pathParts[0] === 'project' && pathParts.length === 2 && params.projectId) {
      items.push({ label: 'Proyectos', href: '/projects', icon: Folder });
      const project = projects.find(p => String(p.id) === params.projectId);
      items.push({
        label: project ? project.name : (loadingData ? 'Cargando...' : 'Proyecto no encontrado'),
        href: `/project/${params.projectId}`,
        icon: Folder
      });
    } else if (pathParts[0] === 'project' && pathParts.length === 4 && pathParts[2] === 'task' && params.projectId && params.taskId) {
      items.push({ label: 'Proyectos', href: '/projects', icon: Folder });
      const project = projects.find(p => String(p.id) === params.projectId);
      items.push({
        label: project ? project.name : (loadingData ? 'Cargando...' : 'Proyecto no encontrado'),
        href: `/project/${params.projectId}`,
        icon: Folder
      });

      const task = tasks.find(t => String(t.id) === params.taskId);
      items.push({
        label: task ? task.title : (loadingData ? 'Cargando...' : 'Tarea no encontrada'),
        href: `/project/${params.projectId}/task/${params.taskId}`,
        icon: ListTodo
      });
    } else if (location.pathname === '/search') {
      const searchQuery = new URLSearchParams(location.search).get('q');
      items.push({ label: searchQuery ? `Búsqueda: "${searchQuery}"` : 'Búsqueda', icon: Search });
    } else if (location.pathname === '/change-password') {
      items.push({ label: 'Cambiar Contraseña', href: '/change-password', icon: LockIcon });
    } else if (location.pathname === '/logout') {
      items.push({ label: 'Cerrar Sesión', icon: LogOut });
    }

    setBreadcrumbItems(items);
  }, [location.pathname, location.search, params, projects, tasks, loadingData]);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 bg-background">
          <Breadcrumbs items={breadcrumbItems} />
          <div className="container mx-auto max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
