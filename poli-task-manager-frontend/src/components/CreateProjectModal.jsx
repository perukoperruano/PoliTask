
import React from 'react';
import { useForm } from 'react-hook-form';
import * as Dialog from '@radix-ui/react-dialog';
import { XSquare, Plus } from 'lucide-react';
import { createProject } from '../services/api';
import { toast } from 'sonner';

/**
 * Modal para crear un nuevo proyecto.
 * @param {object} props - Propiedades del componente.
 * @param {boolean} props.isOpen - Controla si el modal está abierto.
 * @param {function} props.onClose - Función para cerrar el modal.
 * @param {function} props.onProjectCreated - Callback tras crear el proyecto.
 */
const CreateProjectModal = ({ isOpen, onClose, onProjectCreated }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();


  const onSubmit = async (data) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) throw new Error("Usuario no autenticado");

    const newProjectData = { ...data, owner_id: user.id };
    const res = await createProject(newProjectData);

    if (!res.success) throw new Error(res.message || "Error al crear el proyecto.");

    toast.success('¡Proyecto creado exitosamente!');
    onProjectCreated(res.project);
    reset();
    onClose();
  } catch (error) {
    console.error("Error al crear proyecto:", error);
    toast.error(error.message || 'Error al crear el proyecto. Inténtalo de nuevo.');
  }
};



  if (!isOpen) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 animate-fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl z-50 w-[90vw] max-w-md animate-scale-in">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold text-gray-800 dark:text-white">Nuevo Proyecto</Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Cerrar">
                <XSquare size={24} className="text-gray-600 dark:text-gray-400" />
              </button>
            </Dialog.Close>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre del Proyecto</label>
              <input
                id="name"
                type="text"
                {...register("name", { required: "El nombre del proyecto es obligatorio" })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-brand-primary-purple focus:border-brand-primary-purple dark:bg-gray-700 dark:text-white"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción (Opcional)</label>
              <textarea
                id="description"
                {...register("description")}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-brand-primary-purple focus:border-brand-primary-purple dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div className="flex justify-end pt-2">
              <Dialog.Close asChild>
                <button type="button" className="btn-secondary bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 mr-2">
                  Cancelar
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary bg-brand-primary-purple hover:bg-brand-secondary-purple text-white flex items-center"
              >
                {isSubmitting ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <Plus size={20} className="mr-2" />
                )}
                {isSubmitting ? 'Creando...' : 'Crear Proyecto'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CreateProjectModal;
