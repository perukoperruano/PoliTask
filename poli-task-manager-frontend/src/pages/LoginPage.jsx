
// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';

/**
 * Página de inicio de sesión.
 * Permite a los usuarios ingresar sus credenciales.
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  if (!email || !password) {
    setError('Por favor, completa todos los campos.');
    setIsLoading(false);
    return;
  }

  try {
    const response = await login(email, password);

    if (response.success) {
      // ✅ Guardar el usuario autenticado para usar luego en tareas, proyectos, etc.
      localStorage.setItem("user", JSON.stringify(response.user));

      console.log('Login exitoso:', response.user);
      navigate('/dashboard'); // o a donde quieras redirigir
    } else {
      setError(response.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    }
  } catch (err) {
    console.error("Error en login:", err);
    setError('Ocurrió un error inesperado. Inténtalo de nuevo.');
  } finally {
    setIsLoading(false);
  }
};

const handleLogin = async () => {
  const res = await login(email, password);

  if (res.success) {
    localStorage.setItem("user", JSON.stringify(res.user)); // ✅ esto es fundamental
    navigate('/'); // o donde corresponda
  } else {
    setError(res.message);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-card text-card-foreground shadow-xl rounded-lg p-8 md:p-12 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-primary mb-8">
          Iniciar Sesión
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">
              Correo Electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none block w-full px-4 py-3 border border-border rounded-md shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary sm:text-sm bg-input text-foreground"
              placeholder="tu@correo.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-muted-foreground mb-1">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none block w-full px-4 py-3 border border-border rounded-md shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary sm:text-sm bg-input text-foreground"
              placeholder="Tu contraseña"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition duration-150 ease-in-out"
            >
              {isLoading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </div>
        </form>
        <p className="mt-8 text-center text-sm text-muted-foreground">
          ¿No tienes una cuenta?{' '}
          <Link to="/register" className="font-medium text-primary hover:text-primary/80">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
