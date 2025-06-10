
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ProjectCard from '../components/ProjectCard';
import TaskItem from '../components/TaskItem';
import { searchAll } from '../services/api';
import { Toaster, toast } from 'sonner';
import { SearchSlash } from 'lucide-react';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const navigate = useNavigate();

  const [results, setResults] = useState({ projects: [], tasks: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (query) {
      const fetchResults = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const searchData = await searchAll(query);
          setResults(searchData);
        } catch (err) {
          console.error("Error al buscar:", err);
          setError("No se pudieron cargar los resultados de búsqueda.");
          toast.error("Error al cargar los resultados.");
          setResults({ projects: [], tasks: [] });
        } finally {
          setIsLoading(false);
        }
      };
      fetchResults();
    } else {
      setResults({ projects: [], tasks: [] }); // Clear results if no query
    }
  }, [query]);

  const handleTaskClick = (task) => {
    // TaskItem onClick pasa el objeto tarea completo si task.id no está o la tarea misma
    // Asumimos que task.project_id y task.id están presentes
    if (task && task.project_id && task.id) {
      navigate(`/project/${task.project_id}/task/${task.id}`);
    } else if (task && task.id && !task.project_id) { // Si es solo el ID de la tarea (legacy)
       // Esta lógica puede necesitar ajuste si TaskItem solo pasa ID
       // Por ahora, asumimos que TaskItem pasa el objeto tarea o ID
       // Si solo pasa el ID, necesitaríamos encontrar el project_id de alguna manera o mostrar un error
       console.warn("TaskItem clickeado sin project_id:", task);
       toast.error("No se puede navegar a la tarea, falta información del proyecto.");
    } else {
        // Si 'task' es un ID (de TaskList), necesitamos buscar la tarea completa
        // Esto no debería suceder si TaskItem se usa directamente aquí y pasa el objeto.
        // Este caso es más para cuando TaskItem es usado dentro de TaskList que sí pasa solo ID.
        // Para la búsqueda directa, TaskItem recibe el objeto 'task' completo.
        console.warn("TaskItem clickeado con información incompleta:", task);
    }
  };


  return (
    <Layout>
      <Toaster richColors position="bottom-right" />
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
          Resultados de Búsqueda para: "{query}"
        </h1>
      </div>

      {isLoading && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Buscando...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg relative mb-6" role="alert">
          <strong className="font-bold">¡Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {!isLoading && !error && !results.projects.length && !results.tasks.length && (
        <div className="text-center py-16 bg-card rounded-lg shadow-md p-6">
          <SearchSlash size={56} className="mx-auto text-muted-foreground/70 mb-4" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">No se encontraron resultados.</h2>
          <p className="text-muted-foreground">Intenta con otros términos de búsqueda.</p>
        </div>
      )}

      {!isLoading && !error && (results.projects.length > 0 || results.tasks.length > 0) && (
        <div className="space-y-8">
          {results.projects.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Proyectos Encontrados ({results.projects.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </section>
          )}

          {results.tasks.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Tareas Encontradas ({results.tasks.length})</h2>
              <div className="space-y-0">
                <ul className="list-none p-0">
                  {results.tasks.map((task) => (
                     // TaskItem espera una función onClick que recibe la tarea o su ID.
                     // Aquí pasamos el objeto tarea completo para que handleTaskClick tenga toda la info.
                    <TaskItem key={task.id} task={task} onClick={() => handleTaskClick(task)} />
                  ))}
                </ul>
              </div>
            </section>
          )}
        </div>
      )}
    </Layout>
  );
};

export default SearchResultsPage;
