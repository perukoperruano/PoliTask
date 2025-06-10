import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import ProjectCard from '../components/ProjectCard';
import ProjectListItem from '../components/ProjectListItem';
import { getProjects } from '../services/api';
import { Plus, LayoutGrid, LayoutList } from 'lucide-react';
import CreateProjectModal from '../components/CreateProjectModal';
import { Toaster, toast } from 'sonner';
import { Button } from '@/components/ui/button';

/**
 * Página principal del Dashboard.
 * Muestra una lista de proyectos del usuario y permite crear nuevos.
 */
const DashboardPage = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('card');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const fetchedProjects = await getProjects();
        setProjects(fetchedProjects || []);
        setError(null);
      } catch (err) {
        console.error("Error al cargar proyectos:", err);
        setError(err); // Guardamos el error completo para depurar
        toast.error("Error al cargar los proyectos.");
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectCreated = (newProject) => {
    setProjects(prevProjects => [newProject, ...prevProjects]);
  };

  return (
    <Layout>
      <Toaster richColors position="bottom-right" />

      <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
          Mis Proyectos
        </h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-muted rounded-md">
            <Button
              variant={viewMode === 'card' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('card')}
              aria-label="Vista de tarjetas"
              title="Vista de tarjetas"
              className={`px-2 ${viewMode === 'card' ? 'shadow-sm' : ''}`}
            >
              <LayoutGrid className="h-5 w-5" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              aria-label="Vista de lista"
              title="Vista de lista"
              className={`px-2 ${viewMode === 'list' ? 'shadow-sm' : ''}`}
            >
              <LayoutList className="h-5 w-5" />
            </Button>
          </div>
          <button
            className="btn-primary font-medium py-2.5 px-5 rounded-lg text-sm shadow-sm hover:shadow-md flex items-center"
            onClick={() => setIsCreateProjectModalOpen(true)}
          >
            <Plus size={20} className="mr-2" />
            Crear Proyecto
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Cargando proyectos...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg relative mb-6" role="alert">
          <strong className="font-bold">¡Error!</strong>
          <span className="block sm:inline">
            {typeof error === 'string' ? error : error?.message || 'Error desconocido'}
          </span>
        </div>
      )}

      {!isLoading && !error && projects.length === 0 && (
        <div className="text-center py-16 bg-card rounded-lg shadow-md p-6">
          <Plus size={56} className="mx-auto text-muted-foreground/70 mb-4" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">No tienes proyectos aún.</h2>
          <p className="text-muted-foreground mb-6">¡Comienza creando tu primer proyecto para organizar tus tareas!</p>
          <button
            className="btn-primary font-medium py-2.5 px-6 rounded-lg text-sm shadow-sm hover:shadow-md flex items-center mx-auto"
            onClick={() => setIsCreateProjectModalOpen(true)}
          >
            <Plus size={20} className="mr-2" />
            Crear Mi Primer Proyecto
          </button>
        </div>
      )}

      {!isLoading && !error && projects.length > 0 && (
        viewMode === 'card' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <ProjectCard key={project.id || `project-${index}`} project={project} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project, index) => (
              <ProjectListItem key={project.id || `project-list-${index}`} project={project} />
            ))}
          </div>
        )
      )}

      <CreateProjectModal
        isOpen={isCreateProjectModalOpen}
        onClose={() => setIsCreateProjectModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
    </Layout>
  );
};

export default DashboardPage;
