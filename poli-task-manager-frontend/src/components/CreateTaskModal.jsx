
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as Dialog from '@radix-ui/react-dialog';
import { XSquare, Plus, CalendarIcon } from 'lucide-react';
import { createTask } from '../services/api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils'; // Para classnames condicionales
import { Button } from '@/components/ui/button'; // Shadcn Button
import { Calendar } from '@/components/ui/calendar'; // Shadcn Calendar
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'; // Shadcn Popover
import { format } from 'date-fns'; // Para formatear fechas
// import es from 'date-fns/locale/es'; // Opcional: para formatear fechas en español

const taskStatusOptions = [
  { value: "PENDING", label: "Pendiente" },
  { value: "IN_PROGRESS", label: "En Progreso" },
  { value: "BLOCKED", label: "Bloqueada" },
  { value: "IN_REVIEW", label: "En Revisión" },
  { value: "DONE", label: "Terminada" },
];

/**
 * Modal para crear una nueva tarea.
 * @param {object} props - Propiedades del componente.
 * @param {boolean} props.isOpen - Controla si el modal está abierto.
 * @param {function} props.onClose - Función para cerrar el modal.
 * @param {string} props.projectId - ID del proyecto al que pertenece la tarea.
 * @param {function} props.onTaskCreated - Callback tras crear la tarea.
 */
const CreateTaskModal = ({ isOpen, onClose, projectId, onTaskCreated }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting }, control } = useForm({
    defaultValues: {
      title: '',
      description: '',
      priority: 'media',
      status: 'PENDING',
      dueDate: null,
    }
  });

  const onSubmit = async (data) => {
    try {
      const { dueDate, ...restOfData } = data;
      const newTaskData = {
        ...restOfData,
        project_id: projectId,
        due_date: dueDate ? dueDate.toISOString() : null,
      };
      const createdTask = await createTask(newTaskData);
      toast.success('¡Tarea creada exitosamente!');
      onTaskCreated(createdTask);
      reset(); // Resetea a defaultValues
      onClose();
    } catch (error) {
      console.error("Error al crear tarea:", error);
      toast.error('Error al crear la tarea. Inténtalo de nuevo.');
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 dark:bg-black/70 z-[45] animate-fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl z-50 w-[90vw] max-w-md animate-scale-in">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold text-gray-800 dark:text-white">Nueva Tarea</Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Cerrar">
                <XSquare size={24} className="text-gray-600 dark:text-gray-400" />
              </button>
            </Dialog.Close>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
              <input
                id="title"
                type="text"
                {...register("title", { required: "El título es obligatorio" })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-brand-primary-purple focus:border-brand-primary-purple dark:bg-gray-700 dark:text-white"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prioridad</label>
                <select
                  id="priority"
                  {...register("priority", { required: "La prioridad es obligatoria" })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-brand-primary-purple focus:border-brand-primary-purple dark:bg-gray-700 dark:text-white"
                >
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                </select>
                {errors.priority && <p className="text-red-500 text-xs mt-1">{errors.priority.message}</p>}
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estado</label>
                <select
                  id="status"
                  {...register("status", { required: "El estado es obligatorio" })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-brand-primary-purple focus:border-brand-primary-purple dark:bg-gray-700 dark:text-white"
                >
                  {taskStatusOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha de Vencimiento (Opcional)</label>
              <Controller
                control={control}
                name="dueDate"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                          "dark:bg-gray-700 dark:text-white dark:border-gray-600 hover:dark:bg-gray-600"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Selecciona una fecha</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className="p-3 pointer-events-auto dark:bg-gray-700 dark:text-white" // Added pointer-events-auto
                        // locale={es} // Opcional: para usar el calendario en español
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate.message}</p>}
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
                {isSubmitting ? 'Creando...' : 'Crear Tarea'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CreateTaskModal;
