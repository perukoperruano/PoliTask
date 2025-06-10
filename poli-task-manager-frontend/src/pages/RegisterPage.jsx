
// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api'; // API simulada

/**
 * Página de registro de nuevos usuarios.
 */
const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!name || !email || !password || !confirmPassword) {
      setError('Todos los campos son obligatorios.');
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setIsLoading(false);
      return;
    }
    // TODO: Añadir más validaciones (longitud de contraseña, formato de email)

    try {
      const response = await register(name, email, password); // Usando API simulada
      if (response.success) {
        // alert('Registro exitoso (simulado). Ahora puedes iniciar sesión.'); // Feedback temporal
        navigate('/login'); // Redirigir a login tras registro exitoso
      } else {
        setError(response.message || 'Error en el registro. Inténtalo de nuevo.');
      }
    } catch (err) {
      console.error("Error en registro:", err);
      setError('Ocurrió un error inesperado. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-brand-dark-purple shadow-xl rounded-lg p-8 md:p-12 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-brand-primary-purple mb-8">
          Crear Cuenta
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nombre Completo
            </label>
            <input id="name" name="name" type="text" required value={name} onChange={(e) => setName(e.target.value)}
                   className="input-field" placeholder="Tu nombre completo" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Correo Electrónico
            </label>
            <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                   className="input-field" placeholder="tu@correo.com" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Contraseña
            </label>
            <input id="password" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                   className="input-field" placeholder="Crea una contraseña" />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirmar Contraseña
            </label>
            <input id="confirmPassword" name="confirmPassword" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                   className="input-field" placeholder="Confirma tu contraseña" />
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
          )}

          <div>
            <button type="submit" disabled={isLoading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary-purple hover:bg-brand-secondary-purple focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary-purple disabled:opacity-50 transition duration-150 ease-in-out">
              {isLoading ? 'Registrando...' : 'Registrarme'}
            </button>
          </div>
        </form>
        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="font-medium text-brand-primary-purple hover:text-brand-secondary-purple">
            Inicia sesión
          </Link>
        </p>
      </div>
      {/* Helper class para inputs, se puede mover a index.css si se usa mucho */}
      <style jsx>{`
        .input-field {
          @apply appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-brand-primary-purple focus:border-brand-primary-purple sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100;
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;
