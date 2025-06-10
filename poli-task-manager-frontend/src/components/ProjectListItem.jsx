
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button'; // Usaremos el botón de shadcn
import { ChevronRight } from 'lucide-react';

/**
 * Componente para mostrar un proyecto en formato de lista.
 * @param {object} props - Propiedades del componente.
 * @param {object} props.project - Objeto del proyecto a mostrar.
 */
const ProjectListItem = ({ project }) => {
  return (
    <div className="bg-card text-card-foreground shadow-sm rounded-lg p-4 hover:shadow-md transition-shadow duration-200 ease-in-out flex items-center justify-between">
      <div className="flex-grow min-w-0"> {/* Permite que el texto se trunque si es necesario */}
        <h3 className="text-lg font-semibold text-foreground truncate" title={project.name}>
          {project.name}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Creado: {new Date(project.created_at).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
      <Link to={`/project/${project.id}`} className="ml-4 flex-shrink-0">
        <Button variant="outline" size="sm">
          Ver Proyecto
          <ChevronRight size={16} className="ml-2" />
        </Button>
      </Link>
    </div>
  );
};

export default ProjectListItem;
