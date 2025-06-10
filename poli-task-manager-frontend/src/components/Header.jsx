import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, LogOut, LockKeyholeIcon as Lock } from 'lucide-react';
import UserAvatar from './UserAvatar';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from './ui/popover';
import { Button } from './ui/button';

/**
 * Componente Header de la aplicación.
 * Muestra el título, un campo de búsqueda y acciones de usuario.
 */
const Header = () => {
  const userName = "Usuario Ejemplo";
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleChangePassword = () => {
    navigate('/change-password');
  };

  const handleLogout = () => {
    navigate('/logout');
  };

  return (
    <header className="bg-card border-b border-border p-4 flex items-center justify-between sticky top-0 z-50 h-16">
      {/* Logo o Título de la App */}
      <div className="text-xl font-bold text-primary">
        Gestor de Tareas
      </div>

      {/* Barra de Búsqueda */}
      <div className="flex-1 max-w-md mx-4">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="search"
            placeholder="Buscar proyectos, tareas..."
            className="w-full py-2 px-4 pr-10 rounded-lg border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary">
            <Search className="h-5 w-5" />
          </button>
        </form>
      </div>

      {/* Iconos de Usuario y Notificaciones */}
      <div className="flex items-center space-x-4">
        <button className="text-muted-foreground hover:text-primary">
          <Bell size={24} />
        </button>
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center text-muted-foreground hover:text-primary focus:outline-none">
              <UserAvatar name={userName} size="sm" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2">
            <div className="grid gap-1">
              <Button
                variant="ghost"
                className="w-full justify-start px-2 py-1.5 text-sm"
                onClick={handleChangePassword}
              >
                <Lock className="mr-2 h-4 w-4" />
                Cambiar Contraseña
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start px-2 py-1.5 text-sm"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};

export default Header;
