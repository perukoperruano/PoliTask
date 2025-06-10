
// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Home, Folder, ListTodo, Settings, ChevronLeft, ChevronRight, Grid2x2 } from 'lucide-react';

/**
 * Componente Sidebar para la navegación principal.
 * Es colapsable y muestra iconos y etiquetas de menú.
 */
const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { to: "/dashboard", icon: Home, label: "Inicio" },
    { to: "/projects", icon: Folder, label: "Proyectos" },
    { to: "/tasks", icon: ListTodo, label: "Mis Tareas" },
    { to: "/settings", icon: Settings, label: "Configuración" },
  ];

  return (
    <aside
      className={`bg-card border-r-2 border-gray-100 text-card-foreground flex flex-col transition-all duration-300 ease-in-out h-full shadow-lg
                  ${isCollapsed ? 'w-20' : 'w-64'}`}
    >
      {/* Cabecera del Sidebar con el botón de colapsar/expandir */}
      <div className={`p-4 flex items-center justify-between border-b border-border h-16 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && (
          <Link to="/" className="text-lg font-semibold text-primary whitespace-nowrap">
            Menú
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-md hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Elementos de Navegación */}
      <nav className="flex-grow p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end // Asegura que solo la ruta exacta esté activa
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg transition-colors duration-200 ease-in-out
               ${isActive
                 ? 'bg-primary text-primary-foreground shadow-sm'
                 : 'hover:bg-muted/60 hover:text-accent-foreground'
               }
               ${isCollapsed ? 'justify-center' : ''}`
            }
            title={item.label} // Tooltip para modo colapsado
          >
            <item.icon size={isCollapsed ? 24 : 20} className={!isCollapsed ? 'mr-3' : ''} />
            {!isCollapsed && <span className="font-medium">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer del Sidebar (Opcional) */}
      <div className="p-4 border-t border-border mt-auto">
        {isCollapsed ? (
          <Grid2x2 size={24} className="mx-auto text-muted-foreground" />
        ) : (
          <p className="text-xs text-center text-muted-foreground">
            © 2025 Gestor de Tareas
          </p>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
