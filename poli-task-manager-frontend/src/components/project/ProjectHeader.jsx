
import React from 'react';

const ProjectHeader = ({ name, description }) => {
  return (
    <div className="mb-8 p-1">
      <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">{name}</h1>
      <p className="text-muted-foreground text-base lg:text-lg">{description}</p>
    </div>
  );
};

export default ProjectHeader;
