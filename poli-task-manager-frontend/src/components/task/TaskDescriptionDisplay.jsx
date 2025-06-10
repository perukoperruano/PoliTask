
import React, { useState, useEffect } from 'react';

const TaskDescriptionDisplay = ({ description, onDescriptionSave }) => {
  const [currentDescription, setCurrentDescription] = useState(description || '');
  const [isEditing, setIsEditing] = useState(false); // Not strictly needed for onBlur save, but good for potential enhancements

  useEffect(() => {
    setCurrentDescription(description || '');
  }, [description]);

  const handleChange = (event) => {
    setCurrentDescription(event.target.value);
  };

  const handleBlur = () => {
    if (currentDescription !== description) {
      onDescriptionSave(currentDescription);
    }
    setIsEditing(false); // Visual cue if needed, not essential here
  };

  const handleFocus = () => {
    setIsEditing(true); // Visual cue if needed
  };

  return (
    <div className="mt-6 mb-8">
      <h2 className="text-lg font-semibold text-foreground mb-2">Descripción</h2>
      <textarea
        value={currentDescription}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder="Añade una descripción para esta tarea..."
        className="w-full p-3 border border-input rounded-md min-h-[120px] text-sm bg-transparent text-muted-foreground focus:ring-1 focus:ring-brand-primary-purple focus:border-brand-primary-purple whitespace-pre-wrap"
        aria-label="Descripción de la tarea"
      />
      {/* 
        Original prose styling removed as textarea provides its own formatting context.
        Tailwind prose classes are not ideal for form elements like textarea.
        Custom styling applied directly to the textarea.
      */}
    </div>
  );
};

export default TaskDescriptionDisplay;
