
// src/components/ProjectCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Folder } from 'lucide-react';

/**
 * Tarjeta para mostrar información resumida de un proyecto.
 * @param {object} props - Propiedades del componente.
 * @param {object} props.project - Objeto del proyecto a mostrar.
 */
const ProjectCard = ({ project }) => {
  return (
    <Link 
      to={`/project/${project.id}`}
      className="block bg-card text-card-foreground shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300 ease-in-out"
    >
      <div className="flex items-center mb-3">
        <Folder className="h-6 w-6 text-primary mr-3" />
        <h3 className="text-xl font-semibold text-foreground truncate" title={project.name}>
          {project.name}
        </h3>
      </div>
      <p className="text-muted-foreground text-sm line-clamp-2 mb-4" title={project.description}>
        {project.description || "Este proyecto no tiene descripción."}
      </p>
      <div className="text-xs text-muted-foreground">
        Creado: {new Date(project.created_at).toLocaleDateString('es-CO')}
      </div>
    </Link>
  );
};

export default ProjectCard;
