
// src/App.jsx
import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Importar Páginas (ahora .jsx)
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ProjectPage from "./pages/ProjectPage.jsx";
import TaskDetailPage from "./pages/TaskDetailPage.jsx";
import ProjectsPage from "./pages/ProjectsPage.jsx";
import TasksPage from "./pages/TasksPage.jsx";
import SearchResultsPage from "./pages/SearchResultsPage.jsx";
import NotFound from "./pages/NotFound.jsx";
import ChangePasswordPage from "./pages/ChangePasswordPage.jsx"; // <-- Nueva página
import LogoutPage from "./pages/LogoutPage.jsx"; // <-- Nueva página

const queryClient = new QueryClient();

// TODO: Crear un contexto de Autenticación para manejar el estado del usuario
// y proteger rutas. Por ahora, todas las rutas después de login son accesibles.

/**
 * Componente principal de la aplicación.
 * Configura el proveedor de React Query y el enrutador.
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rutas Protegidas (requerirían autenticación en una app real) */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/project/:projectId" element={<ProjectPage />} />
        <Route path="/project/:projectId/task/:taskId" element={<TaskDetailPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} /> {/* <-- Nueva ruta */}
        <Route path="/logout" element={<LogoutPage />} /> {/* <-- Nueva ruta */}
        {/* TODO: Añadir más rutas protegidas (e.g., /settings) */}
        
        {/* Ruta raíz: redirige a login o dashboard si está autenticado */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Ruta para páginas no encontradas (404) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
