
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TaskDetailHeader = ({ projectId, taskTitle }) => {
  return (
    <>
      <Link to={`/project/${projectId}`} className="inline-flex items-center text-primary hover:text-primary/80 mb-6 group">
        <ArrowLeft size={20} className="mr-2 transition-transform group-hover:-translate-x-1" />
        Volver al Proyecto
      </Link>
      <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-3">{taskTitle}</h1>
    </>
  );
};

export default TaskDetailHeader;
