
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Loader2 } from 'lucide-react'; // Para un indicador visual

const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // En una aplicación real, aquí se limpiaría el estado de autenticación (token, etc.)
    // Por ejemplo: auth.signOut();
    console.log("Usuario cerró sesión. Redirigiendo a login...");
    
    // Simular una pequeña demora para la acción de logout y redirección
    const timer = setTimeout(() => {
      navigate('/login'); // Redirigir a la página de login
    }, 2000); // 2 segundos de espera

    return () => clearTimeout(timer); // Limpiar el temporizador si el componente se desmonta
  }, [navigate]);

  return (
    <Layout>
      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[calc(100vh-var(--header-height,10rem))]"> {/* Asumiendo que --header-height está definida o ajustar el valor */}
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2 text-foreground">Cerrando Sesión...</h1>
          <p className="text-muted-foreground">
            Serás redirigido a la página de inicio de sesión en breve.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default LogoutPage;
