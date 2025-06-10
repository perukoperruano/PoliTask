
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createComment } from '../services/api';
import { Send } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Formulario para crear un nuevo comentario.
 * @param {object} props - Propiedades del componente.
 * @param {string} props.taskId - ID de la tarea a la que pertenece el comentario.
 * @param {function} props.onCommentCreated - Callback cuando un comentario es creado.
 */
const CreateCommentForm = ({ taskId, onCommentCreated }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      const newComment = await createComment({ task_id: taskId, content: data.content });
      toast.success('Comentario añadido con éxito.');
      onCommentCreated(newComment);
      reset();
    } catch (error) {
      console.error("Error creando comentario:", error);
      toast.error('No se pudo añadir el comentario.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
      <div className="mb-4">
        <label htmlFor="commentContent" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Añadir un comentario
        </label>
        <textarea
          id="commentContent"
          {...register("content", { required: "El contenido no puede estar vacío." })}
          rows="3"
          className={`w-full p-2 border rounded-md shadow-sm focus:ring-brand-primary-purple focus:border-brand-primary-purple dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.content ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Escribe tu comentario aquí..."
        />
        {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary"
      >
        <Send size={18} className="mr-2" />
        {isSubmitting ? 'Enviando...' : 'Enviar Comentario'}
      </button>
    </form>
  );
};

export default CreateCommentForm;
