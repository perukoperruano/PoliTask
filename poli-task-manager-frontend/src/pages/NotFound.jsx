
// src/pages/NotFound.jsx
import React from 'react'; // Import React
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

/**
 * Página para manejar rutas no encontradas (Error 404).
 */
const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "Error 404: El usuario intentó acceder a una ruta no existente:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 text-center">
      <h1 className="text-6xl font-bold text-brand-primary-purple mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-3">
        ¡Ups! Página no encontrada
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        La página que estás buscando no existe, fue eliminada, o la dirección es incorrecta.
      </p>
      <Link
        to="/dashboard" // O a /login si el usuario no está autenticado
        className="px-6 py-3 bg-brand-primary-purple text-white font-semibold rounded-lg shadow-md hover:bg-brand-secondary-purple transition duration-150 ease-in-out"
      >
        Volver al Inicio
      </Link>
    </div>
  );
};

export default NotFound;
